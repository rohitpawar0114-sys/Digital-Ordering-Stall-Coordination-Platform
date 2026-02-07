import api from './axios';

const vendorService = {
    // Outlet Details
    getOutlet: async () => {
        const response = await api.get('/api/owner/outlets');
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
            return null;
        }
        return Array.isArray(response.data) ? response.data[0] : response.data;
    },

    createOutlet: async (outletData) => {
        const response = await api.post('/api/owner/outlets', outletData);
        return response.data;
    },

    updateOutlet: async (id, outletData) => {
        const response = await api.put(`/api/owner/outlets/${id}`, outletData);
        return response.data;
    },

    // Categories
    getCategories: async (outletId) => {
        const response = await api.get('/api/owner/categories', {
            params: { outletId }
        });
        return response.data;
    },

    addCategory: async (categoryName, outletId) => {
        const response = await api.post('/api/owner/categories', { outletId, name: categoryName });
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/api/owner/categories/${id}`);
        return response.data;
    },

    // Food Items
    getFoods: async (outletId) => {
        const response = await api.get('/api/owner/foods', {
            params: { outletId }
        });
        return response.data;
    },

    addFoodItem: async (foodData) => {
        const response = await api.post('/api/owner/foods', foodData);
        return response.data;
    },

    updateFoodItem: async (id, foodData) => {
        const response = await api.put(`/api/owner/foods/${id}`, foodData);
        return response.data;
    },

    deleteFoodItem: async (id) => {
        const response = await api.delete(`/api/owner/foods/${id}`);
        return response.data;
    },

    // Orders
    getOrders: async (outletId) => {
        const response = await api.get('/api/owner/orders', {
            params: { outletId }
        });
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await api.put(`/api/owner/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Payments (UPI QR)
    getUpiQr: async (outletId) => {
        const response = await api.get('/api/owner/upi-qr', {
            params: { outletId }
        });
        return response.data;
    },

    uploadUpiQr: async (formData) => {
        const response = await api.post('/api/owner/upi-qr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default vendorService;
