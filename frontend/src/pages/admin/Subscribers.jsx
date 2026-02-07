import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const data = await adminService.getSubscribers();
                setSubscribers(data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);

    if (loading) {
        return (
            <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-orange" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Newsletter Subscribers</h4>
                    <p className="text-muted small mb-0">Manage and view all email subscriptions.</p>
                </div>
                <div className="bg-white px-3 py-2 rounded-3 border shadow-sm">
                    <span className="text-muted small me-2">Total Subscribers:</span>
                    <span className="fw-bold text-orange">{subscribers.length}</span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Email Address</th>
                                <th>Subscription Date</th>
                                <th className="text-end pe-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.length > 0 ? (
                                subscribers.map((sub) => (
                                    <tr key={sub.id}>
                                        <td className="ps-4 py-3 align-middle">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light p-2 rounded-circle">
                                                    <i className="bi bi-envelope text-orange"></i>
                                                </div>
                                                <span className="fw-bold">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted small align-middle">
                                            {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="text-end pe-4 align-middle">
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <div className="py-4">
                                            <i className="bi bi-people fs-1 text-muted opacity-25 d-block mb-3"></i>
                                            <p className="text-muted">No subscribers found yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscribers;
