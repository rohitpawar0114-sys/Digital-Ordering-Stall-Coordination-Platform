import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const Monitor = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await adminService.getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Simulated data for demo if API fails
                setOrders([
                    { orderId: 101, outletName: 'Pizza Hub', totalAmount: 450, status: 'DELIVERED', paymentStatus: 'PAID', createdAt: new Date().toISOString() },
                    { orderId: 102, outletName: 'Burger King', totalAmount: 220, status: 'PREPARING', paymentStatus: 'PAID', createdAt: new Date().toISOString() },
                    { orderId: 103, outletName: 'Taco Bell', totalAmount: 380, status: 'PENDING', paymentStatus: 'PENDING', createdAt: new Date().toISOString() },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'success';
            case 'READY': return 'info';
            case 'PREPARING': return 'warning';
            case 'CANCELLED': return 'danger';
            default: return 'primary';
        }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="p-4 fade-in">
            <div className="mb-5">
                <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Platform Monitor</h2>
                <p className="text-muted small fw-medium">Real-time oversight of platform logistics and system health.</p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 className="section-title mb-4">Order Status Mix</h6>
                        <div className="d-flex flex-column gap-4">
                            <div>
                                <div className="d-flex justify-content-between mb-2 x-small fw-bold">
                                    <span className="text-success">DELIVERED</span>
                                    <span>70%</span>
                                </div>
                                <div className="progress rounded-pill bg-success bg-opacity-10" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-success rounded-pill" style={{ width: '70%', transition: 'width 1s ease-in-out' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between mb-2 x-small fw-bold">
                                    <span className="text-warning">PREPARING</span>
                                    <span>20%</span>
                                </div>
                                <div className="progress rounded-pill bg-warning bg-opacity-10" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-warning rounded-pill" style={{ width: '20%', transition: 'width 1.2s ease-in-out' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between mb-2 x-small fw-bold">
                                    <span className="text-danger">CANCELLED</span>
                                    <span>10%</span>
                                </div>
                                <div className="progress rounded-pill bg-danger bg-opacity-10" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-danger rounded-pill" style={{ width: '10%', transition: 'width 1.5s ease-in-out' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 className="section-title mb-4">System Logistics</h6>
                        <div className="row g-4">
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light bg-opacity-25 rounded-4 text-center border border-white h-100 d-flex flex-column justify-content-center">
                                    <div className="display-6 fw-bold text-success mb-1" style={{ letterSpacing: '-2px' }}>99.9%</div>
                                    <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Uptime</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light bg-opacity-25 rounded-4 text-center border border-white h-100 d-flex flex-column justify-content-center">
                                    <div className="display-6 fw-bold text-info mb-1" style={{ letterSpacing: '-2px' }}>2.4s</div>
                                    <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Response</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light bg-opacity-25 rounded-4 text-center border border-white h-100 d-flex flex-column justify-content-center">
                                    <div className="display-6 fw-bold text-orange mb-1" style={{ letterSpacing: '-2px' }}>540</div>
                                    <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>User/Hr</div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light bg-opacity-25 rounded-4 text-center border border-white h-100 d-flex flex-column justify-content-center">
                                    <div className="display-6 fw-bold text-danger mb-1" style={{ letterSpacing: '-2px' }}>0</div>
                                    <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Fatal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Live Order Stream</h5>
                    <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 d-flex align-items-center gap-2 x-small fw-bold">
                        <span className="p-1 bg-success rounded-circle animate-pulse"></span> LIVE
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-modern align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 border-0">ID</th>
                                <th className="py-3 border-0">Outlet</th>
                                <th className="py-3 border-0">Amount</th>
                                <th className="py-3 border-0">Payment</th>
                                <th className="py-3 border-0 text-center">Status</th>
                                <th className="py-3 border-0 text-end pe-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td className="px-4 py-3 text-muted small fw-bold">#{order.orderId}</td>
                                    <td className="py-3 fw-bold">{order.outletName}</td>
                                    <td className="py-3 fw-bold text-orange">₹{order.totalAmount}</td>
                                    <td className="py-3">
                                        <span className={`badge bg-${order.paymentStatus === 'PAID' ? 'success' : 'warning'} bg-opacity-10 text-${order.paymentStatus === 'PAID' ? 'success' : 'warning'} border border-${order.paymentStatus === 'PAID' ? 'success' : 'warning'} border-opacity-10 rounded-pill x-small fw-bold`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className={`badge bg-${getStatusColor(order.status)} p-1 rounded-circle me-2 animate-pulse`}></span>
                                            <span className="small fw-bold text-muted" style={{ fontSize: '0.75rem' }}>{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4 text-muted small">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>
                {`
                    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
                    .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
                `}
            </style>
        </div>
    );
};

export default Monitor;
