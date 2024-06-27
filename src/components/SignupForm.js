import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useRouter } from 'next/router';
import authService from '../services/authService';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const router = useRouter();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await authService.register(formData);
            alert('Registration successful');
            router.push('/login'); // Redirect to login page after successful registration
        } catch (error) {
            alert('Registration failed');
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
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
                        Sign Up
                    </Button>
                </form>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Already have an account?{' '}
                    <Link href="/login" underline="hover">
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignupForm;
