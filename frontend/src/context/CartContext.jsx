import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user || user.role !== 'CUSTOMER') {
            setCart(null);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            if (error.response?.status === 404) {
                setCart({ items: [], totalAmount: 0 });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, fetchCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
