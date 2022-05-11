const express = require("express")
const app = express()
var session = require('express-session')
const cookieSession = require("cookie-session")
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const cors = require('cors');
const generateAccessToken = require("./generateAccessToken")
const jwt = require("jsonwebtoken")
const { authorizationAdmin } = require('./authAdmin')
const { authorizationUser } = require('./userAuth')
const passport = require("passport");
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const fetch = require("node-fetch");
const path = require("path")
const Amadeus = require("amadeus");
const { CLIENT_ID, CLIENT_SECRET } = require('./config');




require('./passport-setup')



require("dotenv").config()
app.use(express.json())


app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())






const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
})

db.getConnection((err, connection) => {
    if (err) throw (err)
    console.log("DB connected successful: " + connection.threadId)
})

const port = process.env.PORT
app.listen(port,
    () => console.log(`Server Started on port ${port}...`))

//REGISTER USER
app.post("/auth/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const role = req.body.role;

    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM users WHERE email = ?"
        const search_query = mysql.format(sqlSearch, [email])
        const sqlInsert = `INSERT INTO users (name, password, email, role) VALUES ("${name}", "${hashedPassword}", "${email}", "${role}")`
        const insert_query = mysql.format(sqlInsert)
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Results")
            if (result.length != 0) {
                connection.release()
                console.log("------> User already exists")
                res.sendStatus(409)
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Created new User")

                    res.sendStatus(201)
                })
            }
        }) //end of connection.query()
    }) //end of db.getConnection()
}) //end of app.post()

// REGISTER USER GOOGLE STRATEGY//
app.get('/good', (req, res) => {
    res.send('hey')
})

app.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }), function (req, res) { });


app.get("/google/callback", function (req, res) {
    passport.authenticate("google", function (err, result, info) {
        if (err) {
            res.status(404).json(err);
            return;
        }

        if (result) {
            res.cookie('jwt', result, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.redirect('http://localhost:3000')
        } else {
            res.status(401).json(info);
        }
    })(req, res);
});



//LOGIN (AUTHENTICATE USER)
app.post("/auth/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "Select * from users where email = ?"
        const search_query = mysql.format(sqlSearch, [email])
        await connection.query(search_query, async (err, result) => {
            connection.release()
            if (err) throw (err)
            if (result.length == 0) {
                console.log("--------> User does not exist in login")
                res.sendStatus(404)
            }
            else {
                const hashedPassword = result[0].password
                const userRole = result[0].role
                //get the hashedPassword from result
                if (await bcrypt.compare(password, hashedPassword)) {
                    const token = generateAccessToken({ user: email, role: userRole })
                    const { password, ...data } = await result[0]
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000
                    })
                    res.json({ accessToken: token, data })

                }
                else {
                    console.log("---------> Password Incorrect")
                    res.send("Password incorrect!")
                } //end of bcrypt.compare()
            }//end of User exists i.e. results.length==0
        }) //end of connection.query()
    }) //end of db.connection()
}) //end of app.post()


//AUTHENTICATED USER

app.get("/auth/user", (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET)
        if (!claims) {
            return res.sendStatus(401)
        }
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM users WHERE email = ?"
            const search_query = mysql.format(sqlSearch, [claims.user])
            await connection.query(search_query, async (err, result) => {
                connection.release()

                if (err) throw (err)

                if (result.length == 0) {
                    console.log("--------> User does not exist")
                    res.sendStatus(404)
                }
                else {
                    const { password, created_at, ...data } = result[0]

                    res.send(data)

                }//end of User exists i.e. results.length==0
            }) //end of connection.query()
        })
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }

})


//LOGOUT USER

app.post("/auth/logout", (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 0
    })
    res.send({
        message: 'succesful logout'
    })
})


// SERVICES
app.get('/services', (req, res) => {
    res.send('Show all services')
})

app.post('/services', authorizationAdmin, (req, res) => {
    try {
        const name = req.body.name;
        const permission = req.body.permission;
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `INSERT INTO services (name, permission) VALUES ("${name}", "${permission}")`
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Created new Service")

                res.sendStatus(201)
            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }

}) //end of db.getConnection()

