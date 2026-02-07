import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import customerService from '../../api/customerService';
import { motion, AnimatePresence } from 'framer-motion';

const TrackOrder = () => {
    const location = useLocation();
    const [token, setToken] = useState(location.state?.token || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async (searchToken) => {
        if (!searchToken) return;
        setLoading(true);
        setError('');
        try {
            const data = await customerService.trackOrder(searchToken);
            setOrder(data);
        } catch (err) {
            setError('Order not found. Please check your token.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.token) {
            fetchOrder(location.state.token);
        }
    }, [location.state]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchOrder(token);
    };

    const statusSteps = [
        { id: 'PLACED', label: 'Order Placed', icon: 'bi-receipt', color: 'info' },
        { id: 'PREPARING', label: 'In the Kitchen', icon: 'bi-fire', color: 'warning' },
        { id: 'READY', label: 'Ready for You', icon: 'bi-bag-heart-fill', color: 'success' },
        { id: 'DELIVERED', label: 'Enjoy your Meal', icon: 'bi-check-all', color: 'secondary' }
    ];

    const currentIdx = order ? statusSteps.findIndex(s => s.id === order.status) : -1;

    return (
        <div className="bg-light min-vh-100 py-5 text-start">
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-5"
                        >
                            <h1 className="display-5 fw-bold mb-3">Track <span className="text-orange">Order</span></h1>
                            <p className="text-muted lead">Enter your order token to see real-time status</p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="mb-5"
                        >
                            <div className="glass-card p-2 shadow-premium d-flex gap-2">
                                <div className="input-group flex-grow-1">
                                    <span className="input-group-text bg-transparent border-0 text-orange ps-3">
                                        <i className="bi bi-search fs-5"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none py-3"
                                        placeholder="Enter Order Token (e.g. ORD12345)"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="btn btn-orange px-5 rounded-3 fw-bold shadow-sm" type="submit" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Locate'}
                                </button>
                            </div>
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-danger mt-3 text-center fw-bold small"
                                    >
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.form>

                        <AnimatePresence mode="wait">
                            {order ? (
                                <motion.div
                                    key={order.orderId}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card border-0 shadow-premium rounded-4 overflow-hidden mb-5"
                                >
                                    <div className="bg-orange p-4 text-white d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="small opacity-75 text-uppercase fw-bold tracking-wider">Tracking Token</span>
                                            <h4 className="mb-0 fw-bold">{order.tokenNumber}</h4>
                                        </div>
                                        <div className="text-end">
                                            <span className="small opacity-75 text-uppercase fw-bold tracking-wider">Status</span>
                                            <h5 className="mb-0 fw-bold">{order.status}</h5>
                                        </div>
                                    </div>

                                    <div className="card-body p-4 p-md-5">
                                        {/* Status Timeline */}
                                        <div className="position-relative mb-5 py-2">
                                            <div className="position-absolute h-100 start-0 border-start border-2 border-light ms-3 z-0" style={{ left: '16px' }}></div>
                                            <div className="d-flex flex-column gap-5">
                                                {statusSteps.map((step, idx) => {
                                                    const isCompleted = idx <= currentIdx;
                                                    const isActive = idx === currentIdx;
                                                    return (
                                                        <div key={step.id} className="d-flex align-items-center gap-4 position-relative z-1 text-start">
                                                            <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm ${isCompleted ? 'bg-orange text-white' : 'bg-white text-muted border border-2'}`} style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                                                <i className={`bi ${step.icon} fs-5`}></i>
                                                            </div>
                                                            <div>
                                                                <h6 className={`fw-bold mb-0 ${isCompleted ? 'text-dark' : 'text-muted opacity-50'}`}>
                                                                    {step.label}
                                                                </h6>
                                                                {isActive && <span className="badge-premium bg-orange-light text-orange small mt-1 d-inline-block">In Progress</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-light rounded-4 p-4 border-0">
                                            <div className="d-flex justify-content-between mb-3 text-start">
                                                <h6 className="fw-bold mb-0">Order from {order.outletName}</h6>
                                                <span className="fw-bold text-orange">₹{order.totalAmount}</span>
                                            </div>
                                            <div className="small text-muted text-start ps-2 border-start border-2 border-orange border-opacity-25 pb-3">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="mb-1">• {item.quantity}x {item.foodName}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                !loading && !error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-5 opacity-50"
                                    >
                                        <i className="bi bi-geo-alt display-1 d-block mb-3"></i>
                                        <p className="lead fw-bold">Enter your token to pinpoint your meal</p>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
