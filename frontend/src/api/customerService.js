import api from './axios';

const customerService = {
    // Outlets
    getOutlets: async () => {
        try {
            const response = await api.get('/api/outlets');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error in getOutlets:', error);
            throw error;
        }
    },

    getOutletById: async (id) => {
        try {
            const outlets = await api.get('/api/outlets');
            const data = Array.isArray(outlets.data) ? outlets.data : [];
            return data.find(o => (o.outletId || o.id) === parseInt(id));
        } catch (error) {
            console.error('Error in getOutletById:', error);
            return null;
        }
    },

    // Menu
    getMenu: async (outletId) => {
        try {
            const response = await api.get(`/api/outlets/${outletId}/menu`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error in getMenu:', error);
            throw error;
        }
    },

    // Cart
    getCart: async () => {
        const response = await api.get('/api/cart');
        return response.data;
    },

    addToCart: async (foodId, quantity = 1) => {
        // Backend expects foodItemId in CartItemRequest DTO
        const response = await api.post('/api/cart/add', { foodItemId: foodId, quantity });
        return response.data;
    },

    removeCartItem: async (cartItemId) => {
        const response = await api.delete(`/api/cart/item/${cartItemId}`);
        return response.data;
    },

    // Order
    placeOrder: async (paymentMethod = 'UPI') => {
        const response = await api.post('/api/order/place', { paymentMethod });
        return response.data;
    },

    trackOrder: async (token) => {
        const response = await api.get(`/api/order/track/${token}`);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/api/customer/orders');
        return response.data;
    }
};


export default customerService;
