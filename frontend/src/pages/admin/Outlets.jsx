import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import adminService from '../../api/adminService';

const Outlets = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [outlets, setOutlets] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOutlet, setEditingOutlet] = useState(null);
    const [formData, setFormData] = useState({
        outletName: '',
        cuisineType: '',
        description: '',
        openingHours: '',
        ownerId: '',
        imageUrl: '',
        open: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [outletsData, usersData] = await Promise.all([
                    adminService.getAllOutlets(),
                    adminService.getAllUsers()
                ]);
                setOutlets(outletsData);
                setOwners(usersData.filter(u => u.role === 'OUTLET_OWNER'));

                // Check if we should open the modal from dashboard link
                if (location.state?.openModal) {
                    handleOpenModal();
                    // Clear state so it doesn't reopen on refresh
                    window.history.replaceState({}, document.title);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [location.state]);

    const handleOpenModal = (outlet = null) => {
        if (outlet) {
            setEditingOutlet(outlet);
            setFormData({
                outletName: outlet.outletName,
                cuisineType: outlet.cuisineType,
                description: outlet.description,
                openingHours: outlet.openingHours,
                ownerId: outlet.ownerId || '',
                imageUrl: outlet.imageUrl || '',
                open: outlet.open
            });
        } else {
            setEditingOutlet(null);
            setFormData({
                outletName: '',
                cuisineType: '',
                description: '',
                openingHours: '',
                ownerId: '',
                imageUrl: '',
                open: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOutlet) {
                await adminService.updateOutlet(editingOutlet.outletId, formData);
            } else {
                await adminService.createOutlet(formData);
            }
            // Refresh data
            const updatedOutlets = await adminService.getAllOutlets();
            setOutlets(updatedOutlets);
            setShowModal(false);
        } catch (error) {
            alert('Failed to save outlet: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="p-4 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>Outlet Management</h2>
                    <p className="text-muted small fw-medium">Control stall visibility and owner assignments.</p>
                </div>
                <button className="btn btn-orange d-flex align-items-center gap-2 shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg"></i>
                    <span>Register Outlet</span>
                </button>
            </div>

            <div className="row g-4">
                {outlets.map(outlet => (
                    <div key={outlet.outletId} className="col-xl-4 col-md-6">
                        <div className="card h-100 border-0 stat-card shadow-sm overflow-hidden">
                            <div className="position-relative">
                                {outlet.imageUrl ? (
                                    <img src={outlet.imageUrl} alt={outlet.outletName} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: '200px' }}>
                                        <i className="bi bi-image fs-1 opacity-25"></i>
                                    </div>
                                )}
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className={`badge rounded-pill shadow-sm border border-white border-opacity-25 ${outlet.open ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.65rem', padding: '6px 12px' }}>
                                        {outlet.open ? '● ACTIVE' : '○ CLOSED'}
                                    </span>
                                </div>
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white">
                                    <span className="badge bg-orange text-white fw-bold x-small shadow-sm">{outlet.cuisineType}</span>
                                </div>
                            </div>
                            <div className="card-body p-4 pt-3">
                                <h5 className="fw-bold mb-2">{outlet.outletName}</h5>
                                <p className="text-muted small mb-4 text-truncate-2" style={{ height: '40px', lineHeight: '1.5' }}>{outlet.description}</p>

                                <div className="d-flex align-items-center mb-4 p-3 bg-light bg-opacity-50 rounded-4 border border-white">
                                    <div className="bg-white p-2 rounded-circle me-3 shadow-sm border border-light">
                                        <i className="bi bi-person-badge text-orange fs-5"></i>
                                    </div>
                                    <div className="small overflow-hidden">
                                        <div className="text-muted x-small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Manager</div>
                                        <div className="fw-bold text-dark text-truncate">{owners.find(o => o.userId === outlet.ownerId)?.fullName || 'Unassigned'}</div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <Link to={`/admin/outlets/${outlet.outletId}`} className="btn btn-light rounded-3 flex-grow-1 small fw-bold py-2 border">View Profile</Link>
                                    <button className="btn btn-outline-orange rounded-3 px-3 py-2 border shadow-sm" onClick={() => handleOpenModal(outlet)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="modal show d-block fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header border-0 p-4 pb-0">
                                    <h5 className="modal-title fw-bold">{editingOutlet ? 'Update Outlet' : 'Register New Outlet'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body p-4 pt-3">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">OUTLET NAME</label>
                                        <input type="text" className="form-control bg-light border-0 py-2 rounded-3" required
                                            value={formData.outletName} onChange={e => setFormData({ ...formData, outletName: e.target.value })} />
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">CUISINE TYPE</label>
                                            <input type="text" className="form-control bg-light border-0 py-2 rounded-3" required placeholder="e.g. Italian"
                                                value={formData.cuisineType} onChange={e => setFormData({ ...formData, cuisineType: e.target.value })} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">OPENING HOURS</label>
                                            <input type="text" className="form-control bg-light border-0 py-2 rounded-3" required placeholder="e.g. 9 AM - 10 PM"
                                                value={formData.openingHours} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">DESCRIPTION</label>
                                        <textarea className="form-control bg-light border-0 py-2 rounded-3" rows="3" required
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">ASSIGN OWNER</label>
                                        <select className="form-select bg-light border-0 py-2 rounded-3" required
                                            value={formData.ownerId} onChange={e => setFormData({ ...formData, ownerId: e.target.value })}>
                                            <option value="">Select an Owner...</option>
                                            {owners.map(owner => (
                                                <option key={owner.userId} value={owner.userId}>{owner.fullName} ({owner.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">IMAGE URL</label>
                                        <input type="text" className="form-control bg-light border-0 py-2 rounded-3" placeholder="https://example.com/image.jpg"
                                            value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    </div>
                                    <div className="form-check form-switch mt-4 bg-light p-3 rounded-4 d-flex justify-content-between align-items-center">
                                        <label className="form-check-label fw-bold small text-muted">ACTIVE STATUS</label>
                                        <input className="form-check-input ms-3 fs-5" type="checkbox" role="switch"
                                            checked={formData.open} onChange={e => setFormData({ ...formData, open: e.target.checked })} />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light rounded-3 px-4 py-2 border shadow-sm" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-orange rounded-3 px-4 py-2 shadow-sm">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Outlets;
