'use client';
import Image from 'next/image';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useApp } from '../Context/AppContext';
import { useState, useEffect } from 'react';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=Product+Image';

export default function Home() {
  const { isSignedIn, addToCart, products } = useApp();
  const [selectedVariants, setSelectedVariants] = useState({});

  // Debug: Log products when they change
  useEffect(() => {
    console.group('Products Debug');
    console.log('Available products:', products?.length);
    console.log('Products structure:', products?.map(p => ({
      id: p._id,
      name: p.name,
      variantsCount: p.variants?.length
    })));
    console.groupEnd();
  }, [products]);

  const handleVariantSelect = (productId, variant) => {
    console.group('Variant Selection');
    console.log('Product ID:', productId);
    console.log('Selected variant:', {
      weight: variant.weight,
      price: variant.price,
      inStock: variant.inStock
    });
    console.groupEnd();

    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  const handleAddToCart = async (productId) => {
    console.group('Add to Cart Operation');
    console.log('Starting add to cart for product:', productId);

    if (!isSignedIn) {
      console.log('User not signed in');
      console.groupEnd();
      toast.error('Please sign in to add items to cart');
      return;
    }

    const selectedVariant = selectedVariants[productId];
    if (!selectedVariant) {
      console.log('No variant selected for product:', productId);
      console.groupEnd();
      toast.error('Please select a size first');
      return;
    }

    try {
      // Validate variant data before sending
      if (!selectedVariant.weight?.value || !selectedVariant.price) {
        console.error('Invalid variant data:', selectedVariant);
        console.groupEnd();
        toast.error('Invalid product variant');
        return;
      }

      console.log('Validated cart payload:', {
        productId,
        variantDetails: {
          weight: selectedVariant.weight,
          price: selectedVariant.price,
          inStock: selectedVariant.inStock
        }
      });

      const result = await addToCart(productId, selectedVariant.weight.value);
      console.log('Add to cart API response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      console.log('Successfully added to cart');
      console.groupEnd();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Add to cart error:', {
        name: error.name,
        message: error.message,
        response: error.response?.data
      });
      console.groupEnd();
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const displayProducts = Array.isArray(products) ? products : [];

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#b5d16b] to-[#f0fb5f]">
      <Header />
      <section className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-orange-800">
            Our Bestsellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <div key={product._id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <div className="relative h-80">
                  <Image 
                    src={product.image || PLACEHOLDER_IMAGE} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    priority 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-orange-700">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Weight Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Select Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants?.map((variant) => (
                        <button
                          key={variant.weight.value}
                          onClick={() => handleVariantSelect(product._id, variant)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all ${
                            selectedVariants[product._id]?.weight.value === variant.weight.value
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

                  {/* Price and Add to Cart */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-bold text-orange-800">
                      ₹{selectedVariants[product._id]?.price || product.variants[0].price}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className={`px-4 py-2 rounded-lg transition ${
                        isSignedIn 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={!isSignedIn}
                    >
                      {isSignedIn ? 'Add to Cart' : 'Sign in to Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}



