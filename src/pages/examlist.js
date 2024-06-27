import ExamListForm from '../components/ExamListForm';
import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link from next/link instead of react-router-dom
import ProtectedRoute from '../components/ProtectedRoute';
import authService from '../services/authService';
import CreateIcon from '@mui/icons-material/Create';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ExamListPage = () => {
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
    
    const handleBack = () => {
        router.push('/dashboard'); // Redirects to /dashboard
    };
    
    return (
        <ProtectedRoute>
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
                                    
                                        <Button onClick={handleBack} variant="contained" color="primary">
                                            Back to Dashboard
                                        </Button>               
                                  
                                        <Button onClick={handleLogout} variant="contained" color="secondary">
                                            Logout
                                        </Button>
              
                              
                                 
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} sx={{ height: '100%', padding: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* Back Button */}
                                   
                                    {/* Logout Button */}
                                    
                                    <Typography variant="h4" gutterBottom align="center">
                                    <ExamListForm />
                                    </Typography>
                                </Box>
                        
                       
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </ProtectedRoute>
    );
};

export default ExamListPage;

