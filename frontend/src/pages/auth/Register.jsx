import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);

            // Different messages based on role
            if (formData.role === 'OUTLET_OWNER') {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Your vendor account is pending admin approval. You will be notified once approved.',
                        type: 'info'
                    }
                });
            } else {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please login.',
                        type: 'success'
                    }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card shadow-premium border-0 rounded-4 overflow-hidden"
                        >
                            <div className="bg-orange p-5 text-center text-white text-start">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="mb-3 d-inline-block p-3 bg-white bg-opacity-25 rounded-circle"
                                >
                                    <i className="bi bi-person-plus-fill fs-1"></i>
                                </motion.div>
                                <h2 className="fw-bold mb-1">Create Account</h2>
                                <p className="opacity-75 mb-0 lead">Join the EatOrbit family</p>
                            </div>
                            <div className="card-body p-5 text-start">
                                {error && (
                                    <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center">
                                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-uppercase tracking-wider">Full Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><i className="bi bi-person text-orange"></i></span>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                                    placeholder="John Doe"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-uppercase tracking-wider">Email Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><i className="bi bi-envelope text-orange"></i></span>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-uppercase tracking-wider">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><i className="bi bi-lock text-orange"></i></span>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold small text-uppercase tracking-wider">I am a...</label>
                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="role"
                                                        id="roleCustomer"
                                                        value="CUSTOMER"
                                                        checked={formData.role === 'CUSTOMER'}
                                                        onChange={handleChange}
                                                    />
                                                    <label className={`btn w-100 py-3 rounded-4 transition-all d-flex flex-column align-items-center gap-2 ${formData.role === 'CUSTOMER' ? 'btn-orange shadow-sm' : 'btn-outline-light-orange'}`} htmlFor="roleCustomer">
                                                        <i className="bi bi-person fs-3"></i>
                                                        <span className="fw-bold small">Customer</span>
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="role"
                                                        id="roleOwner"
                                                        value="OUTLET_OWNER"
                                                        checked={formData.role === 'OUTLET_OWNER'}
                                                        onChange={handleChange}
                                                    />
                                                    <label className={`btn w-100 py-3 rounded-4 transition-all d-flex flex-column align-items-center gap-2 ${formData.role === 'OUTLET_OWNER' ? 'btn-orange shadow-sm' : 'btn-outline-light-orange'}`} htmlFor="roleOwner">
                                                        <i className="bi bi-shop fs-3"></i>
                                                        <span className="fw-bold small">Stall Owner</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-orange w-100 py-3 fs-5 fw-bold shadow-sm mt-5 hover-lift">
                                        Register Account
                                    </button>

                                    <div className="text-center mt-4">
                                        <p className="text-muted mb-0">Already have an account? <Link to="/login" className="text-orange fw-bold text-decoration-none border-bottom border-2 border-orange border-opacity-25 pb-1">Login here</Link></p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
