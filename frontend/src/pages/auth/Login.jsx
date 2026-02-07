import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const registrationMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light" style={{ background: 'linear-gradient(135deg, #FFF4EB 0%, #FFFFFF 100%)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4"
            >
                <div className="card border-0 shadow-premium rounded-4 overflow-hidden">
                    <div className="p-5">
                        <div className="text-center mb-5">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-4 d-inline-block p-3 rounded-circle bg-orange-light"
                            >
                                <i className="bi bi-person-circle fs-1 text-orange"></i>
                            </motion.div>
                            <h2 className="display-6 fw-bold mb-2">Welcome Back</h2>
                            <p className="text-muted">Sign in to continue your food journey</p>
                        </div>

                        {registrationMessage && (
                            <div className="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm" role="alert">
                                <i className="bi bi-check-circle-fill me-2"></i> {registrationMessage}
                                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger rounded-3 border-0 shadow-sm mb-4">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase tracking-wider">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 rounded-start-3 p-3">
                                        <i className="bi bi-envelope text-muted"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control form-control-premium border-start-0 rounded-end-3"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase tracking-wider">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 rounded-start-3 p-3">
                                        <i className="bi bi-lock text-muted"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control form-control-premium border-start-0 rounded-end-3"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-orange w-100 py-3 rounded-3 fs-5 mb-4 hover-lift">
                                Login to EatOrbit
                            </button>

                            <div className="text-center mb-4">
                                <Link to="/admin/login" className="text-orange small text-decoration-none fw-semibold">
                                    <i className="bi bi-shield-lock me-1"></i> Are you an Admin? Admin Console
                                </Link>
                            </div>

                            <div className="text-center pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Don't have an account? <Link to="/register" className="text-orange fw-bold text-decoration-none ms-1">Create Account</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
