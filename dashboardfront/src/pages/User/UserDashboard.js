import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import Weather from '../../components/services/Weather/Weather';
import News from '../../components/services/News/News';
import GoogleMaps from '../../components/services/GoogleMaps/GoogleMaps'


const UserDashboard = () => {
    const [services, setServices] = useState([]);
    const { user } = useContext(UserContext)


    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`http://localhost:3001/user/dashboard/${user.user_id}`, {
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    if (response.status === 401) {
                        setServices('');


                    } else {
                        const data = await response.json();
                        let serviceName = [];
                        for (let i = 0; i < data.length; i++) {
                            serviceName.push(data[i].name)
                        }
                        setServices(serviceName);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        )();
    }, []);

    let weatherService;
    if (services.includes('Weather')) {
        weatherService = (
            < Weather exists={true} user={user}/>
        )
    }
    let newsService;
    if (services.includes('News')) {
        newsService = (
            < News exists={true} user={user}/>
        )
    }
    let googleService;
    if (services.includes('GoogleMaps')) {
        googleService = (
            < GoogleMaps exists={true} user={user}/>
        )
    }



    return (
        <div>
            <h1>Your private dashboard</h1>
            {newsService}
            {googleService}
            {weatherService}
        </div>
    );
};

export default UserDashboard;