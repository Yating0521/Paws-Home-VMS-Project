import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Event from './pages/Event';
import Message from './pages/Message';
import LogHours from './pages/LogHours';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import AdminPage from './pages/AdminPage.js';
import AdminEvent from './pages/AdminEvent.js';
import Handbook from './pages/Handbook.js';
import './App.css';
import Logo from './assets/logos/PawsHome_Logo.png';

function App() {

  const [role, setRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedRole && storedUserId) {
      setRole(storedRole);
      setCurrentUserId(storedUserId);
    }
    setLoading(false); 
  }, []);

  if (loading) return null;

  const handleLogin = (userRole, userId) => {
    setRole(userRole);
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('role', userRole);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUserId(null);
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <div className="app-container">
        <header className="site-header">
          <div className="header-container">
            <Link to="/" className="logo">
              <img src={Logo} alt="PawsHome" />
            </Link>

            {role && (
              <nav className="navbar">
                {role === 'volunteer' && (
                  <>
                    <Link to="/schedule">SCHEDULE</Link>
                    <Link to="/event">EVENT</Link>
                    <Link to="/message">MESSAGE</Link>
                    <Link to="/loghours">LOG YOUR HOURS</Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link to="/adminPage">VOLUNTEER MANAGEMENT</Link>
                    <Link to="/adminEvent">EVENT MANAGEMENT</Link>
                  </>
                )}

                <button className="btn-logout" onClick={handleLogout}>Logout</button>

              </nav>
            )}
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/handbook" element={<Handbook />} />

            {/* Volunteer Routes */}
            <Route
              path="/schedule"
              element={role === 'volunteer' ? <Schedule currentUserId={currentUserId} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/event"
              element={role === 'volunteer' ? <Event currentUserId={currentUserId} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/message"
              element={role === 'volunteer' ? <Message currentUserId={currentUserId} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/loghours"
              element={role === 'volunteer' ? <LogHours currentUserId={currentUserId} /> : <Navigate to="/login" replace />}
            />


            {/* Admin Routes */}
            <Route
              path="/adminPage"
              element={role === 'admin' ? <AdminPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/adminEvent"
              element={role === 'admin' ? <AdminEvent /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>

        <footer>&copy; 2025 Paws Home</footer>
      </div>
    </Router>
  );
}

export default App;
