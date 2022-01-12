import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import Weather from '../../components/services/Weather/Weather';

import News from '../../components/services/News/News';
import GoogleMaps from '../../components/services/GoogleMaps/GoogleMaps'
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

    let weatherService;
    if (services.includes('Weather')) {
        < Weather exists={true} user={user}/>
    }
    let newsService;
    if (services.includes('News')) {
        newsService = < News exists={true} user={user} />
    }
    let googleService;
    if (services.includes('GoogleMaps')) {
        googleService = < GoogleMaps exists={true} user={user} />
    }


    const ServiceList = [
        {
            id: 1,
            name: < Weather exists={true} user={user} />
            // ...((services.includes('Weather'))) && { name: < Weather exists={true} user={user} />} 
        },
        {
            id: 2,
            name: <News exists={true} user={user} /> 
        },
        {
            id: 3,
            name: <GoogleMaps exists={true} user={user}  /> 
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
    }



    return (
        <>
            <div className="myServices">
                {ServiceList.map((service) => {
                    return <Service draggable={service.name} id={service.id} />;
                })}
                {/* <h1>Your private dashboard</h1>
                {newsService}
                {googleService}
                {weatherService} */}
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