//welcome, register via google, home page, go to empty profile, go to dashboard, select services, show them in your profile
//log in via google
//normal login as admin, show admin panel on top
// access all services => flights, news, weather

//PERSONAL DASHBOARD

//Get users services

app.get('/user/dashboard/:user_id', authorizationUser, (req, res) => {
    try {
        const user_id = req.params.user_id;
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT services.name FROM services INNER JOIN user_services ON services.service_id = user_services.service_id WHERE user_services.user_id = ?;"
            const search_query = mysql.format(sqlSearch, [user_id])
            await connection.query(search_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Service sended")

                res.send(result)
            })
        }) //end of connection.query()

    } catch (e) {
        console.log(e)

    }

})

//ADD SERVICE TO USER DASHBOARD

app.post('/user/dashboard', authorizationUser, (req, res) => {
    try {
        const user_id = req.body.user_id;
        const service_id = req.body.service_id;
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `INSERT INTO user_services (user_id, service_id) VALUES (${user_id}, ${service_id})`
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Added Service to User")

                res.sendStatus(201)
            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})


//DELETE SERVICE FROM USER DASHBOARD
app.delete('/user/dashboard', authorizationUser, (req, res) => {
    try {
        const user_id = req.body.user_id;
        const service_id = req.body.service_id;
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlDelete = `DELETE FROM user_services WHERE user_id = ${user_id} AND service_id = ${service_id}`
            const delete_query = mysql.format(sqlDelete)
            await connection.query(delete_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Deleted Service from User")
                res.sendStatus(202)
            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})


//GET SERVICE BY NAME

app.get('/services/:name', (req, res) => {
    try {
        const name = req.params.name;
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM services WHERE name = ?"
            const search_query = mysql.format(sqlSearch, [name])
            await connection.query(search_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Service sended")

                res.send(result[0])
            })
        }) //end of connection.query()

    } catch (e) {
        console.log(e)

    }
})







///skyscanner//
app.post('/user/dashboard/flights/search', async (req, res) => {
    const currency = req.body.currency;
    const origin = req.body.origin;
    const destination = req.body.destination;
    const departure_at = req.body.departure_at;
    const return_at = req.body.return_at;
    const direct = req.body.direct;
    const limit = 30;
    const page = 1;
    const sorting = 'price';
    const unique = false;
    const one_way = req.body.one_way;
    // console.log("curre " + currency + "departure" + departure_at + "return" + return_at + "direct" + direct + "one wat" + one_way) 
    const apiKey = 'aa6f380200af6b5bcb9395028f8f4d13'

    //AMADEUS TOKEN 1ST//
    const getAmadeusKey = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: "POST",
        body: new URLSearchParams({
            "grant_type": "client_credentials",
            "client_id": process.env.CLIENT_ID_AMADEUS,
            "client_secret": process.env.CLIENT_SECRET_AMADEUS
        })
    })
    const amadeusKey = await getAmadeusKey.json();
    const token = amadeusKey.access_token;
    


    //DESTINATION && RETURN IATA CODES//
    const airports = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${origin}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    const airportData = await airports.json();
    const originIata = airportData.data[0].iataCode

    // const airports2 = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${destination}`, {
    //     headers: {
    //         "Authorization": "Bearer " + token
    //     }
    // })
    

    // const airportData2 = await airports2.json();
    // // const destinationIata = await airportData2.data[0].iataCode
    

    const delay = async () => {
        const airports2 = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${destination}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })


        const airportData2 = await airports2.json();
        let destinationIata = await airportData2.data[0].iataCode
        
        const response = await fetch(`https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${originIata}&destination=${destinationIata}&departure_at=${departure_at}&return_at=${return_at}&unique=${unique}&sorting=${sorting}&direct=${direct}&currency=${currency}&limit=${limit}&page=${page}&one_way=${one_way}&token=${apiKey}`)
        const test = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${originIata}&destination=${destinationIata}&departure_at=${departure_at}&return_at=${return_at}&unique=${unique}&sorting=${sorting}&direct=${direct}&currency=${currency}&limit=${limit}&page=${page}&one_way=${one_way}&token=${apiKey}`
        console.log(test)
        const data = await response.json();
    
        res.send(data)
    }
    setTimeout(delay, 1000);

   
})


//AMADEUS KEY//



