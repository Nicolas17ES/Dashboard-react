import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import Weather from '../../components/services/Weather/Weather';

import News from '../../components/services/News/News';
import GoogleMaps from '../../components/services/GoogleMaps/GoogleMaps'
import FlightSearch from '../../components/services/Skyscanner/Skyscanner'
import Service from './Service';
import { useDrop } from 'react-dnd';


const UserDashboard = () => {
    const [services, setServices] = useState([]);
    const { user } = useContext(UserContext);

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
                        console.log(services)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        )();
    }, []);

    const ServiceList = [
        {
            id: 0,
            name: < Weather exists={true} user={user} />,
            component: "Weather",
        },
        {
            id: 1,
            name: <News exists={true} user={user} />,
            component: "News",
        },
        {
            id: 2,
            name: <GoogleMaps exists={true} user={user} />,
            component: "GoogleMaps",
        },
        {
            id: 3,
            name: <FlightSearch exists={true} user={user} />,
            component: "FlightSearch",
        }
    ]

    const [board, setBoard] = useState([]);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "component",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    const addImageToBoard = (id) => {
        const serviceList = ServiceList.filter((service) => id === service.id)
        setBoard((board) => [...board, serviceList[0]])
        const number = serviceList[0].id
        const toHide = document.querySelectorAll('[draggable="true"]')
        for (let i = 0; i < toHide.length; i++) {
            toHide[number].style.display = "none";
        }
    }

    return (
        <>
            <div className="myServices">
                {ServiceList.map((service) => {
                    if (services.includes(service.component)) {
                        return <Service draggable={service.name} id={service.id} />;
                    }
                })}
            </div>

            <div className="Board" ref={drop}>
                {board.map((service) => {
                    return <Service draggable={service.name} id={service.id} />
                })}
            </div>
        </>
    );
};

export default UserDashboard;


// skyscanner search flight
//google translate api
//youtube search
// google seaarch api
//crypto currency https://rapidapi.com/BraveNewCoin/api/bravenewcoin
// market data
// Shazam api documentation
//Amazon Product/Reviews/Keywords API Documentation
//full contact api https://www.fullcontact.com/developer-portal/
//Twitter or facebook api + oauth
//