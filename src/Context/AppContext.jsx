'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';

const AppContext = createContext();

// Helper function to get base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
};

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export function AppContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { isSignedIn, user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch cart when user signs in
  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isSignedIn]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from:', `${getBaseUrl()}/api/clerk/product`);
      const res = await axiosInstance.get('/api/clerk/product');
      
      if (!res.data?.products) {
        throw new Error('No products found in response');
      }
      
      console.log('Products fetched:', res.data.products);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      console.log('Fetching cart...');
      const response = await axiosInstance.get('/api/clerk/cart');
      
      if (!response.data?.cart) {
        throw new Error('Invalid cart data received');
      }
      
      console.log('Cart fetched:', response.data.cart);
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to cart');
      return { success: false, message: 'Not signed in' };
    }

    try {
      setLoading(true);
      console.log('Adding to cart:', productId);
      const response = await axiosInstance.post('/api/clerk/cart', { 
        productId,
        quantity: 1
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to add to cart');
      }
      
      console.log('Cart updated:', response.data.cart);
      setCart(response.data.cart);
      toast.success('Added to cart!');
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isSignedIn) return;

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/api/clerk/cart/${productId}`);
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success('Removed from cart!');
      } else {
        throw new Error(response.data.message || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isSignedIn || quantity < 1) return;

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/api/clerk/cart/${productId}`, { quantity });
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success('Cart updated!');
      } else {
        throw new Error(response.data.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    products,
    addToCart,
    removeFromCart,
    updateQuantity,
    isSignedIn,
    user,
    fetchCart,
    fetchProducts, // Adding fetchProducts for manual refresh
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
