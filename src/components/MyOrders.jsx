'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { format } from 'date-fns';

// Helper components
const OrderStatus = ({ status }) => {
  const statusStyles = {
    delivered: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status] || statusStyles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderItem = ({ item }) => (
  <div className="py-4 flex items-center gap-4">
    <div className="relative w-20 h-20">
      <Image
        src={item.image || '/images/placeholder.jpg'}
        alt={item.name}
        fill
        className="object-cover rounded-md"
        sizes="80px"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-medium">{item.name}</h3>
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-600">
          Size: {item.variant?.weight?.value}{item.variant?.weight?.unit || 'g'}
        </p>
        <p className="text-gray-600">
          Quantity: {item.quantity} × 
          <span className="font-medium"> ₹{formatPrice(item.price)}</span>
        </p>
        <p className="font-medium text-orange-600">
          Total: ₹{formatPrice(item.quantity * item.price)}
        </p>
      </div>
    </div>
  </div>
);

const OrderCard = ({ order }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
        <p className="text-sm text-gray-500">
          Ordered on: {format(new Date(order.createdAt), 'MMM dd, yyyy')}
        </p>
      </div>
      <OrderStatus status={order.status} />
    </div>

    <div className="divide-y">
      {order.items.map(item => (
        <OrderItem key={item._id} item={item} />
      ))}
    </div>

    <div className="border-t mt-4 pt-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-orange-800">
            ₹{formatPrice(order.totalAmount)}
          </p>
        </div>
        <div className="text-right max-w-[50%]">
          <p className="text-gray-600 mb-1">Delivery Address</p>
          <p className="text-sm whitespace-pre-line text-gray-700">{order.shippingAddress}</p>
        </div>
      </div>
    </div>
  </div>
);

// Utility functions
const formatPrice = (price) => Number(price).toFixed(2);

// Main component
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetchOrders();
    }
  }, [isSignedIn]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get('/api/clerk/orders');

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      if (!Array.isArray(data.orders)) {
        throw new Error('Invalid orders data received');
      }

      setOrders(data.orders);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-800">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
