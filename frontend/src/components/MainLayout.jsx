import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const MainLayout = () => {
    const location = useLocation();
    return (
        <div className="d-flex flex-column min-vh-100">
            <LoginModal />
            <Navbar />
            <main className="flex-grow-1">
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
