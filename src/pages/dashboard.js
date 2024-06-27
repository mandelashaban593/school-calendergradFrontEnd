// pages/dashboard.js


import Dashboard from '../components/Dashboard';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import authService from '../services/authService';


const DashboardPage = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authService.logout();
            localStorage.removeItem('token');
            router.push('/login'); // Redirect to login after logout
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ProtectedRoute>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                         
                            <Typography variant="h4" gutterBottom align="center">
                                
                                <Dashboard />
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ProtectedRoute>
    );
};

export default DashboardPage;

