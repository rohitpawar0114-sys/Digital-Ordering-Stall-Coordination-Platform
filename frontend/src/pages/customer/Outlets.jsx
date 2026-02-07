import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import { useAuth } from '../../auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Outlets = () => {
    const { user, openLoginModal } = useAuth();
    const navigate = useNavigate();
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const data = await customerService.getOutlets();
                setOutlets(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching outlets:', error);
                setError('Failed to load outlets. Please try again later.');
            } finally {
                setTimeout(() => setLoading(false), 800); // Smooth transition
            }
        };
        fetchOutlets();
    }, []);

    const filteredOutlets = outlets.filter(outlet =>
        (outlet.outletName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (outlet.cuisineType || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error && !user) {
        return (
            <div className="bg-light min-vh-100 py-5 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="bi bi-shield-lock display-1 text-orange mb-4 d-block"></i>
                    <h3 className="fw-bold">Login Required</h3>
                    <p className="text-muted mb-4 px-3">You can't order food without login. <br />Please login to view available outlets and place your order.</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <button onClick={() => navigate('/login')} className="btn btn-orange px-5 py-2 rounded-3 fw-bold">Login</button>
                        <button onClick={() => navigate('/register')} className="btn btn-outline-orange px-5 py-2 rounded-3 fw-bold">Register</button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return (
        <div className="bg-light min-vh-100">
            <div className="container py-5 text-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-light shadow-premium rounded-4 p-5 border-0">
                    <i className="bi bi-shop-window fs-1 d-block mb-3 text-orange opacity-50"></i>
                    <h3 className="fw-bold">No Outlets Available</h3>
                    <p className="text-muted mb-4">We're currently updating our listings. Please check back in a moment.</p>
                    <button className="btn btn-orange rounded-3 px-5 py-2" onClick={() => window.location.reload()}>
                        <i className="bi bi-arrow-clockwise me-2"></i> Refresh
                    </button>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="bg-light min-vh-100">
            {/* Hero Section */}
            <div className="bg-white border-bottom py-5 mb-5 shadow-sm overflow-hidden position-relative">
                <div className="container py-4 position-relative z-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="col-lg-7"
                    >
                        <span className="badge-premium bg-orange-light text-orange mb-3 d-inline-block">Discover & Crave</span>
                        <h1 className="display-4 fw-bold mb-3 tracking-tight">Find Your Favorite <br /><span className="text-orange">Food Stalls</span></h1>
                        <p className="lead text-muted mb-4">Discover the best food stalls across your campus and enjoy freshly prepared meals ready for quick pickup.</p>

                        <div className="glass-card p-2 p-md-3 shadow-premium d-flex gap-2">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <i className="bi bi-search fs-5 text-orange"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent fs-5"
                                    placeholder="Search by name or cuisine..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Decorative Elements */}
                <div className="position-absolute end-0 top-0 h-100 w-50 d-none d-lg-block"
                    style={{
                        background: 'radial-gradient(circle at center, #FFF4EB 0%, transparent 70%)',
                        opacity: 0.6
                    }}
                ></div>
            </div>

            <div className="container pb-5">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Popular Outlets</h3>
                    <div className="ms-auto">
                        <span className="text-muted small fw-semibold">{filteredOutlets.length} Results Found</span>
                    </div>
                </div>

                <div className="row g-4">
                    <AnimatePresence>
                        {loading ? (
                            // Loading Skeletons
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="col-md-6 col-lg-4 col-xl-3">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="bg-light-subtle skeleton" style={{ height: '200px' }}></div>
                                        <div className="card-body p-4">
                                            <div className="skeleton mb-3" style={{ height: '24px', width: '70%', borderRadius: '4px' }}></div>
                                            <div className="skeleton mb-4" style={{ height: '16px', width: '90%', borderRadius: '4px' }}></div>
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <div className="skeleton" style={{ height: '20px', width: '30%', borderRadius: '4px' }}></div>
                                                <div className="skeleton" style={{ height: '36px', width: '40%', borderRadius: '20px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : filteredOutlets.length > 0 ? (
                            filteredOutlets.map((outlet, index) => (
                                <motion.div
                                    key={outlet.outletId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="col-md-6 col-lg-4 col-xl-3"
                                >
                                    <div className="card h-100 border-0 shadow-premium rounded-4 overflow-hidden hover-lift transition-all">
                                        <div className="position-relative">
                                            {outlet.imageUrl ? (
                                                <img src={outlet.imageUrl} className="card-img-top" alt={outlet.outletName} style={{ height: '200px', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                    <i className="bi bi-shop fs-1 text-muted opacity-25"></i>
                                                </div>
                                            )}
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <span className="badge-premium bg-white shadow-sm text-success">
                                                    <i className="bi bi-circle-fill me-1 small"></i> Open
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column text-start">
                                            <div className="mb-2">
                                                <span className="badge-premium bg-orange-light text-orange small py-1">{outlet.cuisineType || 'Universal Foods'}</span>
                                            </div>
                                            <h5 className="card-title fw-bold mb-2 h4 text-start">{outlet.outletName}</h5>
                                            <p className="card-text text-muted small mb-4 line-clamp-2" style={{ height: '40px' }}>
                                                {outlet.description || 'Serving authentic flavors and delicious meals prepared with fresh ingredients daily.'}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light">
                                                <div className="d-flex align-items-center text-muted small fw-bold">
                                                    <i className="bi bi-clock me-1 text-orange"></i> 25-30 min
                                                </div>
                                                <Link
                                                    to={`/menu/${outlet.outletId}`}
                                                    className="btn btn-orange btn-sm py-2 px-3 rounded-3 shadow-none fw-bold"
                                                >
                                                    View Menu <i className="bi bi-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-12 text-center py-5"
                            >
                                <div className="bg-white shadow-premium rounded-4 p-5 d-inline-block">
                                    <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                                    <h3 className="fw-bold">No Matches Found</h3>
                                    <p className="text-muted mb-0">Try adjusting your keywords or search for something else.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .skeleton {
                    background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Outlets;
