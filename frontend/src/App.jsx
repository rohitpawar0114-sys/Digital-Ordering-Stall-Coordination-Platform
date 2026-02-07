import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Outlets from './pages/customer/Outlets';
import TrackOrder from './pages/customer/TrackOrder';

// Customer Pages
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import MenuManager from './pages/vendor/MenuManager';
import Orders from './pages/vendor/Orders';
import Payments from './pages/vendor/Payments';
import VendorSettings from './pages/vendor/Settings';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import OutletsList from './pages/admin/Outlets';
import OutletDetails from './pages/admin/OutletDetails';
import Monitor from './pages/admin/Monitor';
import PendingVendors from './pages/admin/PendingVendors';
import Subscribers from './pages/admin/Subscribers';

import VendorLayout from './components/VendorLayout';
import AdminLayout from './components/AdminLayout';
import MainLayout from './components/MainLayout';

import { CartProvider } from './context/CartContext';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        {/* Admin Login - Separated from layouts */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Admin Panel Layout */}
                        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/pending-vendors" element={<PendingVendors />} />
                                <Route path="/admin/users" element={<Users />} />
                                <Route path="/admin/outlets" element={<OutletsList />} />
                                <Route path="/admin/outlets/:id" element={<OutletDetails />} />
                                <Route path="/admin/monitor" element={<Monitor />} />
                                <Route path="/admin/subscribers" element={<Subscribers />} />
                            </Route>
                        </Route>

                        {/* Vendor Portal Layout */}
                        <Route element={<ProtectedRoute allowedRoles={['OUTLET_OWNER']} />}>
                            <Route element={<VendorLayout />}>
                                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                                <Route path="/vendor/menu" element={<MenuManager />} />
                                <Route path="/vendor/orders" element={<Orders />} />
                                <Route path="/vendor/payments" element={<Payments />} />
                                <Route path="/vendor/settings" element={<VendorSettings />} />
                            </Route>
                        </Route>

                        {/* Main Platform Layout (Public & Customer) */}
                        <Route element={<MainLayout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/outlets" element={<Outlets />} />
                            <Route path="/track-order" element={<TrackOrder />} />
                            {/* Semi-Protected Routes (Handled internally) */}
                            <Route path="/menu/:outletId" element={<Menu />} />
                            <Route path="/cart" element={<Cart />} />

                            {/* Customer Protected Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/my-orders" element={<MyOrders />} />
                            </Route>
                            {/* Catch-all - Redirect unknown routes to Home */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}



export default App;
