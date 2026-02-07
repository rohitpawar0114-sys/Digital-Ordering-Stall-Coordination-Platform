import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
    const { outletId } = useParams();
    const [menu, setMenu] = useState([]);
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const { user, openLoginModal } = useAuth();
    const { fetchCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [outletData, menuData] = await Promise.all([
                    customerService.getOutletById(outletId),
                    customerService.getMenu(outletId)
                ]);
                setOutlet(outletData);
                setMenu(menuData);
                setError(null);
            } catch (error) {
                console.error('Error fetching menu data:', error);
                setError('Failed to load menu. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenuData();
    }, [outletId]);

    const addToCart = async (foodItemId) => {
        if (!user) {
            openLoginModal();
            return;
        }
        setAddingToCart(foodItemId);
        try {
            await customerService.addToCart(foodItemId, 1);
            await fetchCart(); // Sync global state
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-orange mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                <h4 className="fw-bold text-muted">Loading Flavors...</h4>
            </div>
        </div>
    );

    if (error) return (
        <div className="container py-5 text-center">
            <div className="alert alert-danger shadow-premium rounded-4 p-5 border-0">
                <i className="bi bi-emoji-frown fs-1 text-danger mb-3 d-block"></i>
                <h3 className="fw-bold">Menu Unavailable</h3>
                <p className="text-muted mb-4">{error}</p>
                <button className="btn btn-orange rounded-3 px-5" onClick={() => navigate('/outlets')}>
                    Back to Outlets
                </button>
            </div>
        </div>
    );

    const categories = ['All', ...new Set(menu.map(item => item.categoryName || 'Main Menu'))];
    const filteredMenu = activeCategory === 'All'
        ? menu
        : menu.filter(item => (item.categoryName || 'Main Menu') === activeCategory);

    return (
        <div className="bg-light min-vh-100">
            {/* Outlet Hero */}
            {outlet && (
                <div className="position-relative overflow-hidden mb-5" style={{ height: '400px' }}>
                    <div className="position-absolute w-100 h-100">
                        {outlet.imageUrl ? (
                            <img src={outlet.imageUrl} alt={outlet.outletName} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className="w-100 h-100 bg-orange" style={{ opacity: 0.1 }}></div>
                        )}
                        <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>
                    </div>

                    <div className="container h-100 d-flex align-items-end pb-5 position-relative z-2">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-white col-lg-8 text-start"
                        >
                            <span className="badge-premium bg-orange text-white mb-3 d-inline-block shadow-sm">
                                <i className="bi bi-star-fill me-1"></i> Top Rated
                            </span>
                            <h1 className="display-3 fw-bold mb-2 tracking-tight">{outlet.outletName}</h1>
                            <p className="lead opacity-90 mb-4">{outlet.description || "Indulge in a world of authentic flavors, where every dish is a masterpiece crafted with the finest ingredients."}</p>
                            <div className="d-flex flex-wrap gap-4 small fw-bold text-uppercase tracking-wider opacity-75">
                                <span><i className="bi bi-geo-alt-fill text-orange me-2"></i>{outlet.cuisineType || 'Continental'}</span>
                                <span><i className="bi bi-clock-fill text-orange me-2"></i>{outlet.openingHours || '9 AM - 10 PM'}</span>
                                <span><i className="bi bi-hand-thumbs-up-fill text-orange me-2"></i>4.8 (2k+ Reviews)</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="container pb-5">
                {/* Category Navigation */}
                <div className="glass-card p-2 mb-5 d-flex gap-2 overflow-auto no-scrollbar scroll-row">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn rounded-3 px-4 py-2 border-0 fw-bold transition-all ${activeCategory === cat ? 'btn-orange text-white' : 'text-muted hover-lift'}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Food Grid */}
                <div className="row g-4 d-flex">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.length > 0 ? (
                            filteredMenu.map((item, index) => (
                                <motion.div
                                    key={item.foodId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="col-md-6 col-lg-4"
                                >
                                    <div className="card h-100 border-0 shadow-premium rounded-4 overflow-hidden d-flex flex-row p-3 hover-lift transition-all bg-white">
                                        <div className="position-relative" style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                                <img src={item.imageUrls[0]} className="rounded-3 w-100 h-100 shadow-sm" alt={item.foodName} style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div className="bg-orange-light rounded-3 w-100 h-100 d-flex align-items-center justify-content-center border-0">
                                                    <i className="bi bi-egg-fried fs-1 text-orange opacity-50"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ms-4 flex-grow-1 d-flex flex-column text-start">
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <h5 className="fw-bold mb-0 text-start">{item.foodName}</h5>
                                                    <span className="price-tag ms-2">₹{item.price}</span>
                                                </div>
                                                <p className="text-muted small mb-3 line-clamp-2">{item.description || "Delicious meal prepared with fresh ingredients and signature spices."}</p>
                                            </div>
                                            <button
                                                className={`btn btn-orange btn-sm rounded-3 py-2 fw-bold w-100 mt-auto ${addingToCart === item.foodId ? 'disabled' : ''}`}
                                                onClick={() => addToCart(item.foodId)}
                                            >
                                                {addingToCart === item.foodId ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    <><i className="bi bi-plus-lg me-1"></i> Add to Cart</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-12 py-5 text-center text-muted">
                                <i className="bi bi-journal-x display-1 opacity-25 d-block mb-3"></i>
                                <h4>No items found in this category</h4>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="position-fixed bottom-0 start-50 translate-middle-x mb-5 z-3"
                    >
                        <div className="glass-card shadow-premium px-4 py-3 border-orange text-orange fw-bold d-flex align-items-center gap-3">
                            <i className="bi bi-check-circle-fill fs-4"></i>
                            Added to your cart!
                            <button className="btn btn-orange btn-sm rounded-pill px-3 ms-2" onClick={() => navigate('/cart')}>View Cart</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-align: left;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .scroll-row {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    white-space: nowrap;
                    -webkit-overflow-scrolling: touch;
                }
            `}</style>
        </div>
    );
};

export default Menu;
