import React from 'react';
import {Link} from 'react-router-dom'
import './Home.css'

const Home = (props) => {
    console.log(props)

    const renderButton = () => {
      if (props.name !== '') {
        return  <Link to="/userDashboard">
                    <button className="button-74-home">START</button>
                </Link>
      } else {
        return <Link to="/login">
                    <button className="button-74-home">START</button>
                </Link>
      }
    }
    return (
        <div className="home-page">
           <h1 className="home-title">{props.name ? 'Welcome to your dashboard ' + props.name : 'Welcome to DASHBOARD'}</h1>
           <h3 className="home-text">Here you will be able to select between a wide variety of services such as: weather applications, flight search or news. Create an account and save those services into your profile so you can use them whenever you are in need. Dashboard will keep including new services into the application in the near future.</h3>
           <div className="home-buttons">
               {renderButton()}
           </div>
        </div>
    );
};

export default Home;