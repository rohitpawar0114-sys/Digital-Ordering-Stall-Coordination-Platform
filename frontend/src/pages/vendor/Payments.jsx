import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import vendorService from '../../api/vendorService';

const Payments = () => {
    const [qrUrl, setQrUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [outlet, setOutlet] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const outletData = await vendorService.getOutlet();
                setOutlet(outletData);
                if (outletData) {
                    await fetchQr(outletData.outletId);
                }
            } catch (err) {
                console.error('Error initializing payments:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchQr = async (outletId) => {
        try {
            const data = await vendorService.getUpiQr(outletId);
            setQrUrl(data?.qrImageUrl);
        } catch (err) {
            console.error('Error fetching QR:', err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!outlet) {
            alert('⚠️ No outlet found! Please set up your outlet in Settings first.');
            return;
        }

        if (!window.confirm('❓ Replace current UPI QR code? This will be shown to customers immediately.')) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('qrImage', file);
            await vendorService.uploadUpiQr(formData);
            await fetchQr(outlet.outletId);
            alert('✅ Success! UPI QR updated.');
        } catch (err) {
            console.error('Upload error:', err);
            alert('❌ Failed to upload QR: ' + (err.response?.data?.message || 'Please ensure it is a valid image file and under 5MB.'));
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container-fluid py-4 px-4">
            <div className="mb-5">
                <h2 className="fw-bold mb-1">Payment Configuration</h2>
                <p className="text-muted mb-0">Set up your UPI QR code to accept payments directly from customers.</p>
            </div>

            {!outlet ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border-0 shadow-premium rounded-4 p-5 text-center bg-white"
                >
                    <div className="mb-4">
                        <div className="bg-orange bg-opacity-10 p-4 rounded-circle d-inline-block">
                            <i className="bi bi-shop fs-1 text-orange"></i>
                        </div>
                    </div>
                    <h3 className="fw-bold text-dark">Setup Required</h3>
                    <p className="text-muted mx-auto mb-4 lead" style={{ maxWidth: '500px' }}>
                        Please configure your outlet details before managing payments.
                    </p>
                    <a href="/vendor/settings" className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow-sm">
                        Go to Settings
                    </a>
                </motion.div>
            ) : (
                <div className="row g-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="col-lg-6"
                    >
                        <div className="card border-0 shadow-premium rounded-4 p-5 text-center h-100 position-relative overflow-hidden">
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-light opacity-50 z-0"></div>
                            <div className="position-relative z-1">
                                <h5 className="fw-bold mb-4 text-uppercase tracking-widest text-muted small">Customer Payment QR</h5>

                                <div className="bg-white rounded-4 d-flex align-items-center justify-content-center mx-auto mb-5 shadow-sm border p-3 position-relative group-hover"
                                    style={{ width: '300px', height: '300px' }}>
                                    {qrUrl ? (
                                        <img src={qrUrl} alt="UPI QR" className="img-fluid rounded-3" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    ) : (
                                        <div className="text-center p-4">
                                            <i className="bi bi-qr-code-scan display-1 text-muted opacity-25 d-block mb-3"></i>
                                            <span className="text-muted small fw-bold">NO QR CODE ACTIVE</span>
                                        </div>
                                    )}
                                    {/* Scan Me Overlay Effect */}
                                    {qrUrl && <div className="position-absolute top-0 start-0 w-100 h-100 border border-4 border-orange rounded-3 opacity-0 group-hover-opacity transition-all pointer-events-none"></div>}
                                </div>

                                <div className="mt-auto">
                                    <label className={`btn btn-orange rounded-pill px-5 py-3 fw-bold shadow-sm hover-scale transition-all w-100 ${uploading ? 'disabled' : ''}`} style={{ maxWidth: '350px' }}>
                                        {uploading ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : <i className="bi bi-cloud-arrow-up-fill me-2 fs-5"></i>}
                                        {qrUrl ? 'UPDATE QR CODE' : 'UPLOAD NEW QR'}
                                        <input type="file" className="d-none" accept="image/*" onChange={handleUpload} disabled={uploading} />
                                    </label>
                                    <p className="text-muted small mt-3 mb-0">Supported formats: JPG, PNG. Max 5MB.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="col-lg-6"
                    >
                        <div className="card border-0 shadow-premium rounded-4 p-5 h-100 bg-orange bg-opacity-10">
                            <h4 className="fw-bold mb-4 text-dark"><i className="bi bi-shield-check text-orange me-2"></i>Payment Information</h4>

                            <ul className="list-unstyled d-flex flex-column gap-4 mb-5">
                                <li className="d-flex align-items-start gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-orange">
                                        <i className="bi bi-phone-vibrate fw-bold"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Customer Checkout</h6>
                                        <p className="text-muted small mb-0">This QR code will be displayed prominently on the checkout page for customers to scan and pay.</p>
                                    </div>
                                </li>
                                <li className="d-flex align-items-start gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-orange">
                                        <i className="bi bi-wallet2 fw-bold"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Direct Settlement</h6>
                                        <p className="text-muted small mb-0">Payments go directly to your linked UPI bank account. The platform does not hold funds.</p>
                                    </div>
                                </li>
                                <li className="d-flex align-items-start gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-orange">
                                        <i className="bi bi-crop fw-bold"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Best Practices</h6>
                                        <p className="text-muted small mb-0">Use a high-quality image. Crop the image to show only the QR code for better scanning rates.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-auto p-4 bg-white rounded-4 border border-orange border-opacity-25 shadow-sm">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <small className="text-muted text-uppercase fw-bold tracking-wider d-block mb-1">Payment Status</small>
                                        <span className={`badge rounded-pill px-3 py-2 ${qrUrl ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                            {qrUrl ? '● ACTIVE' : '● INACTIVE'}
                                        </span>
                                    </div>
                                    <i className={`bi ${qrUrl ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger'} display-4 opacity-25`}></i>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Payments;
