'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../Context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, isSignedIn } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
    if (!cart.length) {
      router.push('/');
    }
  }, [isSignedIn, cart]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderData) => {
    const res = await initializeRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    try {
      // Create Razorpay order
      const result = await axios.post('/api/clerk/payment', {
        amount: orderData.totalAmount * 100 // Convert to paise
      });

      if (!result.data.id) {
        toast.error('Something went wrong');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.totalAmount * 100,
        currency: 'INR',
        name: 'Trupti Foodz',
        description: 'Payment for your order',
        order_id: result.data.id,
        handler: async (response) => {
          try {
            // Verify payment
            const { data } = await axios.post('/api/clerk/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData
            });

            if (data.success) {
              toast.success('Payment successful!');
              router.push('/order-success');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#ea580c'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    }
  };

  const handleCheckout = async (formData) => {
    try {
      setLoading(true);
      
      // Create order payload
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingAddress: `${formData.name}\n${formData.phone}\n${formData.address}, ${formData.city} - ${formData.pincode}`,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      await handlePayment(orderData);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingAddress: `${formData.name}\n${formData.phone}\n${formData.address}, ${formData.city} - ${formData.pincode}`,
        customerEmail: formData.email,
        customerPhone: formData.phone
      };

      await handlePayment(orderData);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="p-3 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="p-3 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            className="p-3 border rounded"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Pincode"
            required
            className="p-3 border rounded"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
          />
        </div>
        
        <textarea
          placeholder="Full Address"
          required
          className="w-full p-3 border rounded"
          rows={4}
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 font-bold">
            Total: ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </main>
  );
}