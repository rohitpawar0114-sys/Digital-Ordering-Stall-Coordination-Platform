import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LoginModal = () => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isLoginModalOpen) return null;

    const handleLogin = () => {
        closeLoginModal();
        navigate('/login', { state: { from: location } });
    };

    const handleRegister = () => {
        closeLoginModal();
        navigate('/register', { state: { from: location } });
    };

    return (
        <AnimatePresence>
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="modal-dialog modal-dialog-centered"
                >
                    <div className="modal-content border-0 shadow-premium rounded-4 overflow-hidden">
                        <div className="modal-body p-5 text-center">
                            <i className="bi bi-shield-lock display-1 text-orange mb-4 d-block"></i>
                            <h3 className="fw-bold mb-3">Login Required</h3>
                            <p className="text-muted mb-4">
                                Please login to continue placing your order. <br />
                                Your delicious food is waiting!
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                                <button
                                    onClick={handleLogin}
                                    className="btn btn-orange px-4 py-2 rounded-3 fw-bold flex-grow-1"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="btn btn-outline-orange px-4 py-2 rounded-3 fw-bold flex-grow-1"
                                >
                                    Register
                                </button>
                            </div>
                            <button
                                onClick={closeLoginModal}
                                className="btn btn-link text-muted text-decoration-none mt-3 fw-bold small"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
