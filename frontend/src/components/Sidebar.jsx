import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const isOwner = user?.role === 'OUTLET_OWNER';

    const renderLinks = () => {
        if (isAdmin) {
            return (
                <>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-speedometer2 me-3"></i> Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/pending-vendors" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-hourglass-split me-3"></i> Pending Vendors
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/users" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-people me-3"></i> User Management
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/outlets" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-shop me-3"></i> Outlet Management
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/monitor" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-graph-up-arrow me-3"></i> Platform Monitor
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/admin/subscribers" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-envelope-check me-3"></i> Subscribers
                        </NavLink>
                    </li>
                </>
            );
        }

        if (isOwner) {
            return (
                <>
                    <li className="nav-item mb-1">
                        <NavLink to="/vendor/dashboard" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-grid me-3"></i> Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/vendor/orders" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-cart-check me-3"></i> Live Orders
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/vendor/menu" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-list-ul me-3"></i> Menu Manager
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/vendor/payments" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-qr-code me-3"></i> Payment QR
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/vendor/settings" className={({ isActive }) => `nav-link rounded-3 px-3 py-2 ${isActive ? 'bg-orange text-white active-nav' : 'text-white-50 hover-bg'}`}>
                            <i className="bi bi-gear me-3"></i> Outlet Settings
                        </NavLink>
                    </li>
                </>
            );
        }
        return null;
    };

    return (
        <div className="bg-sidebar text-white min-vh-100 p-0 shadow-lg position-sticky top-0" style={{ width: '280px', flexShrink: 0, height: '100vh', zIndex: 1000 }}>
            <div className="p-4 mb-2">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-orange p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className={`bi bi-${isAdmin ? 'shield-lock' : 'shop-window'} text-white fs-5`}></i>
                    </div>
                    <div>
                        <h5 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px' }}>
                            EatOrbit
                        </h5>
                        <small className="text-orange fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                            {isAdmin ? 'Administrator' : 'Vendor Office'}
                        </small>
                    </div>
                </div>
            </div>

            <div className="px-3 mt-4">
                <p className="section-title mb-3 px-3">Management</p>
                <ul className="nav nav-pills flex-column gap-1">
                    {renderLinks()}
                </ul>
            </div>

            <style>
                {`
                    .bg-sidebar {
                        background-color: #0F172A !important;
                        border-right: 1px solid rgba(255,255,255,0.05);
                    }
                    .nav-link {
                        font-weight: 500;
                        font-size: 0.9rem;
                        color: #94A3B8 !important;
                        transition: all 0.2s ease;
                        position: relative;
                        display: flex;
                        align-items: center;
                    }
                    .nav-link i {
                        font-size: 1.1rem;
                        transition: transform 0.2s ease;
                    }
                    .nav-link:hover {
                        background-color: rgba(255, 122, 0, 0.05); /* Soft orange tint */
                        color: var(--primary-orange) !important;
                    }
                    .nav-link:hover i {
                        transform: scale(1.1);
                        color: var(--primary-orange) !important;
                    }
                    .active-nav {
                        background-color: rgba(255, 122, 0, 0.1) !important;
                        color: var(--primary-orange) !important;
                        font-weight: 600;
                    }
                    .active-nav i {
                        color: var(--primary-orange) !important;
                    }
                    .active-nav::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 15%;
                        height: 70%;
                        width: 4px;
                        background-color: var(--primary-orange);
                        border-radius: 0 4px 4px 0;
                        box-shadow: 2px 0 8px var(--primary-orange);
                    }
                `}
            </style>
        </div>
    );
};

export default Sidebar;
