import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@material-ui/core';

const ExamScoreController = () => {
    const [examScores, setExamScores] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editExamScore, setEditExamScore] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalExamScores, setTotalExamScores] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [score, setScore] = useState('');
    const [classId, setClassId] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []); 

    useEffect(() => {
        fetchExamScores();
        fetchStudents();
        fetchSubjects();
        fetchClasses();
    }, [page, rowsPerPage]);

    const fetchExamScores = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/exam-scores', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            console.log("Response data:", response.data); // Logging response data to console
            setExamScores(response.data.data);
            setTotalExamScores(response.data.total);
        } catch (error) {
            console.error('Failed to fetch exam scores:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users', {
                params: {
                    role: 'student'
                }
            });
            setStudents(response.data.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/subjects');
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-class-names');
            setClasses(response.data);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        }
    };

    const handleAddExamScore = () => {
        setOpenFormDialog(true);
        setEditExamScore(null);
        setStudentId('');
        setSubjectId('');
        setScore('');
        setClassId('');
    };

    const handleEditExamScore = (examScore) => {
        setOpenFormDialog(true);
        setEditExamScore(examScore);
        setStudentId(examScore.student_id);
        setSubjectId(examScore.subject_id);
        setScore(examScore.score);
        setClassId(examScore.class_id);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = async () => {
        try {
            const newData = {
                student_id: studentId,
                subject_id: subjectId,
                score: score,
                class_id: classId,
            };

            if (editExamScore) {
                await axios.put(`http://127.0.0.1:8000/api/exam-scores/${editExamScore.id}`, newData);
                alert('Exam score edited successfully');
            } else {
                await axios.post('http://127.0.0.1:8000/api/exam-scores', newData);
                alert('Exam score saved successfully');
            }

            fetchExamScores();
            setOpenFormDialog(false);
        } catch (error) {
            console.error('Failed to save exam score:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteExamScore = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/exam-scores/${id}`);
            fetchExamScores();
        } catch (error) {
            console.error('Failed to delete exam score:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchName(event.target.value);
    };

    const filteredExamScores = examScores.filter((examScore) => {
        if (examScore.exam_id && typeof examScore.exam_id === 'string') {
            return examScore.exam_id.toLowerCase().includes(searchName.toLowerCase());
        }
        return false;
    });

    const handleStudentIdChange = (event) => {
        setStudentId(event.target.value);
    };

    const handleSubjectIdChange = (event) => {
        setSubjectId(event.target.value);
    };

    const handleScoreChange = (event) => {
        setScore(event.target.value);
    };

    const handleClassIdChange = (event) => {
        setClassId(event.target.value);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleAddExamScore}>
                Add Exam Score
            </Button>
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editExamScore ? 'Edit Exam Score' : 'Add Exam Score'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Student</InputLabel>
                        <Select
                            value={studentId}
                            onChange={handleStudentIdChange}
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>{student.email}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={subjectId}
                            onChange={handleSubjectIdChange}
                        >
                            {subjects.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={classId}
                            onChange={handleClassIdChange}
                        >
                            {classes.length > 0 ? (
                                classes.map((classItem) => (
                                    <MenuItem key={classItem.id} value={classItem.id}>{classItem.name}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No classes available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Score"
                        margin="dense"
                        type="number"
                        value={score}
                        onChange={handleScoreChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFormDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <TextField
                label="Search by Name"
                margin="dense"
                value={searchName}
                onChange={handleSearch}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Class Name</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Score</TableCell>
                            {userRole === 'admin' && (
                                <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examScores.map((examScore) => (
                            <TableRow key={examScore.id}>
                                <TableCell>{examScore.student_name}</TableCell>
                                <TableCell>{examScore.email}</TableCell>
                                <TableCell>{examScore.first_name}</TableCell>
                                <TableCell>{examScore.last_name}</TableCell>
                                <TableCell>{examScore.phone_number}</TableCell>
                                <TableCell>{examScore.class_name}</TableCell>
                                <TableCell>{examScore.subject_name}</TableCell>
                                <TableCell>{examScore.score}</TableCell>
                                <TableCell>
                                    
                                    {userRole === 'admin' && (
                                        <>
                                       <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditExamScore(examScore)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleDeleteExamScore(examScore.id)}
                                    >
                                        Delete
                                    </Button>
                                            </>
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalExamScores}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ExamScoreController;
