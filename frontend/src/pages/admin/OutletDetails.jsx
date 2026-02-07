import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminService from '../../api/adminService';

const OutletDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [outlet, setOutlet] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await adminService.getOutletById(id);
                setOutlet(data);
                if (data && data.ownerId) {
                    const users = await adminService.getAllUsers();
                    setOwner(users.find(u => u.userId === data.ownerId));
                }
            } catch (error) {
                console.error('Error fetching outlet details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`❗ Are you sure you want to delete "${outlet.outletName}"?\n\nThis will also delete all associated food items, categories, and orders. This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        try {
            await adminService.deleteOutlet(outlet.outletId || id);
            alert('🎉 Outlet successfully deleted.');
            navigate('/admin/outlets');
        } catch (error) {
            console.error('Error deleting outlet:', error);
            alert('❌ Failed to delete outlet. Check console for details.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-orange"></div></div>;
    if (!outlet) return <div className="container py-5 text-center"><h4>Outlet not found</h4><Link to="/admin/outlets" className="btn btn-orange mt-3">Back to Outlets</Link></div>;

    return (
        <div className="p-4">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/admin/outlets" className="text-orange text-decoration-none">Outlets</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{outlet.outletName}</li>
                </ol>
            </nav>

            <div className="row g-4">
                <div className="col-lg-8">
                    {outlet.imageUrl && (
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <img src={outlet.imageUrl} alt={outlet.outletName} className="img-fluid" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                        </div>
                    )}
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 className="fw-bold mb-1">{outlet.outletName}</h2>
                                <span className="badge bg-light text-muted border px-3 py-2 fw-normal">{outlet.cuisineType}</span>
                            </div>
                            <span className={`badge rounded-pill px-4 py-2 ${outlet.open ? 'bg-success' : 'bg-danger'}`}>
                                {outlet.open ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                        <h6 className="fw-bold text-muted small text-uppercase mb-3">Description</h6>
                        <p className="lead fs-6 text-muted mb-4">{outlet.description}</p>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="p-3 bg-light rounded-4">
                                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Opening Hours</h6>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-clock me-2 text-orange"></i>
                                        <span className="fw-bold">{outlet.openingHours}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 bg-light rounded-4">
                                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Created Date</h6>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-calendar3 me-2 text-info"></i>
                                        <span className="fw-bold">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Performance Summary</h5>
                        <div className="row text-center g-3">
                            <div className="col-4 border-end">
                                <h4 className="fw-bold mb-0">1.2k</h4>
                                <small className="text-muted">Orders</small>
                            </div>
                            <div className="col-4 border-end">
                                <h4 className="fw-bold mb-0">₹45k</h4>
                                <small className="text-muted">Revenue</small>
                            </div>
                            <div className="col-4">
                                <h4 className="fw-bold mb-0">4.8</h4>
                                <small className="text-muted">Rating</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4">Assigned Owner</h5>
                        {owner ? (
                            <div className="text-center">
                                <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-person-fill display-4"></i>
                                </div>
                                <h5 className="fw-bold mb-1">{owner.fullName}</h5>
                                <p className="text-muted small mb-3">{owner.email}</p>
                                <div className="d-grid">
                                    <button className="btn btn-outline-orange rounded-pill small">Contact Owner</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <i className="bi bi-person-exclamation fs-1 text-muted opacity-25 mb-3"></i>
                                <p className="text-muted small">No owner assigned to this outlet.</p>
                                <Link to="/admin/outlets" className="btn btn-light rounded-pill small">Assign Now</Link>
                            </div>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="d-grid gap-2">
                            <button className="btn btn-light text-start border-0 py-2 ripple" disabled={deleting}>
                                <i className="bi bi-pencil me-2"></i> Edit Details
                            </button>
                            <button
                                className="btn btn-light text-start border-0 py-2 ripple text-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : <i className="bi bi-trash me-2"></i>}
                                Delete Outlet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutletDetails;
