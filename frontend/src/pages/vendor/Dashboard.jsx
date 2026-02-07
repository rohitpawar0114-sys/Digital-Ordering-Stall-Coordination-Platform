import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import vendorService from '../../api/vendorService';
import StatCard from '../../components/StatCard';

const Dashboard = () => {
    const [outlet, setOutlet] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const outletData = await vendorService.getOutlet();
                setOutlet(outletData);

                if (outletData) {
                    const ordersData = await vendorService.getOrders(outletData.outletId);

                    // Real-world logic would happen here, but for now we'll simulate daily stats
                    const today = new Date().toISOString().split('T')[0];
                    const todayOrders = (ordersData || []).filter(o => o.createdAt?.startsWith(today) || true); // Defaulting to all for demo

                    const revenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                    const pending = todayOrders.filter(o => o.status === 'PLACED' || o.status === 'PREPARING').length;

                    setStats({
                        totalOrders: todayOrders.length,
                        pendingOrders: pending,
                        revenue: revenue
                    });
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard. Make sure you are assigned to an outlet.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-orange" role="status"></div>
        </div>
    );

    if (error) return (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 mt-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </div>
    );

    return (
        <div className="container-fluid py-4 px-4">
            {/* Premium Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-premium rounded-4 p-5 mb-5 border-start border-5 border-orange overflow-hidden position-relative"
            >
                <div className="position-relative z-1">
                    <h1 className="display-6 fw-bold mb-2">Welcome back, <span className="text-orange">Vendor!</span></h1>
                    <p className="text-muted lead mb-0">Monitor your stall performance and manage live orders in real-time.</p>
                </div>
                <div className="position-absolute end-0 top-0 h-100 w-25 opacity-10 d-none d-lg-block">
                    <i className="bi bi-graph-up-arrow" style={{ fontSize: '10rem', transform: 'rotate(-15deg)' }}></i>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="row g-4 mb-5">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="col-md-4">
                    <StatCard title="Orders Today" value={stats.totalOrders} icon="bag-check" color="primary" />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="col-md-4">
                    <StatCard title="Pending Orders" value={stats.pendingOrders} icon="clock-history" color="warning" />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="col-md-4">
                    <StatCard title="Daily Revenue" value={`₹${stats.revenue}`} icon="currency-rupee" color="success" />
                </motion.div>
            </div>

            {/* Redesigned Outlet Profile */}
            {outlet && (
                <div className="card border-0 shadow-premium rounded-4 overflow-hidden mb-4">
                    <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0"><i className="bi bi-shop me-2 text-muted"></i>Outlet Profile</h5>
                        <span className={`badge rounded-pill px-3 py-2 ${outlet.open ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                            <i className="bi bi-circle-fill me-1 small"></i> {outlet.open ? 'OPEN' : 'CLOSED'}
                        </span>
                    </div>
                    <div className="card-body p-4 p-lg-5">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-3">
                                {outlet.imageUrl ? (
                                    <div className="position-relative">
                                        <img src={outlet.imageUrl} alt={outlet.outletName} className="img-fluid rounded-4 shadow-premium w-100" style={{ height: '220px', objectFit: 'cover' }} />
                                        <div className="position-absolute bottom-0 end-0 m-2">
                                            <button className="btn btn-dark btn-sm rounded-circle shadow-sm" style={{ width: '32px', height: '32px' }}>
                                                <i className="bi bi-camera"></i>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center shadow-inner" style={{ height: '220px' }}>
                                        <i className="bi bi-shop display-3 text-muted opacity-25"></i>
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-9">
                                <div className="ps-lg-4 text-start">
                                    <h2 className="fw-bold text-dark mb-2 h1">{outlet.outletName}</h2>
                                    <p className="text-muted mb-4 lead" style={{ maxWidth: '600px' }}>{outlet.description || 'Describe your stall to attract more customers.'}</p>

                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="bg-light p-4 rounded-4 h-100 border border-light">
                                                <small className="text-muted d-block mb-1 fw-bold text-uppercase tracking-wider">Cuisine Focus</small>
                                                <span className="fw-bold text-dark fs-5">{outlet.cuisineType || 'Universal Foods'}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="bg-light p-4 rounded-4 h-100 border border-light">
                                                <small className="text-muted d-block mb-1 fw-bold text-uppercase tracking-wider">Operational Hours</small>
                                                <span className="fw-bold text-dark fs-5">{outlet.openingHours || 'Schedule Not Set'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
