import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import vendorService from '../../api/vendorService';

const Settings = () => {
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        outletName: '',
        cuisineType: '',
        openingHours: '',
        description: ''
    });

    useEffect(() => {
        fetchOutlet();
    }, []);

    const fetchOutlet = async () => {
        try {
            const data = await vendorService.getOutlet();
            if (data) {
                setOutlet(data);
                setFormData({
                    outletName: data.outletName,
                    cuisineType: data.cuisineType,
                    openingHours: data.openingHours,
                    description: data.description || ''
                });
            }
        } catch (err) {
            console.error('Error fetching outlet:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!outlet) return;
        try {
            await vendorService.updateOutlet(outlet.outletId, { ...outlet, open: newStatus });
            setOutlet({ ...outlet, open: newStatus });
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (outlet) {
                await vendorService.updateOutlet(outlet.outletId, formData);
                alert('✅ Settings updated successfully!');
            } else {
                await vendorService.createOutlet(formData);
                alert('🎉 Outlet created successfully! You can now manage your menu.');
            }
            await fetchOutlet();
        } catch (err) {
            console.error('Error saving outlet:', err);
            alert('❌ Failed to save outlet: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container-fluid py-4 px-4">
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Outlet Settings</h2>
                <p className="text-muted mb-0">Manage your outlet's public profile and operational status.</p>
            </div>

            <div className="row g-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="col-lg-8"
                >
                    {/* Operational Status */}
                    <div className="card border-0 shadow-premium rounded-4 p-4 mb-4 overflow-hidden position-relative">
                        <div className={`position-absolute top-0 start-0 w-100 h-100 opacity-10 ${outlet?.open ? 'bg-success' : 'bg-danger'}`}></div>
                        <div className="d-flex justify-content-between align-items-center position-relative z-1">
                            <div>
                                <h5 className="fw-bold mb-1">Outlet Status</h5>
                                <p className="text-muted small mb-0">Control whether your stall is visible for ordering.</p>
                            </div>
                            <div className="form-check form-switch p-0 m-0 d-flex flex-column align-items-center">
                                <input
                                    className="form-check-input fs-2 ms-0 cursor-pointer shadow-sm"
                                    type="checkbox"
                                    role="switch"
                                    checked={outlet?.open || false}
                                    onChange={(e) => handleUpdateStatus(e.target.checked)}
                                    style={{ width: '3.5rem', height: '1.75rem' }}
                                />
                                <span className={`fw-bold mt-2 small ${outlet?.open ? 'text-success' : 'text-danger'}`}>
                                    {outlet?.open ? 'LIVE NOW' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="card border-0 shadow-premium rounded-4 p-4 p-md-5">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="bg-orange text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-pencil-fill"></i>
                            </span>
                            <h4 className="fw-bold mb-0">Edit Profile Details</h4>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Outlet Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-3 ps-3 text-muted"><i className="bi bi-shop"></i></span>
                                        <input type="text" className="form-control bg-light border-0 py-3 rounded-end-3"
                                            value={formData.outletName} onChange={e => setFormData({ ...formData, outletName: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Cuisine Type</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-3 ps-3 text-muted"><i className="bi bi-egg-fried"></i></span>
                                        <input type="text" className="form-control bg-light border-0 py-3 rounded-end-3"
                                            value={formData.cuisineType} onChange={e => setFormData({ ...formData, cuisineType: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Opening Hours</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 rounded-start-3 ps-3 text-muted"><i className="bi bi-clock"></i></span>
                                        <input type="text" className="form-control bg-light border-0 py-3 rounded-end-3" placeholder="e.g. 9:00 AM - 10:00 PM"
                                            value={formData.openingHours} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Description</label>
                                    <textarea className="form-control bg-light border-0 py-3 rounded-3" rows="4"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>

                                <div className="col-12 mt-4 pt-3 border-top">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted small mb-0 fst-italic"><i className="bi bi-info-circle me-1"></i>Changes reflect immediately.</p>
                                        <button type="submit" className="btn btn-orange rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span> Saving...
                                                </>
                                            ) : (
                                                <>Save Changes</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-lg-4"
                >
                    <div className="sticky-top" style={{ top: '2rem' }}>
                        <div className="card border-0 shadow-premium rounded-4 p-4 mb-4 bg-primary bg-opacity-10">
                            <h6 className="fw-bold mb-3 d-flex align-items-center text-primary">
                                <i className="bi bi-lightbulb-fill me-2"></i>
                                Pro Tips
                            </h6>
                            <ul className="small text-dark opacity-75 list-unstyled d-flex flex-column gap-3 mb-0">
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check2-circle mt-1"></i>
                                    <span>Changing opening hours <strong>does not</strong> automatically close your stall. Use the toggle switch.</span>
                                </li>
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check2-circle mt-1"></i>
                                    <span>Detailed descriptions help customers decide what to order.</span>
                                </li>
                                <li className="d-flex align-items-start gap-2">
                                    <i className="bi bi-check2-circle mt-1"></i>
                                    <span>Keep your cuisine type specific (e.g., "South Indian" instead of just "Indian").</span>
                                </li>
                            </ul>
                        </div>

                        <div className="card border-0 shadow-premium rounded-4 p-4 text-center">
                            <h6 className="fw-bold text-muted small text-uppercase tracking-wider mb-3">Owner Profile</h6>
                            <div className="bg-light p-4 rounded-circle d-inline-block mx-auto mb-3 shadow-inner">
                                <i className="bi bi-person-badge fs-1 text-orange opacity-75"></i>
                            </div>
                            <h5 className="fw-bold mb-1 text-dark">{outlet?.ownerName || 'Outlet Owner'}</h5>
                            <p className="text-muted small mb-0">{outlet?.ownerEmail}</p>
                            <div className="mt-3 pt-3 border-top">
                                <span className="badge bg-dark rounded-pill px-3 py-2">VENDOR ACCOUNT</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
