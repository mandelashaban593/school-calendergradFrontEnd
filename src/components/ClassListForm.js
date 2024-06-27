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
import 'react-datepicker/dist/react-datepicker.css';

const ClassController = () => {
    const [classes, setClasses] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editClass, setEditClass] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalClasses, setTotalClasses] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []);    


    useEffect(() => {
        fetchClasses();
    }, [page, rowsPerPage]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/classes', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            setClasses(response.data.data);
            setTotalClasses(response.data.total);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = () => {
        setOpenFormDialog(true);
        setEditClass(null);
        setName('');
    };

    const handleEditClass = (classItem) => {
        setOpenFormDialog(true);
        setEditClass(classItem);
        setName(classItem.name);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = async () => {
        try {
            const newData = {
                name: name,
            };

            if (editClass) {
                await axios.put(`http://127.0.0.1:8000/api/classes/${editClass.id}`, newData);
                alert('Class edited successfully');
            } else {
                await axios.post('http://127.0.0.1:8000/api/classes', newData);
                alert('Class saved successfully');
            }

            fetchClasses();
            setOpenFormDialog(false);
        } catch (error) {
            console.error('Failed to save class:', error);
        }
    };

    const handleDeleteClass = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/classes/${id}`);
            fetchClasses();
        } catch (error) {
            console.error('Failed to delete class:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchName(event.target.value);
    };

    const filteredClasses = classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleAddClass}>
                Add Class
            </Button>
            <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
                <DialogTitle>{editClass ? 'Edit Class' : 'Add Class'}</DialogTitle>
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
            {loading ? (
                <p>Loading...</p>
            ) : (
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
                            {filteredClasses.map((classItem) => (
                                <TableRow key={classItem.id}>
                                    <TableCell>{classItem.name}</TableCell>
                                    <TableCell>
                                       

                                        {userRole === 'admin' && (
                                        <>
                                         <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEditClass(classItem)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteClass(classItem.id)}
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
            )}
            <TablePagination
                component="div"
                count={totalClasses}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ClassController;
