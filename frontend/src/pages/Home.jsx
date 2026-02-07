import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section text-center text-md-start">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2 mb-4">Smart Ordering System</span>
                            <h1 className="display-3 fw-bold mb-4">
                                Online Ordering & <br />
                                Stall Coordination Platform
                            </h1>
                            <p className="lead mb-5 opacity-75">
                                Browse outlets, add items to cart, place order, and track using token in real-time.
                            </p>
                            <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">
                                <Link to="/outlets" className="btn btn-light btn-orange text-orange px-5 py-3 fs-5">Order Now</Link>
                                <Link to="/outlets" className="btn btn-light btn-orange text-orange px-5 py-3 fs-5 ms-3">Explore Outlets</Link>
                            </div>
                            <div className="row mt-5 text-center text-md-start">
                                <div className="col-4">
                                    <h3 className="fw-bold mb-0">50+</h3>
                                    <small className="opacity-75">Outlets</small>
                                </div>
                                <div className="col-4 border-start border-end border-white border-opacity-25">
                                    <h3 className="fw-bold mb-0">1000+</h3>
                                    <small className="opacity-75">Orders</small>
                                </div>
                                <div className="col-4">
                                    <h3 className="fw-bold mb-0">4.8 <i className="bi bi-star-fill text-warning"></i></h3>
                                    <small className="opacity-75">Rating</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="hero-card position-relative">
                                <img
                                    src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80"
                                    alt="Burger"
                                    className="img-fluid w-100"
                                />
                                <div className="position-absolute bottom-0 end-0 m-4">
                                    <div className="badge-live d-flex align-items-center gap-2">
                                        <span>Live Orders</span>
                                        <span className="fs-5">247</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Statistics Section can be added here */}
            <section className="py-5 bg-white border-top border-light">
                <div className="container py-5">
                    <div className="text-center mb-5 pb-3">
                        <span className="text-orange fw-bold x-small text-uppercase tracking-widest d-block mb-3">Simple Workflow</span>
                        <h2 className="fw-bold display-6 mb-0" style={{ letterSpacing: '-1.5px' }}>Seamless Ordering in 3 Steps</h2>
                    </div>
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 hover-lift h-100">
                                <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-shop fs-1"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Choose Outlet</h4>
                                <p className="text-muted small px-lg-4 mb-0">Browse from a curated selection of campus food stalls and explore their unique menus.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 hover-lift h-100">
                                <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-cart-plus fs-1"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Add to Cart</h4>
                                <p className="text-muted small px-lg-4 mb-0">Customize your favorite meals and add them to your cart with a single tap.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 hover-lift h-100">
                                <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-qr-code-scan fs-1"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Easy Payment</h4>
                                <p className="text-muted small px-lg-4 mb-0">Scan the outlet's UPI QR code to complete your order securely and track your token.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
