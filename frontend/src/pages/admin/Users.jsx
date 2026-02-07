import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            try {
                await adminService.deleteUser(id);
                setUsers(users.filter(u => u.userId !== id));
            } catch (error) {
                alert('Failed to delete user: ' + (error.response?.data?.message || 'API endpoint not supported by backend yet.'));
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-orange" role="status"></div>
        </div>
    );

    return (
        <div className="p-4 fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-1px' }}>User Management</h2>
                    <p className="text-muted small fw-medium">Direct access to platform users and security roles.</p>
                </div>
                <div className="input-group shadow-sm rounded-pill overflow-hidden border" style={{ maxWidth: '350px' }}>
                    <span className="input-group-text bg-white border-0 ps-3">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control border-0 py-2 ms-n1"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover table-modern align-middle mb-0">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 border-0">User Info</th>
                                <th className="py-3 border-0 text-center">Role</th>
                                <th className="py-3 border-0">Joined</th>
                                <th className="py-3 border-0 text-center">Status</th>
                                <th className="py-3 border-0 text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.userId}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-orange bg-opacity-10 text-orange rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm"
                                                style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}>
                                                {user.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark mb-0" style={{ fontSize: '0.95rem' }}>{user.fullName}</div>
                                                <div className="text-muted x-small">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge px-3 py-2 ${user.role === 'ADMIN' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' :
                                                user.role === 'OUTLET_OWNER' ? 'bg-info bg-opacity-10 text-info border border-info border-opacity-25' :
                                                    'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                                            }`} style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-muted small">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="text-center">
                                        <span className="badge bg-success-subtle text-success border border-success border-opacity-10 rounded-pill x-small fw-bold">
                                            <i className="bi bi-check2-circle me-1"></i> Active
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-3 p-2 d-inline-flex align-items-center justify-content-center shadow-sm"
                                            onClick={() => handleDeleteUser(user.userId)}
                                            style={{ width: '32px', height: '32px' }}
                                            title="Remove Access"
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-people fs-1 text-muted mb-3 d-block opacity-25"></i>
                        <h5 className="text-muted">No users found</h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
