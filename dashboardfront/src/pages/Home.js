import React from 'react';

const Home = (props) => {
    return (
        <div>
            {props.name ? 'Welcome to your dashboard ' + props.name : 'Login to view all your services'}
        </div>
    );
};

export default Home;