import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const VendorLayout = () => {
    return (
        <div className="d-flex min-vh-100 bg-light">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                <Navbar />
                <main className="p-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
