// pages/dashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link instead of react-router-dom
import CreateIcon from '@mui/icons-material/Create';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Dashboard = () => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []); 

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
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                        <Typography variant="h5" gutterBottom>Menu</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Link href="/classlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Class
                                                </Button>
                                    </Link>
                                 
                                    <Link href="/lessonlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Lessons
                                                </Button>
                                    </Link>
                                    
                                    <Link href="/lesscalenderlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Lesson Calender
                                                </Button>
                                    </Link>
                                    <Link href="/attendlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Attendance
                                                </Button>
                                    </Link>
                                    <Link href="/subjectlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Subjects
                                                </Button>
                                    </Link>
                                    <Link href="/examlist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                   Exams
                                                </Button>
                                    </Link>
                                    <Link href="/examscorelist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                   Exam Scores
                                                </Button>
                                    </Link>
                                    <Link href="/examreportlist" passHref>
                                                
                                               
                                                        
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Report Cards
                                                </Button>
                                                        
                                            
                                    </Link>
                                    <Link href="/userdatalist" passHref>
                                                <Button variant="outlined" sx={{ marginTop: 1 }}>
                                                    Users
                                                </Button>

                                                
                                    </Link>
                                    
                                    <Button onClick={handleLogout} variant="contained" color="secondary">
                                            Logout
                                        </Button>
                                 
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                        <Typography variant="h4" gutterBottom align="center">Statistics</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <CreateIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <MenuBookIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <PersonIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <EmojiPeopleIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <GradeIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <EventIcon />
                            </IconButton>
                            <IconButton sx={{ fontSize: 48, margin: 2 }} color="primary">
                                <AssessmentIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
