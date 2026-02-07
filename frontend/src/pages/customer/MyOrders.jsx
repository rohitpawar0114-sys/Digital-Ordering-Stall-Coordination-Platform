import React, { useState, useEffect } from 'react';
import customerService from '../../api/customerService';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../../context/CartContext';

const MyOrders = () => {
    const { fetchCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED
    const [selectedBill, setSelectedBill] = useState(null);
    const [reorderingId, setReorderingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await customerService.getMyOrders();
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (order) => {
        setReorderingId(order.orderId);
        try {
            // 1. Find Outlet ID logic (since order only has name)
            const outlets = await customerService.getOutlets();
            const outlet = outlets.find(o => o.outletName === order.outletName);

            if (!outlet) {
                alert("This outlet is no longer available.");
                return;
            }

            // 2. Clear current cart to avoid mixing outlets? 
            // The backend handles outlet switching (clears cart), so we just add.

            // 3. Fetch Menu to map Names -> IDs
            const menu = await customerService.getMenu(outlet.outletId);
            const foodIdMap = {};
            menu.forEach(item => {
                foodIdMap[item.foodName] = item.foodId;
            });

            // 4. Add items to cart
            let addedCount = 0;
            let missingItems = 0;

            for (const item of order.items) {
                const foodId = foodIdMap[item.foodName];
                if (foodId) {
                    try {
                        await customerService.addToCart(foodId, item.quantity);
                        addedCount++;
                    } catch (e) {
                        console.error("Failed to add item", item.foodName);
                    }
                } else {
                    missingItems++;
                }
            }

            if (addedCount > 0) {
                if (missingItems > 0) {
                    alert(`${missingItems} items were unavailable and skipped.`);
                }
                await fetchCart();
                navigate('/cart');
            } else {
                alert("None of the items from this order are available.");
            }

        } catch (error) {
            console.error("Re-order failed:", error);
            alert("Failed to re-order. Please try again.");
        } finally {
            setReorderingId(null);
        }
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'PLACED': return {
                badge: 'bg-info-light text-info',
                icon: 'bi-receipt',
                label: 'Order Placed',
                progress: 25
            };
            case 'PREPARING': return {
                badge: 'bg-warning-light text-warning',
                icon: 'bi-fire',
                label: 'Preparing',
                progress: 50
            };
            case 'READY': return {
                badge: 'bg-success-light text-success',
                icon: 'bi-check-circle-fill',
                label: 'Ready for Pickup',
                progress: 75
            };
            case 'DELIVERED': return {
                badge: 'bg-secondary-light text-secondary',
                icon: 'bi-bag-check-fill',
                label: 'Delivered',
                progress: 100
            };
            default: return {
                badge: 'bg-light text-dark',
                icon: 'bi-clock',
                label: status,
                progress: 0
            };
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return order.status !== 'DELIVERED';
        if (filter === 'COMPLETED') return order.status === 'DELIVERED';
        return true;
    }).slice().reverse();

    if (loading) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-orange" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container mt-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-start"
                    >
                        <h1 className="display-5 fw-bold mb-1">My <span className="text-orange">Orders</span></h1>
                        <p className="text-muted mb-0">Manage and track your culinary adventures</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-1 d-flex gap-1"
                    >
                        {['ALL', 'ACTIVE', 'COMPLETED'].map(f => (
                            <button
                                key={f}
                                className={`btn rounded-3 px-4 py-2 fw-bold btn-sm transition-all border-0 ${filter === f ? 'btn-orange text-white shadow-sm' : 'text-muted hover-lift'}`}
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {filteredOrders.length > 0 ? (
                    <div className="row g-4 d-flex">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order, index) => {
                                const statusInfo = getStatusDetails(order.status);
                                return (
                                    <motion.div
                                        key={order.orderId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="col-12"
                                    >
                                        <div className="card border-0 shadow-premium rounded-4 overflow-hidden text-start">
                                            <div className="card-body p-4">
                                                <div className="row align-items-center g-4">
                                                    <div className="col-md-2 border-end border-light">
                                                        <div className="d-flex flex-column">
                                                            <span className="small text-muted fw-bold text-uppercase tracking-wider mb-1">Token Number</span>
                                                            <h3 className="fw-bold mb-0 text-orange">#{order.tokenNumber}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <div className="bg-orange-light p-2 rounded-3 me-3">
                                                                <i className="bi bi-shop text-orange fs-5"></i>
                                                            </div>
                                                            <div>
                                                                <h5 className="fw-bold mb-0">{order.outletName}</h5>
                                                                <span className="text-muted small">Ordered on {new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="ps-5">
                                                            <p className="text-muted small mb-0 line-clamp-1">
                                                                {order.items?.map(i => `${i.quantity}x ${i.foodName}`).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mb-2 d-flex justify-content-between align-items-center">
                                                            <span className={`badge-premium ${statusInfo.badge} small`}>
                                                                <i className={`bi ${statusInfo.icon} me-2`}></i>
                                                                {statusInfo.label}
                                                            </span>
                                                            <span className="small text-muted fw-bold">{statusInfo.progress}%</span>
                                                        </div>
                                                        <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${statusInfo.progress}%` }}
                                                                className={`progress-bar rounded-pill ${order.status === 'DELIVERED' ? 'bg-secondary' : 'bg-orange'}`}
                                                            ></motion.div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 text-md-end d-flex flex-column gap-2">
                                                        <div className="mb-2">
                                                            <span className="text-muted small d-block">Total Paid</span>
                                                            <span className="h4 fw-bold mb-0">₹{order.totalAmount}</span>
                                                        </div>
                                                        <div className="d-flex gap-2 justify-content-md-end">
                                                            <button
                                                                className="btn btn-orange-light btn-sm rounded-3 fw-bold px-3"
                                                                onClick={() => setSelectedBill(order)}
                                                            >
                                                                View Bill
                                                            </button>
                                                            {order.status === 'DELIVERED' && (
                                                                <button
                                                                    className="btn btn-orange btn-sm rounded-3 fw-bold px-3 hover-lift"
                                                                    onClick={() => handleReorder(order)}
                                                                    disabled={reorderingId === order.orderId}
                                                                >
                                                                    {reorderingId === order.orderId ? (
                                                                        <span className="spinner-border spinner-border-sm"></span>
                                                                    ) : "Re-order"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-5 bg-white shadow-premium rounded-4 my-5"
                    >
                        <i className="bi bi-journal-x display-1 text-muted opacity-25 mb-4 d-block"></i>
                        <h3 className="fw-bold">No orders found</h3>
                        <p className="text-muted mb-4 px-3">It's a bit empty here. Let's start with something delicious!</p>
                        <Link to="/outlets" className="btn btn-orange px-5 py-3 rounded-3 fw-bold hover-lift">
                            Browse Outlets
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Bill Modal */}
            <AnimatePresence>
                {selectedBill && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="modal-dialog modal-dialog-centered"
                        >
                            <div className="modal-content border-0 shadow-premium rounded-4 overflow-hidden">
                                <div className="modal-header border-0 bg-light p-4">
                                    <h5 className="modal-title fw-bold">Order Details</h5>
                                    <button type="button" className="btn-close" onClick={() => setSelectedBill(null)}></button>
                                </div>
                                <div className="modal-body p-4 text-start">
                                    <div className="text-center mb-4">
                                        <div className="bg-orange-light d-inline-block p-3 rounded-circle mb-2">
                                            <i className="bi bi-shop text-orange fs-2"></i>
                                        </div>
                                        <h4 className="fw-bold mb-0">{selectedBill.outletName}</h4>
                                        <p className="text-muted small">Token: <span className="fw-bold text-dark">#{selectedBill.tokenNumber}</span></p>
                                    </div>

                                    <div className="card bg-light border-0 rounded-3 p-3 mb-3">
                                        {selectedBill.items?.map((item, idx) => (
                                            <div key={idx} className="d-flex justify-content-between mb-2 last-no-mb">
                                                <span><span className="fw-bold">{item.quantity}x</span> {item.foodName}</span>
                                                <span className="fw-bold">₹{item.totalPrice}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="text-muted">Order Date</span>
                                        <span className="fw-bold">{new Date(selectedBill.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="h5 fw-bold mb-0">Total Paid</span>
                                        <span className="h4 fw-bold text-orange mb-0">₹{selectedBill.totalAmount}</span>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button className="btn btn-light w-100 fw-bold py-2 rounded-3" onClick={() => setSelectedBill(null)}>Close</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .bg-info-light { background: rgba(13, 202, 240, 0.1); }
                .bg-warning-light { background: rgba(255, 193, 7, 0.1); }
                .bg-success-light { background: rgba(25, 135, 84, 0.1); }
                .bg-secondary-light { background: rgba(108, 117, 125, 0.1); }
                .last-no-mb:last-child { margin-bottom: 0 !important; }
            `}</style>
        </div>
    );
};

export default MyOrders;
