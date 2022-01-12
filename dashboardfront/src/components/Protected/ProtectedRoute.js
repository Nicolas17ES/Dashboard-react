import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import Home from '../../pages/Home';

const useAuth = () => {
    const [user, setUser] = useState(false);
    try {
        useEffect(() => {
            (
                async () => {
                    const response = await fetch('http://localhost:3001/auth/user', {
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    if (response.status === 401) {
                        setUser(false);

                    } else {
                        setUser(true);
                    }

                }
            )();
        }, []);
    } catch (e) {
        console.log(e)
    };
    return user;

}

const Protected = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Home />
};

export default Protected;