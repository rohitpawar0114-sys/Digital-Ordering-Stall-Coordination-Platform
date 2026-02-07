import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import vendorService from '../../api/vendorService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ACTIVE'); // ACTIVE, COMPLETED

    const [outlet, setOutlet] = useState(null);

    useEffect(() => {
        const init = async () => {
            const outletData = await vendorService.getOutlet();
            setOutlet(outletData);
        };
        init();
    }, []);

    useEffect(() => {
        if (outlet) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [outlet]);

    const fetchOrders = async () => {
        if (!outlet) return;
        try {
            const data = await vendorService.getOrders(outlet.outletId);
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await vendorService.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const activeOrders = orders.filter(o => o.status !== 'DELIVERED').reverse();
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').reverse();

    const displayOrders = filter === 'ACTIVE' ? activeOrders : completedOrders;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PLACED': return 'bg-info bg-opacity-10 text-info';
            case 'PREPARING': return 'bg-warning bg-opacity-10 text-warning';
            case 'READY': return 'bg-success bg-opacity-10 text-success';
            case 'DELIVERED': return 'bg-secondary bg-opacity-10 text-secondary';
            default: return 'bg-light text-dark';
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container-fluid py-4 px-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Live Order Board</h2>
                    <p className="text-muted mb-0">Manage daily kitchen operations and update order statuses.</p>
                </div>
                <div className="d-flex align-items-center bg-white shadow-premium p-1 rounded-pill">
                    <button
                        className={`btn rounded-pill px-4 py-2 transition-all border-0 ${filter === 'ACTIVE' ? 'bg-orange text-white shadow-sm' : 'text-muted'}`}
                        onClick={() => setFilter('ACTIVE')}
                    >
                        Active <span className={`badge ms-2 ${filter === 'ACTIVE' ? 'bg-white text-orange' : 'bg-light text-muted'}`}>{activeOrders.length}</span>
                    </button>
                    <button
                        className={`btn rounded-pill px-4 py-2 transition-all border-0 ${filter === 'COMPLETED' ? 'bg-orange text-white shadow-sm' : 'text-muted'}`}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {displayOrders.length > 0 ? (
                    displayOrders.map((order, index) => (
                        <motion.div
                            key={order.orderId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="col-12"
                        >
                            <div className={`card border-0 shadow-premium rounded-4 overflow-hidden border-start border-5 ${order.status === 'PLACED' ? 'border-primary' :
                                (order.status === 'PREPARING' ? 'border-warning' : 'border-success')
                                }`}>
                                <div className="card-body p-4">
                                    <div className="row g-4 align-items-center">
                                        <div className="col-md-2 border-end-md border-light">
                                            <div className="text-center text-md-start">
                                                <small className="text-muted d-block text-uppercase fw-bold tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>TOKEN ID</small>
                                                <h3 className="fw-bold mb-0 text-dark">#{order.tokenNumber}</h3>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <small className="text-muted d-block text-uppercase fw-bold tracking-widest mb-2" style={{ fontSize: '0.65rem' }}>ORDER ITEMS</small>
                                            <ul className="list-unstyled mb-0">
                                                {order.items?.map((item, idx) => (
                                                    <li key={idx} className="fw-bold text-dark d-flex align-items-center mb-1">
                                                        <span className="badge bg-orange bg-opacity-10 text-orange rounded-pill me-2" style={{ fontSize: '0.7rem' }}>{item.quantity}x</span>
                                                        {item.foodName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="col-md-2 text-center text-md-start">
                                            <small className="text-muted d-block text-uppercase fw-bold tracking-widest mb-1" style={{ fontSize: '0.65rem' }}>REVENUE</small>
                                            <h4 className="fw-bold mb-0 text-success">₹{order.totalAmount}</h4>
                                        </div>

                                        <div className="col-md-2 text-center">
                                            <small className="text-muted d-block text-uppercase fw-bold tracking-widest mb-2" style={{ fontSize: '0.65rem' }}>CURRENT STATUS</small>
                                            <span className={`badge rounded-pill px-3 py-2 border-0 fw-bold ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="col-md-2 text-end">
                                            {order.status === 'PLACED' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="btn btn-primary rounded-4 w-100 py-3 fw-bold shadow-sm"
                                                    onClick={() => handleUpdateStatus(order.orderId, 'PREPARING')}
                                                >
                                                    <i className="bi bi-fire me-2"></i> COOK
                                                </motion.button>
                                            )}
                                            {order.status === 'PREPARING' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="btn btn-warning rounded-4 w-100 py-3 fw-bold shadow-sm"
                                                    onClick={() => handleUpdateStatus(order.orderId, 'READY')}
                                                >
                                                    <i className="bi bi-check2-circle me-2"></i> READY
                                                </motion.button>
                                            )}
                                            {order.status === 'READY' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="btn btn-success rounded-4 w-100 py-3 fw-bold shadow-sm"
                                                    onClick={() => handleUpdateStatus(order.orderId, 'DELIVERED')}
                                                >
                                                    <i className="bi bi-box-seam me-2"></i> DELIVER
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-12 py-5 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white shadow-premium rounded-5 p-5 d-inline-block"
                        >
                            <div className="bg-light rounded-circle p-4 d-inline-block mb-4 shadow-inner">
                                <i className="bi bi-inbox display-4 text-muted opacity-50"></i>
                            </div>
                            <h3 className="fw-bold text-dark">No orders found</h3>
                            <p className="text-muted mb-0">Your live queue is currently empty. Sit back and relax!</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
