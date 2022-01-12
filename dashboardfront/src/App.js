import './App.css';
import LogIn from './pages/Registration/LogIn';
import Register from './pages/Registration/Register';
import Home from './pages/Home';
import Nav from './components/Nav';
import UserDashboard from './pages/User/UserDashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect, createContext } from 'react'
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import AdminPanel from './pages/Admin/AdminPanel';
import ProtectedRouteAdmin from './components/Protected/ProtectedRouteAdmin';
import Weather from './components/services/Weather/Weather';
import News from './components/services/News/News';
import GoogleMaps from './components/services/GoogleMaps/GoogleMaps'

export const UserContext = createContext(null)

function App() {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');


  try {
    useEffect(() => {
      (
        async () => {
          const response = await fetch('http://localhost:3001/auth/user', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          if (response.status === 401) {
            setName('');
            setUser('');

          } else {
            const data = await response.json();
            setName(data.name);
            setUser(data);
          }

        }
      )();
    }, [name]);
  } catch (e) {
    console.log(e)
  };

  return (
    <div className="App main">
      

      {/* ROUTES */}
      <BrowserRouter>

        <Nav name={name} setName={setName} user={user} />
        <main>
          <UserContext.Provider value={{ user }}>

            <Routes>

              <Route path="/" element={<Home name={name} />} />
              <Route path="/login" element={<LogIn setName={setName} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />

              <Route element={<ProtectedRouteAdmin />}>
                <Route path="/admin" element={< AdminPanel />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/userDashboard" element={<UserDashboard />} />
              </Route>

            </Routes>
          </UserContext.Provider>        
        </main>
      </BrowserRouter>


    </div>
  );
}

export default App;
