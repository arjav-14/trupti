
'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Product Image */}
      <div className="relative aspect-square mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        
        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {product.variants?.map((variant) => (
              <button
                key={variant.weight.value}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedVariant.weight.value === variant.weight.value
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-gray-200 hover:border-orange-600'
                }`}
              >
                <span className="block text-sm">
                  {variant.weight.value}{variant.weight.unit}
                </span>
                <span className="block font-bold">
                  ₹{variant.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-orange-600 font-bold text-xl">
            ₹{selectedVariant.price}
          </div>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}