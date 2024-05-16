// LoginPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';
import './LoginPage.css';

const LoginPage = () => {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');

    if (token && expirationTime) {
      const currentTime = Date.now();
      console.log('Current time:', currentTime);
      const remainingTime = parseInt(expirationTime, 10) - currentTime;
      console.log('Remaining time:', remainingTime);

      if (remainingTime > 0) {
        // Token is still valid, reset the timer
        console.log('Token is still valid. Session will expire in', remainingTime / 1000, 'seconds.');
      } else {
        // Token has expired, logout the user
        logout();
        console.log('Token has expired. User logged out.');
      }
    }
  };

  useEffect(() => {
    // Check token validity on page load
    checkTokenValidity();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://16.170.236.247:3000/login`, formData);
      const { token } = response.data;

      // Store token and expiration time in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', formData.username);

      // Calculate expiration time (15 minutes from now)
      const expirationTime = Date.now() + 15 * 60 * 1000; // Current time + 15 minutes
      localStorage.setItem('expirationTime', expirationTime.toString());

      // Set a timer to logout the user when the token expires
      setTimeout(logout, expirationTime - Date.now());
      setIsLoggedIn(true);
      console.log('User logged in:', response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    // Clear token and session-related data from local storage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimer');
    setIsLoggedIn(false);
    // Optionally, redirect the user to the login page or perform any other necessary actions
  };

  const getRemainingTime = () => {
    const expirationTime = parseInt(localStorage.getItem('expirationTime') ?? '0');
    const currentTime = Date.now();
    const timeDifference = expirationTime - currentTime;
    const remainingSeconds = Math.max(0, Math.floor(timeDifference / 1000)); // Calculate remaining seconds
    return remainingSeconds;
  };

  function handleRegister(): void {
    navigate('/register');
  }

  return (
    <div className="login-page-container">
      <Typography variant="h5" component="h1" gutterBottom>
        Login Page
      </Typography>
      {isLoggedIn ? ( // Render different content if user is logged in
        <div className="action-buttons">
          <Typography variant="body1" gutterBottom>
            You are logged in as: {localStorage.getItem('username')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your session will expire in: {getRemainingTime()} seconds
          </Typography>
          <Button variant="contained" onClick={logout} className='buttons'>Logout</Button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            margin="normal"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button variant="contained" type='submit' className="buttons">Login</Button>
          <Button variant="contained" onClick={handleRegister} className='buttons'>Register</Button>
        </form>
      )}
      <div className="action-buttons">
        <RouterLink to="/">
          <Button className='buttons'>Back to Home</Button>
        </RouterLink>
      </div>
    </div>
  );
};

export default LoginPage;
