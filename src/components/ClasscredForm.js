import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import authService from '../services/authService';

const ClasscredForm = () => {
    const [formData, setFormData] = useState({
        name: '' // Changed from email and password to name
    });
    const router = useRouter();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await authService.classcred(formData); // Changed from authService.classcred
            alert('Class saved successfully');
            router.push('/dashboard'); // Redirect to dashboard page after successful registration
        } catch (error) {
            alert('Class saving failed');
            console.error(error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                   Class
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        type="text" // Changed from name to text
                        label="Class"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    
                    <Button type="submit" variant="contained" color="primary" size="large">
                        Save
                    </Button>
                </form>
             
            </Box>
        </Container>
    );
};

export default ClasscredForm;
