import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
    return (
        <div className="d-flex bg-light min-vh-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto">
                <AdminNavbar />
                <main className="flex-grow-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
