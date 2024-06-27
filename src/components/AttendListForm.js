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

const statuses = ['Attended', 'Absent', 'Sick', 'Dismissed', 'Suspended'];

const AttendanceController = () => {
    const [attendance, setAttendance] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editAttendance, setEditAttendance] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [status, setStatus] = useState('');
    const [classId, setClassId] = useState('');
    const [date, setDate] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []);    


    useEffect(() => {
        fetchAttendance();
        fetchStudents();
        fetchSubjects();
        fetchClasses();
    }, [page, rowsPerPage]);

    const fetchAttendance = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/attendance', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            console.log("Response data:", response.data); // Logging response data to console
            setAttendance(response.data.data);
            setTotalAttendance(response.data.total);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
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

    const handleAddAttendance = () => {
        setOpenFormDialog(true);
        setEditAttendance(null);
        setStudentId('');
        setSubjectId('');
        setStatus('');
        setClassId('');
        setDate('');
    };

    const handleEditAttendance = (attendanceRecord) => {
        setOpenFormDialog(true);
        setEditAttendance(attendanceRecord);
        setStudentId(attendanceRecord.student_id);
        setSubjectId(attendanceRecord.subject_id);
        setStatus(attendanceRecord.status);
        setClassId(attendanceRecord.class_id);
        setDate(attendanceRecord.date);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = async () => {
        try {
            const newData = {
                student_id: studentId,
                subject_id: subjectId,
                status: status,
                class_id: classId,
                date: date,
            };

            if (editAttendance) {
                await axios.put(`http://127.0.0.1:8000/api/attendance/${editAttendance.id}`, newData);
                alert('Attendance record edited successfully');
            } else {
                await axios.post('http://127.0.0.1:8000/api/attendance', newData);
                alert('Attendance record saved successfully');
            }

            fetchAttendance();
            setOpenFormDialog(false);
        } catch (error) {
            console.error('Failed to save attendance record:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteAttendance = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/attendance/${id}`);
            fetchAttendance();
        } catch (error) {
            console.error('Failed to delete attendance record:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchName(event.target.value);
    };

    const filteredAttendance = attendance.filter((attendanceRecord) => {
        if (attendanceRecord.student_name && typeof attendanceRecord.student_name === 'string') {
            return attendanceRecord.student_name.toLowerCase().includes(searchName.toLowerCase());
        }
        return false;
    });

    const handleStudentIdChange = (event) => {
        setStudentId(event.target.value);
    };

    const handleSubjectIdChange = (event) => {
        setSubjectId(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleClassIdChange = (event) => {
        setClassId(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleAddAttendance}>
                Add Attendance Record
            </Button>
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editAttendance ? 'Edit Attendance Record' : 'Add Attendance Record'}</DialogTitle>
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
                            {classes.map((classItem) => (
                                <MenuItem key={classItem.id} value={classItem.id}>{classItem.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            onChange={handleStatusChange}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Date"
                        type="date"
                        margin="dense"
                        value={date}
                        onChange={handleDateChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                        <TableCell>Date</TableCell>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Class Name</TableCell>
                            <TableCell>Subject Name</TableCell>
                            <TableCell>Status</TableCell>
                            {userRole === 'admin' && (
                            <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendance.map((attendanceRecord) => (
                            <TableRow key={attendanceRecord.id}>
                                <TableCell>{attendanceRecord.date}</TableCell>
                                <TableCell>{attendanceRecord.student_name}</TableCell>
                                <TableCell>{attendanceRecord.email}</TableCell>
                                <TableCell>{attendanceRecord.first_name}</TableCell>
                                <TableCell>{attendanceRecord.last_name}</TableCell>
                                <TableCell>{attendanceRecord.phone_number}</TableCell>
                                <TableCell>{attendanceRecord.class_name}</TableCell>
                                <TableCell>{attendanceRecord.subject_name}</TableCell>
                                <TableCell>{attendanceRecord.status}</TableCell>
                                <TableCell>
                                   
                                    {userRole === 'admin' && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEditAttendance(attendanceRecord)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDeleteAttendance(attendanceRecord.id)}
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
                count={totalAttendance}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default AttendanceController;
