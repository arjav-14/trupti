'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../Context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, isSignedIn } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    pincode: '' 
  });
  const [loading, setLoading] = useState(false);
  const { clearCart } = useApp();

  useEffect(() => {
    if (!isSignedIn) router.push('/sign-in');
    else if (!cart.length) router.push('/');
  }, [isSignedIn, cart, router]);

  const initRzp = async () => {
    if (window.Razorpay) {
      return true;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    return new Promise((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => {
        document.body.removeChild(script);
        resolve(false);
      };
    });
  };

  const handlePayment = async (orderData) => {
    try {
      const rzpLoaded = await initRzp();
      if (!rzpLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const { data } = await axios.post('/api/clerk/payment', {
        amount: Math.round(orderData.totalAmount * 100)
      });

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize payment with complete options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Trupti Foodz',
        description: 'Order Payment',
        order_id: data.id,
        handler: async function(response) {
          try {
            const verificationResult = await axios.post('/api/clerk/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                ...orderData,
                items: orderData.items.map(item => ({
                  ...item,
                  variantDetails: {
                    weight: {
                      value: item.variantDetails.weight.value,
                      unit: item.variantDetails.weight.unit || 'g'
                    },
                    price: item.variantDetails.price
                  }
                }))
              }
            });

            if (verificationResult.data.success) {
              try {
                // Clear cart from database
                toast.success('Payment successful',{
                  duration:2000,
                  position:'top-center'
                });
                await axios.delete('/api/clerk/cart');
                // Clear local cart state
                await clearCart();
                // Show success message
                toast.success('Order placed successfully!');
                // Redirect to success page
                router.push(`/order-success?orderId=${verificationResult.data.orderId}`);
              } catch (clearError) {
                console.error('Failed to clear cart:', clearError);
                // Still redirect as order was successful
                router.push(`/order-success?orderId=${verificationResult.data.orderId}`);
              }
            } else {
              throw new Error(verificationResult.data.error);
            }
          } catch (error) {
            console.error('Verification failed:', error);
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: form.name || '',
          email: form.email || '',
          contact: form.phone || ''
        },
        notes: {
          address: form.address || ''
        },
        theme: {
          color: '#ea580c'
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: true
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        toast.error(response.error.description || 'Payment failed');
      });
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to create payment');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!cart.length) {
        throw new Error('Cart is empty');
      }

      // Validate cart items and form data
      if (!form.name || !form.email || !form.phone || !form.address || !form.pincode) {
        throw new Error('Please fill all required fields');
      }

      cart.forEach(item => {
        if (!item.variant?.weight?.value || !item.variant?.price) {
          throw new Error(`Invalid variant data for ${item.name}`);
        }
      });

      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.variant.price,
          image: item.image || '/images/placeholder.jpg',
          variantDetails: {
            weight: {
              value: item.variant.weight.value,
              unit: item.variant.weight.unit || 'g'
            },
            price: item.variant.price
          }
        })),
        totalAmount: cart.reduce((sum, item) => 
          sum + (item.variant.price * item.quantity), 0
        ),
        shippingAddress: `${form.name}\n${form.phone}\n${form.address}, ${form.city || ''}-${form.pincode}`,
        customerEmail: form.email,
        customerPhone: form.phone
      };

      if (orderData.totalAmount <= 0) {
        throw new Error('Invalid order amount');
      }

      await handlePayment(orderData);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="p-3 border rounded"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="p-3 border rounded"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            className="p-3 border rounded"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Pincode"
            required
            className="p-3 border rounded"
            value={form.pincode}
            onChange={(e) => setForm({...form, pincode: e.target.value})}
          />
        </div>
        
        <textarea
          placeholder="Full Address"
          required
          className="w-full p-3 border rounded"
          rows={4}
          value={form.address}
          onChange={(e) => setForm({...form, address: e.target.value})}
        />

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map(item => (
            <div key={item.productId} className="flex justify-between mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.variant.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 font-bold">
            Total: ₹{cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0)}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </main>
  );
}
