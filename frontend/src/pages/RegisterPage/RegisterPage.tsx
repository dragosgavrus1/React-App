import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';
import './RegisterPage.css'; // Assuming you have a separate CSS file for styling

const RegisterPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/register', formData);
        // Your registration logic here
        console.log('Registration form submitted:', response.data);
        navigate('/login');
    } catch (error) {
        console.error('Registration failed:', error);
    }
  };

  return (
    <div className="register-page-container">
      <Typography variant="h5" component="h1" gutterBottom>
        Register Page
      </Typography>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <Button variant="contained" type="submit" className="buttons">Register</Button>
        <RouterLink to="/">
            <Button className='buttons'>Back to Home</Button>
        </RouterLink>
      </form>
    </div>
  );
};

export default RegisterPage;
