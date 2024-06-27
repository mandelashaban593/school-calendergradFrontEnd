import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const CustomAlert = ({ open, onClose, severity, message }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default CustomAlert;
