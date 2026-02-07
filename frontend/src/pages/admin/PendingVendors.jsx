import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const PendingVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchPendingVendors();
    }, []);

    const fetchPendingVendors = async () => {
        try {
            const data = await adminService.getPendingVendors();
            setVendors(data);
        } catch (err) {
            console.error('Error fetching pending vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (vendorId) => {
        if (!window.confirm('Are you sure you want to approve this vendor?')) return;

        setProcessing(vendorId);
        try {
            await adminService.approveVendor(vendorId);
            alert('✅ Vendor approved successfully! They can now login.');
            fetchPendingVendors();
        } catch (err) {
            alert('❌ Failed to approve vendor: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (vendorId) => {
        if (!window.confirm('Are you sure you want to reject this vendor? This action cannot be undone.')) return;

        setProcessing(vendorId);
        try {
            await adminService.rejectVendor(vendorId);
            alert('🚫 Vendor rejected');
            fetchPendingVendors();
        } catch (err) {
            alert('❌ Failed to reject vendor: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-orange" style={{ color: 'var(--primary-orange)' }}></div>
                <p className="mt-3 text-muted">Loading pending vendors...</p>
            </div>
        );
    }

    return (
        <div className="p-4 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Vendor Approvals</h2>
                    <p className="text-muted small fw-medium">Review and verify registration requests from new stall owners.</p>
                </div>
                <div className="badge bg-orange bg-opacity-10 text-orange px-4 py-2 rounded-pill fw-bold border border-orange border-opacity-10">
                    {vendors.length} Requests Pending
                </div>
            </div>

            {vendors.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed p-5">
                    <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-check2-all display-4"></i>
                    </div>
                    <h4 className="fw-bold text-dark">All caught up 🎉</h4>
                    <p className="text-muted small mx-auto" style={{ maxWidth: '300px' }}>No pending vendor requests at the moment. Your platform is running smoothly!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {vendors.map(vendor => (
                        <div key={vendor.userId} className="col-lg-6">
                            <div className="card stat-card border-0 shadow-sm p-4 h-100">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div className="d-flex align-items-center overflow-hidden">
                                        <div className="bg-orange bg-opacity-10 text-orange p-3 rounded-4 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                            <i className="bi bi-person-badge fs-3"></i>
                                        </div>
                                        <div className="overflow-hidden">
                                            <h5 className="fw-bold mb-0 text-truncate">{vendor.fullName}</h5>
                                            <div className="text-muted x-small fw-bold text-orange text-truncate">{vendor.email}</div>
                                        </div>
                                    </div>
                                    <div className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 border border-warning border-opacity-25 rounded-pill x-small fw-bold">PENDING</div>
                                </div>

                                <div className="bg-light bg-opacity-50 rounded-3 p-3 mb-4 small">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Request Date:</span>
                                        <span className="fw-bold text-dark">{new Date(vendor.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">User ID:</span>
                                        <span className="fw-bold text-dark">#{vendor.userId}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        className="btn btn-orange flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2 small fw-bold py-2"
                                        disabled={processing === vendor.userId}
                                        onClick={() => handleApprove(vendor.userId)}>
                                        {processing === vendor.userId ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-check-circle"></i>}
                                        Approve Access
                                    </button>
                                    <button
                                        className="btn btn-outline-danger flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2 small fw-bold py-2"
                                        disabled={processing === vendor.userId}
                                        onClick={() => handleReject(vendor.userId)}>
                                        <i className="bi bi-x-circle"></i> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style>{`.x-small { font-size: 0.72rem; }`}</style>
        </div>
    );
};

export default PendingVendors;
