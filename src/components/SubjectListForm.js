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

const SubjectController = () => {
    const [subjects, setSubjects] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editSubject, setEditSubject] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []);    

    

    useEffect(() => {
        fetchSubjects();
    }, [page, rowsPerPage]);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/subjects', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            setSubjects(response.data.data);
            setTotalSubjects(response.data.total);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    };

    const handleAddSubject = () => {
        setOpenFormDialog(true);
        setEditSubject(null);
        setName(''); // Clear the name field
    };

    const handleEditSubject = (subject) => {
        setOpenFormDialog(true);
        setEditSubject(subject);
        setName(subject.name); // Set the name field for editing
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = async () => {
        try {
            const newData = { name: name };

            if (editSubject) {
                await axios.put(`http://127.0.0.1:8000/api/subjects/${editSubject.id}`, newData);
                alert('Subject edited successfully');
            } else {
                await axios.post('http://127.0.0.1:8000/api/subjects', newData);
                alert('Subject saved successfully');
            }
            

            fetchSubjects();
            setOpenFormDialog(false);
        } catch (error) {
            console.error('Failed to save subject:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteSubject = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}`);
            fetchSubjects();
        } catch (error) {
            console.error('Failed to delete subject:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchName(event.target.value);
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleAddSubject}>
                Add Subject
            </Button>
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        margin="dense"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
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
                            <TableCell>Name</TableCell>
                            {userRole === 'admin' && (
                            <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubjects.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>
                                   
                                    {userRole === 'admin' && (
                                        <>
                                           <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEditSubject(subject)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDeleteSubject(subject.id)}
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
                count={totalSubjects}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default SubjectController;
