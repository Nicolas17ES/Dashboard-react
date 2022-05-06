import React from 'react';
import { Link } from "react-router-dom";
import '../pages/Dashboard.css'

const Nav = (props) => {


    const logout = async () => {
        await fetch('http://localhost:3001/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',

        });
        props.setName('');
    }


    let menu;

    if (props.name === '' || props.name === undefined) {
        menu = (
            <ul className="navbar-nav mb-2 mb-md-0">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">LogIn</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link" >Register</Link>
                </li>
            </ul>
        )
    } else {
        menu = (
            <ul className="navbar-nav mb-2 mb-md-0">
                <li className="nav-item">
                    <Link to="/userDashboard" className="nav-link" >{props.name}</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link" onClick={logout}>Log Out</Link>
                </li>
            </ul>
        )
    }

    let admin;
    if (props.user.role === 'admin') {
        admin = (
            <li className="nav-item">
                <Link to="/admin" className="nav-link">Admin Panel</Link>
            </li>
        )
    }
    


    return (
        <nav className="navbar navbar-expand-md  mb-4">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">DASH</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page" >Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        {admin}
                    </ul>
                    {menu}
                </div>
            </div>
        </nav>
    );
};

export default Nav;


