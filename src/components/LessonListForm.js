import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    FormHelperText,
    IconButton,
    InputAdornment,
    DialogContentText,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LessonTable = ({ initialLessons }) => {
    const [lessons, setLessons] = useState(initialLessons || []);
    const [editLesson, setEditLesson] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [classOptions, setClassOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []);    

    useEffect(() => {
        fetchClassNames();
        fetchSubjects();
        fetchTeachers();
        fetchLessons(); // Initial fetch
    }, [page, rowsPerPage]); // Ensure useEffect updates when page or rowsPerPage change

    useEffect(() => {
        setFilteredLessons(
            lessons.filter((lesson) => {
                const searchTermMatch =
                    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.school_year.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lesson.term.toString().includes(searchTerm.toLowerCase()) ||
                    lesson.class_size.toString().includes(searchTerm.toLowerCase());

                const dateRangeMatch =
                    (!startDate || new Date(lesson.weekday) >= startDate) &&
                    (!endDate || new Date(lesson.weekday) <= endDate);

                return searchTermMatch && dateRangeMatch;
            })
        );
    }, [searchTerm, lessons, startDate, endDate]);

    const fetchClassNames = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-class-names');
            setClassOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch class names:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/subjects');
            setSubjectOptions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-teachers', {
                params: {
                    role: 'teacher'
                }
            });
            setTeacherOptions(response.data); // Assuming teacher data is in response.data.data
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
        }
    };

    const fetchLessons = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/lessonlist', {
                params: {
                    page: page + 1, // Laravel pagination starts at page 1
                    per_page: rowsPerPage,
                },
            });
            setLessons(response.data.data); // Assuming lessons data is under response.data.data
        } catch (error) {
            console.error('Failed to fetch lessons:', error);
        }
    };

    const handleEditLesson = (lesson) => {
        setEditLesson(lesson);
        setOpenDialog(true);
    };

    const handleOpenConfirmDelete = (lessonId) => {
        setSelectedLessonId(lessonId);
        setConfirmDeleteOpen(true);
    };

    const handleCloseConfirmDelete = () => {
        setSelectedLessonId(null);
        setConfirmDeleteOpen(false);
    };

    const handleDeleteLesson = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/lesson/${selectedLessonId}`);
            fetchLessons(); // Refresh lessons after delete
            setConfirmDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete lesson:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to page 0 when changing rows per page
    };

    const handleInputChange = (field, value) => {
        setEditLesson((prevLesson) => ({
            ...prevLesson,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            console.log("id: ",editLesson.id)
            console.log("title: ",editLesson.title)
            console.log("description: ",editLesson.description)
            console.log("class_id: ",editLesson.class_id)
            console.log("subject_id: ",editLesson.subject_id)
            console.log("teacher_id: ",editLesson.teacher_id)
            console.log("room: ",editLesson.room)
            console.log("weekday: ",editLesson.weekday)
            console.log("start_time: ",editLesson.start_time)
            console.log("end_time: ",editLesson.end_time)
            console.log("term: ",editLesson.term)
            console.log("school_year: ",editLesson.school_year)
            console.log("class_size: ",editLesson.class_size)

            let formdata = {
                title: editLesson.title,
                description: editLesson.description,
                class_id: editLesson.class_id,
                subject_id: editLesson.subject_id,
                teacher_id: editLesson.teacher_id,
                room: editLesson.room,
                weekday: editLesson.weekday,
                start_time: editLesson.start_time,
                end_time: editLesson.end_time,
                term: editLesson.term,
                school_year: editLesson.school_year,
                class_size: editLesson.class_size,
                id:editLesson.id,
               
            };

            if (editLesson.id) {
                // Update existing lesson
                await axios.post(`http://127.0.0.1:8000/api/updatelesson`, formdata);
            } else {
                // Add new lesson
                await axios.post('http://127.0.0.1:8000/api/savelesson', formdata);
            }
            fetchLessons(); // Refresh lessons after save
            handleDialogClose();
        } catch (error) {
            console.error('Failed to save lesson:', error);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditLesson(null);
        // Reset your form state variables here if needed
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredLessons.length);

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Add Lesson
            </Button>

            <TextField
                variant="outlined"
                label="Search"
                size="small"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setSearchTerm('')}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                style={{ marginLeft: '10px' }}
            />

            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="form-control"
                dateFormat="yyyy-MM-dd"
            />

            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                className="form-control"
                dateFormat="yyyy-MM-dd"
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Teacher</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Weekday</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Term</TableCell>
                            <TableCell>School Year</TableCell>
                            <TableCell>Class Size</TableCell>
                            {userRole === 'admin' && (
                            <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLessons.map((lesson) => (
                            <TableRow key={lesson.id}>
                                <TableCell>{lesson.title}</TableCell>
                                <TableCell>{lesson.description}</TableCell>
                                <TableCell>{lesson.class_name}</TableCell>
                                <TableCell>{lesson.subject_name}</TableCell>
                                <TableCell>{lesson.teacher_name}</TableCell>
                                <TableCell>{lesson.room}</TableCell>
                                <TableCell>{lesson.weekday}</TableCell>
                                <TableCell>{lesson.start_time}</TableCell>
                                <TableCell>{lesson.end_time}</TableCell>
                                <TableCell>{lesson.term}</TableCell>
                                <TableCell>{lesson.school_year}</TableCell>
                                <TableCell>{lesson.class_size}</TableCell>
                                <TableCell>
                                   
                                    {userRole === 'admin' && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditLesson(lesson)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenConfirmDelete(lesson.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Delete
                                            </Button>

                                        </>
                                    )}
                                    
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={13} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25,50,100, { label: 'All', value: -1 }]}
                component="div"
                count={lessons.length} // Use lessons.length for pagination count
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Edit/Add Lesson Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{editLesson?.id ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={editLesson?.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={editLesson?.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={editLesson?.class_id || ''}
                            onChange={(e) => handleInputChange('class_id', e.target.value)}
                        >
                            {classOptions.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Subject</InputLabel>
                        <Select
                            value={editLesson?.subject_id || ''}
                            onChange={(e) => handleInputChange('subject_id', e.target.value)}
                        >
                            {subjectOptions.map((subject) => (
                                <MenuItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Teacher</InputLabel>
                        <Select
                            value={editLesson?.teacher_id || ''}
                            onChange={(e) => handleInputChange('teacher_id', e.target.value)}
                        >
                            {teacherOptions.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    {teacher.first_name} {teacher.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Room"
                        type="text"
                        fullWidth
                        value={editLesson?.room || ''}
                        onChange={(e) => handleInputChange('room', e.target.value)}
                    />
                    <DatePicker
                        selected={editLesson?.weekday ? new Date(editLesson?.weekday) : null}
                        onChange={(date) => handleInputChange('weekday', date.toISOString())}
                        placeholderText="Select Weekday"
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                    />
                    <TextField
                        margin="dense"
                        label="Start Time"
                        type="time"
                        fullWidth
                        value={editLesson?.start_time || ''}
                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="End Time"
                        type="time"
                        fullWidth
                        value={editLesson?.end_time || ''}
                        onChange={(e) => handleInputChange('end_time', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Term"
                        type="text"
                        fullWidth
                        value={editLesson?.term || ''}
                        onChange={(e) => handleInputChange('term', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="School Year"
                        type="date"
                        fullWidth
                        value={editLesson?.school_year || ''}
                        onChange={(e) => handleInputChange('school_year', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Class Size"
                        type="number"
                        fullWidth
                        value={editLesson?.class_size || ''}
                        onChange={(e) => handleInputChange('class_size', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this lesson?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteLesson} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LessonTable;
