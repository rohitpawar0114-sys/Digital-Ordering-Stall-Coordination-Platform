import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-orange" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const isAdmin = user && user.role === 'ADMIN';

    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
