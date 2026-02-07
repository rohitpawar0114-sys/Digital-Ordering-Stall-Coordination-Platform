import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { user, openLoginModal } = useAuth();
    const { cart, loading, fetchCart } = useCart();
    const [localItems, setLocalItems] = useState([]);
    const [foodIdMap, setFoodIdMap] = useState({});
    const [processingId, setProcessingId] = useState(null);
    const navigate = useNavigate();

    // Handle Login Check
    // Handle Login Check & Initial Fetch
    useEffect(() => {
        if (!user) {
            openLoginModal();
        } else {
            fetchCart();
        }
    }, [user, openLoginModal]);

    // Sync Cart to Local State
    useEffect(() => {
        if (cart?.items) {
            setLocalItems(cart.items);
        }
    }, [cart]);

    // Fetch Menu to Map Food Names -> IDs (Frontend Workaround)
    useEffect(() => {
        const fetchFoodIds = async () => {
            if (cart?.outletId && user) { // Only fetch if user logged in
                try {
                    const menu = await customerService.getMenu(cart.outletId);
                    const map = {};
                    menu.forEach(item => {
                        map[item.foodName] = item.foodId;
                    });
                    setFoodIdMap(map);
                } catch (err) {
                    console.error("Failed to fetch menu for food IDs", err);
                }
            }
        };
        fetchFoodIds();
    }, [cart?.outletId, user]);

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const handleQuantityUpdate = async (item, delta) => {
        if (processingId) return; // Prevent double clicks

        // Check if removing
        if (delta < 0 && item.quantity === 1) {
            removeItem(item.cartItemId);
            return;
        }

        const foodId = foodIdMap[item.foodName];
        if (!foodId) {
            console.error("Food ID not found for", item.foodName);
            return; // Cannot proceed without ID
        }

        setProcessingId(item.cartItemId);

        // Optimistic Update
        const oldItems = [...localItems];
        const newItems = localItems.map(i => {
            if (i.cartItemId === item.cartItemId) {
                const newQty = i.quantity + delta;
                const unitPrice = i.totalPrice / i.quantity;
                return { ...i, quantity: newQty, totalPrice: unitPrice * newQty };
            }
            return i;
        });
        setLocalItems(newItems);

        try {
            await customerService.addToCart(foodId, delta);
            // Optionally sync with backend strictly
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            // Revert on failure
            setLocalItems(oldItems);
        } finally {
            setProcessingId(null);
        }
    };

    const removeItem = async (itemId) => {
        setProcessingId(itemId);
        try {
            await customerService.removeCartItem(itemId);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (!user) {
        return (
            <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <i className="bi bi-shield-lock display-1 text-muted mb-4"></i>
                <h3 className="fw-bold">Login Required</h3>
                <p className="text-muted mb-4">Please login to continue placing your order.</p>
                <div className="d-flex gap-3">
                    <button onClick={() => navigate('/login')} className="btn btn-orange px-5 py-2 rounded-3 fw-bold">Login</button>
                    <button onClick={() => navigate('/register')} className="btn btn-outline-orange px-5 py-2 rounded-3 fw-bold">Register</button>
                </div>
            </div>
        );
    }

    if (loading && !localItems.length) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-orange" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    const totalAmount = calculateTotal(localItems);

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container mt-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 text-start"
                >
                    <h1 className="display-5 fw-bold mb-2">Shopping <span className="text-orange">Cart</span></h1>
                    <p className="text-muted">You have {localItems.length} items in your tray</p>
                </motion.div>

                {localItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-5 bg-white shadow-premium rounded-4"
                    >
                        <motion.div
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="mb-4 d-inline-block"
                        >
                            <i className="bi bi-cart-x display-1 text-orange opacity-25"></i>
                        </motion.div>
                        <h3 className="fw-bold">Hungry? Your cart is empty</h3>
                        <p className="text-muted mb-4 px-3">It looks like you haven't added anything to your cart yet. <br />Browse our top outlets to find your next meal!</p>
                        <Link to="/outlets" className="btn btn-orange px-5 py-3 rounded-3 fw-bold hover-lift">
                            <i className="bi bi-shop me-2"></i> Explore Outlets
                        </Link>
                    </motion.div>
                ) : (
                    <div className="row g-4">
                        {/* Cart Items List */}
                        <div className="col-lg-8">
                            <div className="d-flex flex-column gap-3">
                                <AnimatePresence mode="popLayout">
                                    {localItems.map((item, index) => (
                                        <motion.div
                                            key={item.cartItemId}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="card border-0 shadow-premium rounded-4 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="row align-items-center">
                                                    <div className="col-auto">
                                                        <div className="bg-orange-light rounded-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '100px', height: '100px' }}>
                                                            <i className="bi bi-egg-fried fs-1 text-orange opacity-50"></i>
                                                        </div>
                                                    </div>
                                                    <div className="col text-start ps-md-4 mt-3 mt-md-0">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h4 className="fw-bold mb-1">{item.foodName}</h4>
                                                                <span className="badge-premium bg-light text-muted small mb-3 d-inline-block">Standard Portion</span>
                                                            </div>
                                                            <button
                                                                className="btn btn-light-danger rounded-circle p-2 hover-lift"
                                                                onClick={() => removeItem(item.cartItemId)}
                                                                disabled={processingId === item.cartItemId}
                                                                title="Remove item"
                                                            >
                                                                {processingId === item.cartItemId && item.quantity === 1 ? (
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                ) : <i className="bi bi-trash3-fill fs-5"></i>}
                                                            </button>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-end mt-2">

                                                            {/* Quantity Controls */}
                                                            <div className="d-flex align-items-center bg-light rounded-pill p-1 border">
                                                                <button
                                                                    className="btn btn-sm btn-light rounded-circle shadow-none p-2"
                                                                    onClick={() => handleQuantityUpdate(item, -1)}
                                                                    disabled={processingId === item.cartItemId || item.quantity <= 1}
                                                                    style={{ width: '32px', height: '32px' }}
                                                                >
                                                                    <i className="bi bi-dash fw-bold"></i>
                                                                </button>

                                                                <span className="fw-bold mx-3 fs-5" style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>

                                                                <button
                                                                    className="btn btn-sm btn-orange rounded-circle shadow-none p-2"
                                                                    onClick={() => handleQuantityUpdate(item, 1)}
                                                                    disabled={processingId === item.cartItemId}
                                                                    style={{ width: '32px', height: '32px' }}
                                                                >
                                                                    <i className="bi bi-plus text-white fw-bold"></i>
                                                                </button>
                                                            </div>

                                                            <div className="text-end">
                                                                <span className="text-muted small d-block mb-1">Item Total</span>
                                                                <motion.span
                                                                    key={item.totalPrice}
                                                                    initial={{ scale: 1.2, color: '#f97316' }}
                                                                    animate={{ scale: 1, color: '#000' }}
                                                                    className="price-tag fs-5"
                                                                >
                                                                    ₹{item.totalPrice}
                                                                </motion.span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Summary Column */}
                        <div className="col-lg-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="sticky-top"
                                style={{ top: '100px' }}
                            >
                                <div className="card border-0 shadow-premium rounded-4 p-4 overflow-hidden">
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <i className="bi bi-receipt display-4 text-orange"></i>
                                    </div>
                                    <h3 className="fw-bold mb-4 text-start">Order Summary</h3>

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="text-muted">Items Subtotal</span>
                                        <motion.span
                                            key={totalAmount}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="fw-bold"
                                        >
                                            ₹{totalAmount}
                                        </motion.span>
                                    </div>

                                    <hr className="opacity-10 mb-4" />
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="fw-bold fs-4">Total Amount</span>
                                        <motion.span
                                            key={`total-${totalAmount}`}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="fw-bold fs-3 text-orange"
                                        >
                                            ₹{totalAmount}
                                        </motion.span>
                                    </div>

                                    <button
                                        className="btn btn-orange w-100 py-3 rounded-3 fs-5 fw-bold hover-lift shadow-sm mb-3"
                                        onClick={() => navigate('/checkout')}
                                    >
                                        Checkout Securely <i className="bi bi-shield-check ms-1"></i>
                                    </button>

                                    <div className="text-center">
                                        <Link to="/outlets" className="text-muted small text-decoration-none fw-bold hover-lift d-inline-block">
                                            <i className="bi bi-arrow-left me-1"></i> Add more items
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-white shadow-premium rounded-4 d-flex align-items-center gap-3">
                                    <div className="bg-success-light p-2 rounded-3">
                                        <i className="bi bi-patch-check-fill text-success fs-4"></i>
                                    </div>
                                    <div className="text-start">
                                        <h6 className="fw-bold mb-0">Safe & Secure Payment</h6>
                                        <p className="text-muted small mb-0">100% Payment Protection</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
