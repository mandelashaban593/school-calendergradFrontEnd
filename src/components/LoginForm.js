import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
            const { token, user } = response.data;

            var userdata = JSON.stringify(user);
            console.log("User data", userdata);


            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to dashboard or another protected route
            router.push('/dashboard');
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('HTTP error:', error.response.data);
                setError('Login failed. Please check your credentials.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Network error:', error.request);
                setError('Network error. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Error:', error.message);
                setError('An unexpected error occurred.');
            }

            // Alert the user about the error
            alert(error.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Log In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        type="email"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" size="large">
                        Log In
                    </Button>
                </form>

                {error && (
                    <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>
                        {error}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default LoginForm;
