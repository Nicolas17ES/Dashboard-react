import React, { useContext } from 'react';
import Weather from '../components/services/Weather/Weather';
import News from '../components/services/News/News';
import GoogleMaps from '../components/services/GoogleMaps/GoogleMaps'
import SearchFlight from '../components/services/Skyscanner/Skyscanner'

import { UserContext } from '../App'

import './Dashboard.css'



const Dashboard = () => {
    const { user } = useContext(UserContext)

    return (
        <div className="body">
            <div className="container">
                {/* WEATHER CARD */}
                <Weather user={user} />

                {/* NEWS CARD */}
                <News user={user} />
                {/* NEWS CARD */}
                <GoogleMaps user={user} />

                <SearchFlight user={user}/>

                
            </div>
        </div>
    )
};

export default Dashboard;