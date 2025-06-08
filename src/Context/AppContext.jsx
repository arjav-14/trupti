'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';

const AppContext = createContext();

const axiosInstance = axios.create({
  baseURL: '/api',
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
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();

  // Initialize data on mount and auth changes
  useEffect(() => {
    fetchProducts();
  }, []);

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
      const response = await axiosInstance.get('/clerk/product');
      
      if (!response.data?.products) {
        throw new Error('No products found');
      }
      
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get('/clerk/cart');
      
      if (response.data?.success) {
        const formattedCart = response.data.cart.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          variant: {
            weight: {
              value: item.variant.weight.value,
              unit: item.variant.weight.unit || 'g'
            },
            price: item.variant.price
          },
          totalPrice: item.variant.price * item.quantity
        }));
        setCart(formattedCart);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, variantWeight) => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to cart');
      return { success: false, message: 'Not signed in' };
    }

    try {
      setLoading(true);
      const product = products.find(p => p._id === productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      const selectedVariant = product.variants.find(
        v => v.weight.value === Number(variantWeight)
      );

      if (!selectedVariant) {
        throw new Error('Invalid variant selected');
      }

      const payload = {
        productId,
        variant: {
          weight: selectedVariant.weight,
          price: selectedVariant.price
        },
        quantity: 1
      };

      const response = await axiosInstance.post('/clerk/cart', payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to add to cart');
      }

      await fetchCart(); // Refresh cart after adding
      // toast.success('Added to cart!');
      return { success: true };

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, variantWeight, quantity) => {
    if (!isSignedIn || quantity < 1) return;

    try {
      setLoading(true);
      
      // Log request data
      console.log('Update quantity request:', { productId, variantWeight, quantity });
      
      const response = await axiosInstance.put(`/clerk/cart/${productId}`, {
        variantWeight,
        quantity
      });

      console.log('Cart update response:', response.data); // Add this log

      if (response.data?.success) {
        // Add null checks and validation
        const formattedCart = response.data.cart.map(item => {
          if (!item?.variant?.weight) {
            console.error('Invalid cart item structure:', item);
            return null;
          }

          return {
            productId: item.productId,
            name: item.name || 'Unknown Product',
            image: item.image || '/placeholder.jpg',
            quantity: item.quantity || 1,
            variant: {
              weight: {
                value: item.variant.weight.value || 0,
                unit: item.variant.weight.unit || 'g'
              },
              price: item.variant.price || 0
            },
            totalPrice: (item.variant.price || 0) * (item.quantity || 1)
          };
        }).filter(Boolean); // Remove any null items

        setCart(formattedCart);
        toast.success('Cart updated');
      } else {
        throw new Error(response.data?.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, variantWeight) => {
    if (!isSignedIn) return;

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/clerk/cart/${productId}`, {
        data: { variantWeight }
      });

      if (response.data?.success) {
        await fetchCart(); // Refresh cart after removal
        toast.success('Item removed from cart');
      } else {
        throw new Error(response.data?.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const calculateCartTotal = (cartItems) => {
    return cartItems.reduce((total, item) => {
      const itemTotal = (item.variant?.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  };

  const value = useMemo(() => ({
    cart,
    loading,
    products,
    addToCart,
    removeFromCart,
    updateQuantity,
    isSignedIn,
    user,
    fetchCart,
    fetchProducts,
    cartTotal: calculateCartTotal(cart)
  }), [cart, loading, products, isSignedIn, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}