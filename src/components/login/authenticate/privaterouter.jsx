import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from './authenticate';

const PrivateRoute = ({ element }) => 
{
    const { isAuthenticated, staffId } = useAuth();
    const { staffId: currentStaffId } = useParams();

    return (isAuthenticated && currentStaffId === staffId)
        ? element
        : <Navigate to="/" replace />;
};

export default PrivateRoute;
