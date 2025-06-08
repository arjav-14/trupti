'use client';
import { useState } from 'react';

export default function ProductVariantSelector({ variants, onVariantSelect }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    onVariantSelect(variant);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Select Size:</label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.weight.value}
            onClick={() => handleVariantChange(variant)}
            className={`px-4 py-2 rounded-full border-2 transition-all ${
              selectedVariant.weight.value === variant.weight.value
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
            }`}
          >
            {variant.weight.value}{variant.weight.unit}
            <span className="ml-2 font-semibold">₹{variant.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}