'use client';
import Image from 'next/image';
import Header from '../components/Header';
import { useUser } from "@clerk/nextjs";
import toast from 'react-hot-toast';

const products = [
  { 
    name: 'Mango Pickle', 
    img: '/images/mango-pickle.jpg',
    price: '₹199',
    description: 'Traditional raw mango pickle with aromatic spices'
  },
  { 
    name: 'Lemon Pickle', 
    img: '/images/lemon-pickle.jpg',
    price: '₹149',
    description: 'Tangy and spicy authentic lemon pickle'
  },
  { 
    name: 'Chili Pickle', 
    img: '/images/chili-pickle.jpg',
    price: '₹179',
    description: 'Hot and spicy green chili pickle'
  },
];

export default function Home() {
  const { isSignedIn, user } = useUser();

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    
    // Add to cart logic here
    toast.success('Added to cart successfully!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#b5d16b] via-[#ae9e4f] via-[#957040] via-[#704936] via-[#432a27] via-[#482c29] via-[#4e2d2b] via-[#532f2d] via-[#8e533c] via-[#c08243] via-[#e3bb4a] to-[#f0fb5f]">
      <Header />

      {/* Hero Section - removed gradient since it's in main */}
      <section className="relative h-[80vh]">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center p-8">
            <h1 className="text-6xl font-bold mb-6 text-white tracking-tight">
              Delicious Homemade Pickles
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Made with love & traditional recipes. Spice up your meals with Trupti Foodz.
            </p>
            <a 
              href="/products" 
              className="inline-block bg-orange-600 text-white px-8 py-4 rounded-lg 
                         font-semibold text-lg transform transition 
                         hover:bg-orange-700 hover:scale-105"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Product Highlights - updated with auth check */}
      <section className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-orange-800">
            Our Bestsellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.name} 
                   className="bg-white rounded-2xl shadow-lg overflow-hidden 
                              transform transition duration-300 hover:scale-105">
                <div className="relative h-64">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-orange-700">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-orange-800">{product.price}</span>
                    <button 
                      onClick={handleAddToCart}
                      className={`px-4 py-2 rounded-lg transition ${
                        isSignedIn 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
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

      {/* Features Section - updated background */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-orange-800">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-orange-700">Natural Ingredients</h3>
              <p className="text-gray-600">100% natural ingredients sourced from local farmers</p>
            </div>
            {/* Add more features here */}
          </div>
        </div>
      </section>

      {/* Contact CTA - updated background */}
      <section className="bg-black/20 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-white">Have Questions?</h2>
          <p className="text-lg mb-8 text-gray-100">
            Get in touch with us for custom orders or wholesale inquiries.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-orange-700 px-8 py-4 rounded-lg 
                     font-semibold transform transition 
                     hover:bg-gray-100 hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
