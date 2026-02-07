import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    const hasRole = user && allowedRoles.includes(user.role);

    return hasRole ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoute;
