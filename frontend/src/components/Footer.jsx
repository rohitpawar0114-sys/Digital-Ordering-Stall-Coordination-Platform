import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Footer = () => {
    return (
        <footer className="footer-dark pt-5 pb-4 mt-auto">
            <div className="container px-4">
                <div className="row g-5 mb-5 text-start">
                    {/* Brand & Mission */}
                    <div className="col-lg-4">
                        <Link to="/" className="text-decoration-none d-inline-block mb-3">
                            <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-1.5px', fontSize: '1.75rem' }}>
                                EatOrbit<span className="text-orange">.</span>
                            </h3>
                        </Link>
                        <p className="footer-desc mb-4">
                            Redefining the campus food experience through smart coordination and seamless ordering. Your favorite stalls, just a click away.
                        </p>
                        <div className="d-flex gap-2">
                            <a href="#" className="social-icon-box"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-twitter-x"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="footer-heading">Platform</h6>
                        <ul className="list-unstyled footer-nav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/outlets">Explore Outlets</Link></li>
                            <li><Link to="/track-order">Track Order</Link></li>
                            <li><Link to="/cart">My Cart</Link></li>
                        </ul>
                    </div>

                    {/* Business/Admin */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="footer-heading">Join Us</h6>
                        <ul className="list-unstyled footer-nav">
                            <li><Link to="/login">Merchant Login</Link></li>
                            <li><Link to="/register">Join as Vendor</Link></li>
                            <li><Link to="/admin/login">Admin Console</Link></li>
                            <li><Link to="#">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-md-6 col-lg-4">
                        <div className="newsletter-box p-4 rounded-4">
                            <h6 className="footer-heading mb-2">STAY UPDATED</h6>
                            <p className="small text-muted mb-4">Subscribe to get the latest offers and outlet updates directly.</p>
                            <SubscriptionForm />
                        </div>
                    </div>
                </div>

                <hr className="footer-line mb-4" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="small footer-meta">
                        &copy; {new Date().getFullYear()} EatOrbit. Built for the future of food.
                    </div>
                    <div className="d-flex gap-4 footer-meta">
                        <Link to="#" className="text-decoration-none">Privacy</Link>
                        <Link to="#" className="text-decoration-none">Terms</Link>
                        <Link to="#" className="text-decoration-none">Cookies</Link>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-dark {
                    background-color: #0A0F1D;
                    color: #94A3B8;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .footer-desc {
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: #64748B;
                    max-width: 320px;
                }
                .footer-heading {
                    color: white;
                    font-weight: 700;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 1.5rem;
                }
                .footer-nav li { margin-bottom: 0.8rem; }
                .footer-nav a {
                    color: #64748B;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                }
                .footer-nav a:hover { color: var(--primary-orange); transform: translateX(4px); display: inline-block; }
                
                .social-icon-box {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                    color: #64748B;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .social-icon-box:hover {
                    background: var(--primary-orange);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(255, 122, 0, 0.2);
                    border-color: var(--primary-orange);
                }
                .newsletter-box {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .footer-line { border-color: rgba(255, 255, 255, 0.05); opacity: 1; }
                .footer-meta, .footer-meta a { font-size: 0.85rem; color: #475569; text-decoration: none; transition: color 0.2s; }
                .footer-meta a:hover { color: var(--primary-orange); }

                .newsletter-input-premium {
                    background: #151B2D none no-repeat !important; /* Aggregate fix for extension icons */
                    background-image: none !important; 
                    background-position: -9999px -9999px !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    height: 52px !important;
                    border-radius: 14px !important;
                    padding-right: 120px !important;
                    font-size: 0.95rem !important;
                }
                .newsletter-input-premium::placeholder { color: #475569; }
                .newsletter-input-premium:focus {
                    background-color: #1A2235 !important;
                    background-image: none !important;
                    border-color: var(--primary-orange) !important;
                    box-shadow: 0 0 0 4px rgba(255, 122, 0, 0.1) !important;
                }
            `}</style>
        </footer>
    );
};

const SubscriptionForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await api.post('/api/public/subscribe', { email });
            alert(response.data.message || 'Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="position-relative">
            <input
                type="email"
                className="form-control newsletter-input-premium shadow-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="off"
            />
            <button
                type="submit"
                className="btn btn-orange position-absolute top-50 end-0 translate-middle-y me-2 py-2 px-4 shadow-sm"
                style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', height: '38px' }}
                disabled={loading}
            >
                {loading ? '...' : 'Subscribe'}
            </button>
        </form>
    );
};

export default Footer;
