'use client';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We'll send you updates via email.
        </p>
        <Link 
          href="/"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}