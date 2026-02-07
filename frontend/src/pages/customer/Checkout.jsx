import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Checkout = () => {
    const { fetchCart } = useCart();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderToken, setOrderToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await customerService.getCart();
                setCart(data);
                if (!data || !data.items || data.items.length === 0) {
                    navigate('/cart');
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, [navigate]);

    const handlePlaceOrder = async () => {
        if (!paymentConfirmed) return;

        setPlacingOrder(true);
        try {
            const data = await customerService.placeOrder('UPI');
            setOrderToken(data.tokenNumber);
            setOrderSuccess(true);
            await fetchCart(); // Refresh global cart state (which is now empty)
        } catch (error) {
            console.error('Error placing order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
            alert(errorMessage);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-orange" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    const totalAmount = cart?.totalAmount || 0;

    if (orderSuccess) {
        return (
            <div className="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center bg-white shadow-premium rounded-4 p-5 col-md-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                        className="mb-4 text-success display-1"
                    >
                        <i className="bi bi-check-circle-fill"></i>
                    </motion.div>
                    <h1 className="fw-bold mb-3">Order Placed Successfully!</h1>
                    <p className="text-muted mb-4 lead">Thank you for your order. Your food is being prepared.</p>

                    <div className="bg-orange-light p-4 rounded-4 mb-5 border-0">
                        <span className="small text-orange fw-bold text-uppercase d-block mb-1">Your Token Number</span>
                        <h2 className="display-4 fw-bold text-orange mb-0">#{orderToken}</h2>
                    </div>

                    <div className="d-grid gap-3">
                        <button className="btn btn-orange py-3 rounded-3 fw-bold fs-5 shadow-sm" onClick={() => navigate('/my-orders')}>
                            Track Order <i className="bi bi-geo-alt ms-2"></i>
                        </button>
                        <button className="btn btn-light-orange py-3 rounded-3 fw-bold" onClick={() => navigate('/')}>
                            Return to Home
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-5"
                        >
                            <h1 className="display-5 fw-bold mb-3">Secure <span className="text-orange">Checkout</span></h1>
                            <div className="d-flex align-items-center justify-content-center gap-4 text-muted small fw-bold">
                                <span className="text-orange"><i className="bi bi-check-circle-fill me-2"></i>Cart</span>
                                <div style={{ height: '2px', width: '30px', background: 'var(--primary-orange)' }}></div>
                                <span className="text-orange"><i className="bi bi-2-circle-fill me-2"></i>Payment</span>
                                <div style={{ height: '2px', width: '30px', background: '#ccc' }}></div>
                                <span className=""><i className="bi bi-3-circle me-2"></i>Success</span>
                            </div>
                        </motion.div>

                        <div className="row g-4">
                            {/* Left Side: Payment */}
                            <div className="col-md-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="card border-0 shadow-premium rounded-4 overflow-hidden h-100"
                                >
                                    <div className="bg-orange p-4 text-white">
                                        <h4 className="fw-bold mb-0">UPI Payment Gateway</h4>
                                        <p className="small opacity-75 mb-0">Powered by SecurePay</p>
                                    </div>
                                    <div className="card-body p-5 text-center">
                                        <div className="p-4 bg-light rounded-4 mb-4 d-inline-block shadow-inner">
                                            <p className="small fw-bold text-muted mb-3 text-uppercase tracking-wider">Scan to Pay ₹{totalAmount}</p>
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=eatorbit@upi&pn=EatOrbit&am=${totalAmount}`}
                                                alt="UPI QR Code"
                                                className="img-fluid rounded-3 shadow-premium"
                                                style={{ maxWidth: '180px' }}
                                            />
                                        </div>

                                        <div className="mt-4 p-3 border rounded-4 bg-white text-start shadow-sm">
                                            <div className="form-check d-flex align-items-center">
                                                <input
                                                    className="form-check-input me-3"
                                                    type="checkbox"
                                                    id="confirmPayment"
                                                    checked={paymentConfirmed}
                                                    onChange={(e) => setPaymentConfirmed(e.target.checked)}
                                                    style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="confirmPayment" style={{ cursor: 'pointer' }}>
                                                    Payment Completed
                                                    <span className="small text-muted d-block fw-normal">I have successfully scanned and paid from my app.</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Side: Final Review */}
                            <div className="col-md-6 text-start">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="card border-0 shadow-premium rounded-4 h-100"
                                >
                                    <div className="card-body p-5 d-flex flex-column text-start">
                                        <h4 className="fw-bold mb-4">Order Review</h4>

                                        <div className="flex-grow-1 overflow-auto mb-4 no-scrollbar" style={{ maxHeight: '250px' }}>
                                            {cart.items?.map((item, idx) => (
                                                <div key={item.cartItemId} className="d-flex align-items-center mb-3">
                                                    <div className="bg-orange-light p-2 rounded-3 me-3">
                                                        <i className="bi bi-egg-fried text-orange"></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="fw-bold mb-0">{item.foodName}</h6>
                                                        <span className="text-muted small">Qty: {item.quantity}</span>
                                                    </div>
                                                    <span className="fw-bold">₹{item.totalPrice}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-light p-4 rounded-4 mb-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">Subtotal</span>
                                                <span className="fw-bold fs-5">₹{totalAmount}</span>
                                            </div>
                                            <hr className="opacity-10" />
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <span className="fw-bold fs-5">Amount Payable</span>
                                                <span className="fw-bold fs-4 text-orange">₹{totalAmount}</span>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn w-100 py-3 rounded-3 fs-5 fw-bold transition-all shadow-sm ${paymentConfirmed ? 'btn-orange hover-lift' : 'btn-secondary opacity-50'}`}
                                            onClick={handlePlaceOrder}
                                            disabled={placingOrder || !paymentConfirmed}
                                        >
                                            {placingOrder ? (
                                                <><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</>
                                            ) : (
                                                <><i className="bi bi-shield-lock-fill me-2"></i> Confirm Order</>
                                            )}
                                        </button>

                                        {!paymentConfirmed && (
                                            <div className="mt-3 text-center">
                                                <span className="text-danger small fw-bold">
                                                    <i className="bi bi-exclamation-circle-fill me-1"></i>
                                                    Please verify payment to proceed
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-inner {
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Checkout;
