import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import Home from '../../pages/Home';

const useAuthAdmin = () => {
    const [admin, setAdmin] = useState(false);
    try {
        useEffect(() => {
            (
                async () => {
                    const response = await fetch('http://localhost:3001/auth/user', {
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    if (response.status === 401) {
                        setAdmin(false);

                    } else {
                        const data = await response.json();
                        if (data.role === 'admin') {
                            setAdmin(true)
                        }
                    }

                }
            )();
        }, []);
    } catch (e) {
        console.log(e)
    };
    return admin;

}

const ProtectedAdmin = () => {
    const isAuth = useAuthAdmin();
    return isAuth ? <Outlet /> : <Home />
};

export default ProtectedAdmin;