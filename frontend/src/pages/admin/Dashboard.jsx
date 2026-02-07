import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../api/adminService';
import InfoCard from '../../components/InfoCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        outlets: 0,
        orders: 0,
        activeOutlets: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const users = await adminService.getAllUsers();
                const outlets = await adminService.getAllOutlets();
                let orders = [];
                try {
                    orders = await adminService.getAllOrders();
                } catch (e) { console.log('Orders API not available yet'); }

                setStats({
                    users: users.length,
                    outlets: outlets.length,
                    orders: orders.length,
                    activeOutlets: outlets.filter(o => o.open).length
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-orange" role="status"></div>
        </div>
    );

    return (
        <div className="p-4 fade-in">
            <div className="mb-5">
                <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Dashboard Overview</h2>
                <p className="text-muted small fw-medium">Insight into platform performance and user activity.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-6 col-lg-3">
                    <InfoCard title="Total Users" value={stats.users} icon="people" color="primary" trend="+12" />
                </div>
                <div className="col-md-6 col-lg-3">
                    <InfoCard title="Total Outlets" value={stats.outlets} icon="shop" color="orange" trend="+5" />
                </div>
                <div className="col-md-6 col-lg-3">
                    <InfoCard title="Total Orders" value={stats.orders} icon="bag-check" color="success" trend="+154" />
                </div>
                <div className="col-md-6 col-lg-3">
                    <InfoCard title="Active Now" value={stats.activeOutlets} icon="broadcast" color="info" />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="section-title mb-0">Quick Operations</h6>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="p-4 border rounded-4 d-flex align-items-center gap-4 hover-lift bg-light bg-opacity-25 h-100"
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => navigate('/admin/outlets', { state: { openModal: true } })}>
                                    <div className="bg-orange p-3 rounded-circle text-white shadow-sm">
                                        <i className="bi bi-plus-lg fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">Register Outlet</h6>
                                        <p className="text-muted small mb-0">Add a new stall to the platform.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-4 border rounded-4 d-flex align-items-center gap-4 hover-lift bg-light bg-opacity-25 h-100"
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => alert('Platform Audit system is currently being calibrated.')}>
                                    <div className="bg-info p-3 rounded-circle text-white shadow-sm">
                                        <i className="bi bi-shield-check fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">Manual Audit</h6>
                                        <p className="text-muted small mb-0">Run a security check now.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 className="section-title mb-4">Recent Notifications</h6>
                        <div className="timeline-container">
                            <div className="timeline-item d-flex gap-3 mb-4 position-relative">
                                <div className="timeline-dot bg-warning rounded-circle" style={{ width: '12px', height: '12px', flexShrink: 0, marginTop: '6px' }}></div>
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0 fw-bold small">New Outlet Request</h6>
                                        <small className="text-muted x-small">3m ago</small>
                                    </div>
                                    <p className="text-muted x-small mb-0">Noodle Bar wants to join.</p>
                                </div>
                            </div>
                            <div className="timeline-item d-flex gap-3 position-relative">
                                <div className="timeline-dot bg-info rounded-circle" style={{ width: '12px', height: '12px', flexShrink: 0, marginTop: '6px' }}></div>
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0 fw-bold small">Stock Alert</h6>
                                        <small className="text-muted x-small">2h ago</small>
                                    </div>
                                    <p className="text-muted x-small mb-0">3 outlets reporting low stock.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 5px; top: 24px; bottom: -20px; width: 2px; background: #F1F5F9; } .x-small { font-size: 0.75rem; }`}</style>
        </div>
    );
};

export default Dashboard;

