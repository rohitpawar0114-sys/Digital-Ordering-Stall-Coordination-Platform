import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
            <div className="container-fluid px-4">
                <span className="navbar-text text-muted d-none d-md-block">
                    System Overview
                </span>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <button className="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center position-relative" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-bell text-muted"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-orange border border-light rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                    </button>

                    <div className="dropdown">
                        <button className="btn btn-white border rounded-pill px-2 py-1 shadow-sm d-flex align-items-center gap-2 hover-lift" type="button" data-bs-toggle="dropdown">
                            <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                {user?.fullName?.charAt(0) || 'A'}
                            </div>
                            <span className="fw-bold small pe-2 d-none d-lg-block">{user?.fullName || 'Admin'}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 mt-3" style={{ minWidth: '220px' }}>
                            <li className="px-3 py-3 border-bottom mb-2 bg-light bg-opacity-50">
                                <div className="fw-bold text-dark small">{user?.fullName || 'Master Admin'}</div>
                                <div className="text-muted small" style={{ fontSize: '0.7rem' }}>{user?.email}</div>
                            </li>
                            <li><Link className="dropdown-item py-2 small d-flex align-items-center gap-2" to="/"><i className="bi bi-house text-muted"></i> Visit Marketplace</Link></li>
                            <li><button className="dropdown-item py-2 small d-flex align-items-center gap-2" onClick={() => alert('Profile settings coming soon!')}><i className="bi bi-gear text-muted"></i> Account Settings</button></li>
                            <li><hr className="dropdown-divider opacity-10" /></li>
                            <li><button className="dropdown-item py-2 small text-danger d-flex align-items-center gap-2" onClick={logout}><i className="bi bi-box-arrow-right"></i> Sign Out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
