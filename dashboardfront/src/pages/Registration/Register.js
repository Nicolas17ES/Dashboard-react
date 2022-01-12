import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  let navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {

    e.preventDefault();

    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        password,
        email,
      })
    });
    console.log(response)
    if (response.status === 201) {
      navigate('/login')
    }
  }


  return (
    <div className="access">
      <form onSubmit={submit}>

        <div className="form-floating">
          <input type="text" className="form-control" id="name" placeholder="Name" required
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor="name">Username</label>

        </div>
        <div className="form-floating">
          <input type="email" className="form-control" id="email" placeholder="name@example.com" required
            onChange={e => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email address</label>


        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="pass" placeholder="Password" autoComplete="on" required
            onChange={e => setPassword(e.target.value)}
          />
          <label htmlFor="pass">Password</label>

        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
      </form>
      <a href="http://localhost:3001/google" className="google-btn">
        <div className="google-icon-wrapper">
          <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
        </div>
        <p className="btn-text"><b>Log in with google</b></p>
      </a>
    </div>

  );
};

export default Register;