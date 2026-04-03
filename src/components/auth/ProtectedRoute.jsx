import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.user);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
