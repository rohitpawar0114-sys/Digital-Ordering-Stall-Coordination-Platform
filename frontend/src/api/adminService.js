import api from './axios';

const adminService = {
    // User Management
    getAllUsers: async () => {
        const response = await api.get('/api/admin/users');
        return response.data;
    },

    // Vendor Approval
    getPendingVendors: async () => {
        const response = await api.get('/api/admin/pending-vendors');
        return response.data;
    },

    approveVendor: async (vendorId) => {
        const response = await api.post(`/api/admin/vendors/${vendorId}/approve`);
        return response.data;
    },

    rejectVendor: async (vendorId) => {
        const response = await api.post(`/api/admin/vendors/${vendorId}/reject`);
        return response.data;
    },

    // Outlet Management
    getAllOutlets: async () => {
        const response = await api.get('/api/admin/outlets');
        return response.data;
    },

    createOutlet: async (outletData) => {
        const response = await api.post('/api/admin/outlets', outletData);
        return response.data;
    },

    updateOutlet: async (id, outletData) => {
        const response = await api.put(`/api/admin/outlets/${id}`, outletData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    },

    deleteOutlet: async (id) => {
        const response = await api.delete(`/api/admin/outlets/${id}`);
        return response.data;
    },

    getOutletById: async (id) => {
        const response = await api.get('/api/admin/outlets');
        return response.data.find(o => (o.outletId || o.id) === parseInt(id));
    },

    // Platform Monitoring
    getAllOrders: async () => {
        const response = await api.get('/api/admin/orders');
        return response.data;
    },

    getSubscribers: async () => {
        const response = await api.get('/api/admin/subscribers');
        return response.data;
    }
};

export default adminService;
