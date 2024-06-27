// components/ProtectedRoute.js

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Clear the token from localStorage
            //localStorage.removeItem('token');

            // Redirect to login page
            router.push('/login');
        }
    }, []);

    return <>{children}</>;
};

export default ProtectedRoute;
