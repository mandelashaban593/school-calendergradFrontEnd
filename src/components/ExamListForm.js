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
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS


const ExamController = () => {
    const [exams, setExams] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editExam, setEditExam] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalExams, setTotalExams] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [name, setName] = useState('');
    const [examDate, setExamDate] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []); 

    useEffect(() => {
        fetchExams();
    }, [page, rowsPerPage]);

    const fetchExams = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/exams', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            setExams(response.data.data);
            setTotalExams(response.data.total);
        } catch (error) {
            console.error('Failed to fetch exams:', error);
        }
    };

    const handleAddExam = () => {
        setOpenFormDialog(true);
        setEditExam(null);
        setName('');
        setExamDate(null);
    };

    const handleEditExam = (exam) => {
        setOpenFormDialog(true);
        setEditExam(exam);
        setName(exam.name);
        setExamDate(new Date(exam.exam_date));
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = async () => {
        try {
            const newData = {
                name: name,
                exam_date: examDate.toISOString(),
            };

            if (editExam) {
                await axios.put(`http://127.0.0.1:8000/api/exams/${editExam.id}`, newData);
                alert('Exam edited successfully');
            } else {
                await axios.post('http://127.0.0.1:8000/api/exams', newData);
                alert('Exam saved successfully');
            }

            fetchExams();
            setOpenFormDialog(false);
        } catch (error) {
            console.error('Failed to save exam:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteExam = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/exams/${id}`);
            fetchExams();
        } catch (error) {
            console.error('Failed to delete exam:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchName(event.target.value);
    };

    const filteredExams = exams.filter((exam) =>
        exam.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleExamDateChange = (date) => {
        setExamDate(date);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleAddExam}>
                Add Exam
            </Button>
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editExam ? 'Edit Exam' : 'Add Exam'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        margin="dense"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />
                    <DatePicker
                        selected={examDate}
                        onChange={handleExamDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="form-control datepicker-wrapper"
                        popperClassName="datepicker-popper"
                        calendarClassName="datepicker-calendar"
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
                            <TableCell>Name</TableCell>
                            <TableCell>Exam Date</TableCell>
                            {userRole === 'admin' && (
                                <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExams.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell>{exam.name}</TableCell>
                                <TableCell>{new Date(exam.exam_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    
                                    {userRole === 'admin' && (
                                        <>
                                        <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditExam(exam)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteExam(exam.id)}
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
                count={totalExams}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ExamController;
