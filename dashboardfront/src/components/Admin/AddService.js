import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../pages/Registration/Registration.css'

export default function AddService() {
    let navigate = useNavigate();

    const [name, setName] = useState('');
    const [permission, setPermission] = useState('');


    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    permission
                })
            });
            console.log(response)
            if (response.status === 201) {
                setName('');
                setPermission('');
                navigate('/dashboard')
            }
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div>
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Submit service data</h1>

                <div className="form-floating">
                    <input type="text" className="form-control" id="name" placeholder="Name" required
                        onChange={e => setName(e.target.value)}
                    />
                    <label htmlFor="name">Service name</label>

                </div>
                <div className="form-floating">
                    <input type="text" className="form-control" id="permission" placeholder="private/public" required
                        onChange={e => setPermission(e.target.value)}
                    />
                    <label htmlFor="permission">Service permission level</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Submit service</button>
            </form>
        </div>

    );
}
