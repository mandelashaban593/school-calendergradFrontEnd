import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from '@material-ui/core';

import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
    role: yup.string().required('Role is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    date_of_birth: yup.date().required('Date of birth is required'),
    address: yup.string().required('Address is required'),
    phone_number: yup.string().required('Phone number is required'),
    joining_date: yup.date().required('Joining date is required'),
    department_id: yup.number().required('Department ID is required'),
});

const ErrorDialog = ({ open, onClose, errorMessage }) => (
    <Dialog open={open} onClose={onClose} aria-labelledby="error-dialog-title">
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent dividers>
            <div style={{ textAlign: 'center' }}>{errorMessage}</div>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                OK
            </Button>
        </DialogActions>
    </Dialog>
);

const UserForm = ({ open, onClose, onSave, editUser }) => {
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            username: editUser ? editUser.username : '',
            email: editUser ? editUser.email : '',
            password: '',
            role: editUser ? editUser.role : '',
            first_name: editUser ? editUser.first_name : '',
            last_name: editUser ? editUser.last_name : '',
            date_of_birth: editUser ? editUser.date_of_birth : '',
            address: editUser ? editUser.address : '',
            phone_number: editUser ? editUser.phone_number : '',
            joining_date: editUser ? editUser.joining_date : '',
            department_id: editUser ? editUser.department_id : '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (editUser) {
                    await axios.put(`http://127.0.0.1:8000/api/users/${editUser.id}`, values);
                } else {
                    await axios.post('http://127.0.0.1:8000/api/users', values);
                }
                onSave();
                onClose();
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    const errorMessages = Object.values(error.response.data.error).join(', ');
                    setErrorDialogMessage(errorMessages);
                    setErrorDialogOpen(true);
                } else {
                    console.error('Failed to save user:', error);
                }
            }
        },
    });

    useEffect(() => {
        if (!open) {
            formik.resetForm();
        }
    }, [open]);

    useEffect(() => {
        if (editUser) {
            formik.setValues({ ...editUser, password: '' });
        } else {
            formik.resetForm();
        }
    }, [editUser]);

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Username"
                        margin="dense"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div>{formik.errors.username}</div>
                    ) : null}

                    <TextField
                        label="Email"
                        margin="dense"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}

                    <TextField
                        label="Password"
                        margin="dense"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div>{formik.errors.password}</div>
                    ) : null}

                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                        </Select>
                    </FormControl>
                    {formik.touched.role && formik.errors.role ? (
                        <div>{formik.errors.role}</div>
                    ) : null}

                    <TextField
                        label="First Name"
                        margin="dense"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.first_name && formik.errors.first_name ? (
                        <div>{formik.errors.first_name}</div>
                    ) : null}

                    <TextField
                        label="Last Name"
                        margin="dense"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.last_name && formik.errors.last_name ? (
                        <div>{formik.errors.last_name}</div>
                    ) : null}

                    <TextField
                        label="Date of Birth"
                        margin="dense"
                        name="date_of_birth"
                        type="date"
                        value={formik.values.date_of_birth}
                        onChange={formik.handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                        <div>{formik.errors.date_of_birth}</div>
                    ) : null}

                    <TextField
                        label="Address"
                        margin="dense"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <div>{formik.errors.address}</div>
                    ) : null}

                    <TextField
                        label="Phone Number"
                        margin="dense"
                        name="phone_number"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.phone_number && formik.errors.phone_number ? (
                        <div>{formik.errors.phone_number}</div>
                    ) : null}

                    <TextField
                        label="Joining Date"
                        margin="dense"
                        name="joining_date"
                        type="date"
                        value={formik.values.joining_date}
                        onChange={formik.handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    {formik.touched.joining_date && formik.errors.joining_date ? (
                        <div>{formik.errors.joining_date}</div>
                    ) : null}

                    <TextField
                        label="Department ID"
                        margin="dense"
                        name="department_id"
                        type="number"
                        value={formik.values.department_id}
                        onChange={formik.handleChange}
                        fullWidth
                    />
                    {formik.touched.department_id && formik.errors.department_id ? (
                        <div>{formik.errors.department_id}</div>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        {editUser ? 'Save Changes' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
            <ErrorDialog
                open={errorDialogOpen}
                onClose={handleCloseErrorDialog}
                errorMessage={errorDialogMessage}
            />
        </Dialog>
    );
};

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Fetch user role from localStorage
        const role = JSON.parse(localStorage.getItem('user')).role;
        setUserRole(role);
    }, []);

    const fetchUsers = async (page, rowsPerPage) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users', {
                params: {
                    page: page + 1,
                    per_page: rowsPerPage,
                },
            });
            setUsers(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleAddUser = () => {
        setOpenFormDialog(true);
        setEditUser(null);
    };

    const handleEditUser = (user) => {
        setOpenFormDialog(true);
        setEditUser(user);
    };

    const handleCloseFormDialog = () => {
        setOpenFormDialog(false);
    };

    const handleSave = () => {
        fetchUsers(page, rowsPerPage);
        setOpenFormDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
            fetchUsers(page, rowsPerPage);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div>
            {userRole === 'admin' && (
                <Button variant="contained" color="primary" onClick={handleAddUser}>
                    Add User
                </Button>
            )}
            <UserForm
                open={openFormDialog}
                onClose={handleCloseFormDialog}
                onSave={handleSave}
                editUser={editUser}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Joining Date</TableCell>
                            <TableCell>Department ID</TableCell>
                            {userRole === 'admin' && (
                            <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.first_name}</TableCell>
                                <TableCell>{user.last_name}</TableCell>
                                <TableCell>{user.date_of_birth}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.phone_number}</TableCell>
                                <TableCell>{user.joining_date}</TableCell>
                                <TableCell>{user.department_id}</TableCell>
                                <TableCell>
                                    {userRole === 'admin' && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDeleteUser(user.id)}
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
                count={totalRecords}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default UserTable;
