// // 'use client';
// // import { createContext, useContext, useEffect, useState } from "react";
// // import { useAuth, useUser } from "@clerk/nextjs";
// // import toast from "react-hot-toast";
// // import axios from "axios";

// // const AppContext = createContext();

// // export function AppContextProvider({ children }) {
// //   const { isSignedIn, user } = useUser();
// //   const [cart, setCart] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   // Fetch cart data when user signs in
// //   useEffect(() => {
// //     if (isSignedIn) {
// //       fetchCart();
// //     } else {
// //       setCart([]);
// //     }
// //   }, [isSignedIn]);

// //   const fetchCart = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get('/api/clerk/cart');
// //       setCart(response.data.cart);
// //     } catch (error) {
// //       toast.error('Failed to fetch cart');
// //       console.error('Error fetching cart:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addToCart = async (productId) => {
// //     if (!isSignedIn) {
// //       toast.error('Please sign in to add items to cart');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const response = await axios.post('/api/clerk/cart', { productId });
// //       setCart(response.data.cart);
// //       toast.success('Added to cart!');
// //     } catch (error) {
// //       toast.error('Failed to add item to cart');
// //       console.error('Error adding to cart:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const removeFromCart = async (productId) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.delete(`/api/clerk/cart/${productId}`);
// //       setCart(response.data.cart);
// //       toast.success('Removed from cart!');
// //     } catch (error) {
// //       toast.error('Failed to remove item from cart');
// //       console.error('Error removing from cart:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const updateQuantity = async (productId, quantity) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.put(`/api/clerk/cart/${productId}`, { quantity });
// //       setCart(response.data.cart);
// //       toast.success('Cart updated!');
// //     } catch (error) {
// //       toast.error('Failed to update cart');
// //       console.error('Error updating cart:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const value = {
// //     cart,
// //     loading,
// //     addToCart,
// //     removeFromCart,
// //     updateQuantity,
// //     isSignedIn,
// //     user
// //   };

// //   return (
// //     <AppContext.Provider value={value}>
// //       {children}
// //     </AppContext.Provider>
// //   );
// // }

// // export function useApp() {
// //   const context = useContext(AppContext);
// //   if (!context) {
// //     throw new Error('useApp must be used within an AppContextProvider');
// //   }
// //   return context;
// // }
// 'use client';
// import { createContext, useContext, useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
// import axios from "axios";

// const AppContext = createContext();

// export function AppContextProvider({ children }) {
//   const { isSignedIn, user } = useUser();
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch cart data when user signs in
//   useEffect(() => {
//     if (isSignedIn) {
//       fetchCart();
//     } else {
//       setCart([]);
//     }
//   }, [isSignedIn]);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/clerk/cart');
//       setCart(response.data.cart);
//     } catch (error) {
//       toast.error('Failed to fetch cart');
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId) => {
//     if (!isSignedIn) {
//       toast.error('Please sign in to add items to cart');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post('/api/clerk/cart', { productId });
//       setCart(response.data.cart);
//       toast.success('Added to cart!');
//     } catch (error) {
//       toast.error('Failed to add item to cart');
//       console.error('Error adding to cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       setLoading(true);
//       const response = await axios.delete(`/api/clerk/cart/${productId}`);
//       setCart(response.data.cart);
//       toast.success('Removed from cart!');
//     } catch (error) {
//       toast.error('Failed to remove item from cart');
//       console.error('Error removing from cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/api/clerk/cart/${productId}`, { quantity });
//       setCart(response.data.cart);
//       toast.success('Cart updated!');
//     } catch (error) {
//       toast.error('Failed to update cart');
//       console.error('Error updating cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     cart,
//     loading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     isSignedIn,
//     user
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppContextProvider');
//   }
//   return context;
// }


// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const AppContext = createContext();

// export function AppContextProvider({ children }) {
//   const { isSignedIn, user } = useUser();
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isSignedIn) {
//       fetchCart();
//     } else {
//       setCart([]);
//     }
//   }, [isSignedIn]);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/clerk/cart');
//       setCart(response.data.cart);
//     } catch (error) {
//       toast.error('Failed to fetch cart');
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId) => {
//     if (!isSignedIn) {
//       toast.error('Please sign in to add items to cart');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post('/api/clerk/cart', { productId });
//       setCart(response.data.cart);
//       toast.success('Added to cart!');
//     } catch (error) {
//       toast.error('Failed to add item to cart');
//       console.error('Error adding to cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       setLoading(true);
//       const response = await axios.delete(`/api/clerk/cart/${productId}`);
//       setCart(response.data.cart);
//       toast.success('Removed from cart!');
//     } catch (error) {
//       toast.error('Failed to remove item from cart');
//       console.error('Error removing from cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/api/clerk/cart/${productId}`, { quantity });
//       setCart(response.data.cart);
//       toast.success('Cart updated!');
//     } catch (error) {
//       toast.error('Failed to update cart');
//       console.error('Error updating cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     cart,
//     loading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     isSignedIn,
//     user,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// export function useApp() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppContextProvider');
//   }
//   return context;
// }


// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const AppContext = createContext();

// export function AppContextProvider({ children }) {
//   const[products, setProducts] = useState([]);
//   const { isSignedIn, user } = useUser();
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isSignedIn) {
//       fetchCart();
//     } else {
//       setCart([]);
//     }
//   }, [isSignedIn]);
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get('/api/clerk/product');
//       setProducts(res.data.products);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       toast.error('Failed to fetch products');
//     }
//   };
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/clerk/cart');
//       console.log('Fetched cart:', response.data.cart);
//       setCart(response.data.cart);
//     } catch (error) {
//       toast.error('Failed to fetch cart');
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId) => {
//     if (!isSignedIn) {
//       toast.error('Please sign in to add items to cart');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post('/api/clerk/cart', { productId });
//       console.log('Cart after adding:', response.data.cart);
//       setCart(response.data.cart);
//       toast.success('Added to cart!');
//     } catch (error) {
//       toast.error('Failed to add item to cart');
//       console.error('Error adding to cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     try {
//       setLoading(true);
//       const response = await axios.delete(`/api/clerk/cart/${productId}`);
//       console.log('Cart after removing:', response.data.cart);
//       setCart(response.data.cart);
//       toast.success('Removed from cart!');
//     } catch (error) {
//       toast.error('Failed to remove item from cart');
//       console.error('Error removing from cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/api/clerk/cart/${productId}`, { quantity });
//       console.log('Cart after update:', response.data.cart);
//       setCart(response.data.cart);
//       toast.success('Cart updated!');
//     } catch (error) {
//       toast.error('Failed to update cart');
//       console.error('Error updating cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     cart,
//     loading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     isSignedIn,
//     user,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// export function useApp() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within an AppContextProvider');
//   }
//   return context;
// }
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { isSignedIn, user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.get('/api/products'); // Not /api/clerk/products
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to fetch products');
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/clerk/cart');
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to fetch cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to cart');
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/clerk/cart', { productId });
      setCart(response.data.cart);
      toast.success('Added to cart!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/clerk/cart/${productId}`);
      setCart(response.data.cart);
      toast.success('Removed from cart!');
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/clerk/cart/${productId}`, { quantity });
      setCart(response.data.cart);
      toast.success('Cart updated!');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Error updating cart:', error);
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
