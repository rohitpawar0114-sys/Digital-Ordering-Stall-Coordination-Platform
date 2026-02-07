import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top premium-nav">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/" style={{ letterSpacing: '-1px' }}>
                    EatOrbit<span className="text-orange">.</span>
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/outlets">Outlets</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/track-order">Track Order</Link>
                        </li>
                        <li className="nav-item ms-lg-2">
                            <Link className="nav-link premium-admin-link" to="/admin/login">
                                <i className="bi bi-shield-lock me-1"></i> Admin
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                {user.role === 'CUSTOMER' && (
                                    <Link to="/cart" className="btn btn-orange-nav position-relative">
                                        <i className="bi bi-cart3 me-1"></i>
                                        <span className="d-none d-md-inline">Cart</span>
                                        {cartCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-dark" style={{ fontSize: '0.65rem' }}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}
                                <div className="dropdown">
                                    <button className="btn btn-outline-light-premium dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        <i className="bi bi-person-circle me-2"></i>
                                        <span className="d-none d-sm-inline">{user.fullName || user.name}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-premium mt-2">
                                        {user.role === 'CUSTOMER' && (
                                            <li><Link className="dropdown-item" to="/my-orders"><i className="bi bi-bag-check me-2"></i>My Orders</Link></li>
                                        )}
                                        {user.role === 'OUTLET_OWNER' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/vendor/dashboard"><i className="bi bi-grid-fill me-2"></i>Dashboard</Link></li>
                                                <li><Link to="/vendor/menu" className="dropdown-item"><i className="bi bi-list-stars me-2"></i>Manage Menu</Link></li>
                                            </>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/dashboard"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/users"><i className="bi bi-people me-2"></i>Manage Users</Link></li>
                                            </>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-link text-white text-decoration-none px-3">Login</Link>
                                <Link to="/register" className="btn btn-orange-nav shadow-sm px-4">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                .premium-nav {
                    background: rgba(10, 15, 29, 0.95) !important;
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 0.8rem 0;
                }
                .navbar-dark .navbar-nav .nav-link {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                }
                .navbar-dark .navbar-nav .nav-link:hover { color: var(--primary-orange); }
                .premium-admin-link {
                    color: var(--primary-orange) !important;
                    opacity: 0.8;
                }
                .premium-admin-link:hover { opacity: 1; }
                
                .btn-orange-nav {
                    background: var(--primary-orange);
                    color: white;
                    border-radius: 12px;
                    padding: 8px 20px;
                    font-weight: 600;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-orange-nav:hover {
                    background: var(--primary-orange-hover);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 122, 0, 0.3);
                }
                
                .btn-outline-light-premium {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 12px;
                    padding: 8px 18px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .btn-outline-light-premium:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                .dropdown-menu {
                    background: #151B2D;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 14px;
                    padding: 8px;
                }
                .dropdown-item {
                    color: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    padding: 10px 16px;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }
                .dropdown-item:hover {
                    background: rgba(255, 122, 0, 0.1);
                    color: var(--primary-orange);
                }
                .dropdown-divider { border-color: rgba(255, 255, 255, 0.05); }
            `}</style>
        </nav>
    );
};

export default Navbar;
