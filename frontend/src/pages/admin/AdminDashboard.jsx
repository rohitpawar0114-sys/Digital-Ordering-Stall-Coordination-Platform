import React, { useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, outlets: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersRes = await api.get('/api/admin/users');
                const outletsRes = await api.get('/api/admin/outlets');
                setStats({
                    users: usersRes.data.length,
                    outlets: outletsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-5">Admin <span className="text-orange">Dashboard</span></h1>

            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <i className="bi bi-people fs-1 text-orange mb-3"></i>
                        <h3 className="fw-bold">{stats.users}</h3>
                        <p className="text-muted mb-0">Total Registered Users</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <i className="bi bi-shop fs-1 text-orange mb-3"></i>
                        <h3 className="fw-bold">{stats.outlets}</h3>
                        <p className="text-muted mb-0">Active Food Outlets</p>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Platform Overview</h4>
                <p className="text-muted">Welcome to the EatOrbit administration panel. Here you can monitor platform activity and manage users and outlets.</p>
                <div className="alert alert-info border-0 rounded-3">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    More advanced management features are being rolled out.
                </div>
            </div>
        </div>
    );
};

// Fixed the missing useEffect import
import { useEffect } from 'react';
export default AdminDashboard;
