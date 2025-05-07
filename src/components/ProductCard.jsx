'use client';
import { useApp } from "../Context/AppContext";

export default function ProductCard({ product }) {
  const { addToCart, loading, isSignedIn } = useApp();

  return (
    <button 
      onClick={() => addToCart(product._id)}
      disabled={loading || !isSignedIn}
      className={`px-4 py-2 rounded-lg transition ${
        isSignedIn 
          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
    >
      {isSignedIn ? 'Add to Cart' : 'Sign in to Buy'}
    </button>
  );
}