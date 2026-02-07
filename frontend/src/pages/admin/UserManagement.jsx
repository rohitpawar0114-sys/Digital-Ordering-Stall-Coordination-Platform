import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-5">Manage <span className="text-orange">Users</span></h1>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0">Name</th>
                                <th className="py-3 border-0">Email</th>
                                <th className="py-3 border-0">Role</th>
                                <th className="py-3 border-0">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-4 fw-bold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${user.role === 'ADMIN' ? 'bg-danger' : user.role === 'OWNER' ? 'bg-info' : 'bg-primary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUserList;
