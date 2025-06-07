'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const router = useRouter();
  const { cart, loading, removeFromCart, updateQuantity, isSignedIn } = useApp();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to checkout');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Redirect to checkout page
    router.push('/checkout');
  };

  if (!isSignedIn) {
    return <p className="p-6 text-red-500">Please sign in to view your cart.</p>;
  }

  if (loading) {
    return <p className="p-6">Loading your cart...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>

                <p className="text-gray-700 mt-1">
                  ₹{item.price} × {item.quantity} ={' '}
                  <span className="font-semibold">
                    ₹{item.price * item.quantity}
                  </span>
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.productId, item.quantity - 1)
                        : removeFromCart(item.productId)
                    }
                    className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:underline text-sm self-start sm:self-center"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-6">
            <div>
              <p className="text-xl font-semibold mb-4 sm:mb-0">
                Total: ₹{totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
            </div>
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors"
              onClick={handleCheckout}
              disabled={!isSignedIn || cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;