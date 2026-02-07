import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const OwnerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/owner/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching owner orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/api/owner/order/${orderId}/status`, null, { params: { status: newStatus } });
            await fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fw-bold">Owner <span className="text-orange">Dashboard</span></h1>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-orange btn-sm" onClick={fetchOrders}><i className="bi bi-arrow-clockwise"></i> Refresh</button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <h4 className="fw-bold mb-4">Pending & Active Orders</h4>
                    {orders.length === 0 ? (
                        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
                            <p className="text-muted mb-0">No orders received yet.</p>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Token</th>
                                            <th className="py-3 border-0">Items</th>
                                            <th className="py-3 border-0">Total</th>
                                            <th className="py-3 border-0">Status</th>
                                            <th className="px-4 py-3 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-4">
                                                    <span className="fw-bold">{order.token}</span>
                                                    <div className="small text-muted">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                                </td>
                                                <td>
                                                    {order.items?.map(item => (
                                                        <div key={item.id} className="small">
                                                            {item.quantity} x {item.foodItem.name}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>₹{order.totalAmount}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${order.status === 'PENDING' ? 'bg-warning' :
                                                            order.status === 'PREPARING' ? 'bg-info' :
                                                                order.status === 'READY' ? 'bg-success' : 'bg-secondary'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 text-end">
                                                    <div className="btn-group btn-group-sm">
                                                        {order.status === 'PENDING' && (
                                                            <button
                                                                className="btn btn-orange"
                                                                onClick={() => updateStatus(order.id, 'PREPARING')}
                                                                disabled={updatingId === order.id}
                                                            >Start Preparing</button>
                                                        )}
                                                        {order.status === 'PREPARING' && (
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={() => updateStatus(order.id, 'READY')}
                                                                disabled={updatingId === order.id}
                                                            >Mark Ready</button>
                                                        )}
                                                        {order.status === 'READY' && (
                                                            <button
                                                                className="btn btn-dark"
                                                                onClick={() => updateStatus(order.id, 'DELIVERED')}
                                                                disabled={updatingId === order.id}
                                                            >Hand Over</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
