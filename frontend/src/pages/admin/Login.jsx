import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                setError('Access Denied: You do not have administrator privileges.');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: '#0F172A' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="col-12 col-md-8 col-lg-5 col-xl-4"
            >
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                    <div className="text-center p-5 bg-orange text-white">
                        <motion.div
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                        >
                            <i className="bi bi-shield-lock-fill display-2"></i>
                        </motion.div>
                        <h2 className="display-6 fw-bold mt-3 mb-0">Admin Portal</h2>
                        <p className="opacity-75">Secure Access Gateway</p>
                    </div>

                    <div className="card-body p-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="alert alert-danger border-0 rounded-3 small mb-4 shadow-sm"
                            >
                                <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted tracking-widest text-uppercase">Admin Email</label>
                                <div className="input-group border rounded-3 p-2 bg-light">
                                    <span className="input-group-text bg-transparent border-0">
                                        <i className="bi bi-envelope-fill text-muted"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control bg-transparent border-0 shadow-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@eatorbit.com"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted tracking-widest text-uppercase">Secure Password</label>
                                <div className="input-group border rounded-3 p-2 bg-light">
                                    <span className="input-group-text bg-transparent border-0">
                                        <i className="bi bi-key-fill text-muted"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control bg-transparent border-0 shadow-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-orange w-100 py-3 rounded-3 fw-bold fs-5 mt-2 hover-lift"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <><i className="bi bi-unlock-fill me-2"></i> Sign in to Console</>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="card-footer bg-light p-4 text-center border-0">
                        <Link to="/login" className="text-muted small text-decoration-none">
                            <i className="bi bi-arrow-left me-1"></i> Return to Customer Site
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
