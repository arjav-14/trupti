'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const router = useRouter();
  const { cart, loading, removeFromCart, updateQuantity, isSignedIn } = useApp();
  const [updating, setUpdating] = useState(false);

  // Calculate total with null checks
  const totalPrice = cart.reduce((acc, item) => {
    const price = item.variant?.price || 0;
    const quantity = item.quantity || 0;
    return acc + (price * quantity);
  }, 0);

  const handleQuantityUpdate = async (productId, variant, newQuantity) => {
    try {
      if (!variant?.weight?.value) {
        throw new Error('Invalid product variant');
      }

      if (newQuantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      setUpdating(true);
      await updateQuantity(productId, variant.weight.value, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId, variant) => {
    try {
      if (!variant?.weight?.value) {
        throw new Error('Invalid product variant');
      }

      setUpdating(true);
      await removeFromCart(productId, variant.weight.value);
      
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">Please sign in to view your cart</p>
        <button 
          onClick={() => router.push('/sign-in')}
          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading || updating) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => {
            const variantWeight = item.variant?.weight?.value 
              ? `${item.variant.weight.value}${item.variant.weight.unit || 'g'}`
              : 'N/A';
            const variantPrice = item.variant?.price || 0;
            const itemTotal = variantPrice * (item.quantity || 1);

            return (
              <div
                key={`${item.productId}-${item.variant?.weight?.value}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name || 'Product image'}
                    fill
                    sizes="96px"
                    className="object-cover rounded"
                    priority={false}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">Size: {variantWeight}</p>
                  <p className="text-gray-700">
                    ₹{variantPrice.toFixed(2)} × {item.quantity || 1} = 
                    <span className="font-semibold"> ₹{itemTotal.toFixed(2)}</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityUpdate(
                        item.productId, 
                        item.variant, 
                        Math.max(1, (item.quantity || 1) - 1)
                      )}
                      disabled={updating || item.quantity <= 1}
                      className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityUpdate(
                        item.productId, 
                        item.variant, 
                        (item.quantity || 1) + 1
                      )}
                      disabled={updating}
                      className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.productId, item.variant)}
                  disabled={updating}
                  className="text-red-500 hover:text-red-700 hover:underline text-sm 
                    self-start sm:self-center transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row justify-between items-center 
            border-t pt-6 mt-6">
            <div>
              <p className="text-xl font-bold text-orange-800">
                Total: ₹{totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
              </p>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              disabled={cart.length === 0 || updating}
              className="mt-4 sm:mt-0 w-full sm:w-auto bg-orange-600 
                hover:bg-orange-700 text-white font-semibold py-3 px-8 
                rounded-lg shadow transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {updating ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;