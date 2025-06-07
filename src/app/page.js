// 'use client';
// import Image from 'next/image';
// import Header from '../components/Header';
// import toast from 'react-hot-toast';
// import { useApp } from '../Context/AppContext';
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=Product+Image';

// export default function Home() {
//   const { isSignedIn, addToCart, products } = useApp(); 
//   const [imageToggle, setImageToggle] = useState({}); 
//   const handleAddToCart = async (productId) => {
//     console.log('[handleAddToCart] Attempting to add product:', productId);
    
//     const result = await addToCart(productId);

//     if (!result.success) {
//       console.log('[handleAddToCart] Add failed:', result.message);
//       toast.error('Failed to add to cart. Please try again.');
//       return;
//     }

//     console.log('[handleAddToCart] Add successful:', result);
//     toast.success('Product added to cart!');
//   };

//   // Ensure products is an array before calling map
//   const displayProducts = Array.isArray(products) ? products : [];

//   return (
//     <main className="min-h-screen bg-gradient-to-tr from-[#b5d16b] to-[#f0fb5f]">
//       <Header />
//       <section className="py-24 bg-white/80 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-12 text-center text-orange-800">Our Bestsellers</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {displayProducts.map((product) => (
              
//               <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                
//                 <div className="relative h-80">
//                   <Image src={product.image || PLACEHOLDER_IMAGE} alt={product.name || "product name"} fill className="object-cover" />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-2xl font-semibold mb-2 text-orange-700">{product.name}</h3>
//                   <p className="text-gray-600 mb-4">{product.description}</p>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xl font-bold text-orange-800">₹{product.price}</span>
//                     <button 
//                       onClick={() => handleAddToCart(product._id)}
//                       className={`px-4 py-2 rounded-lg transition ${isSignedIn ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
//                       disabled={!isSignedIn}
//                     >
//                       {isSignedIn ? 'Add to Cart' : 'Sign in to Buy'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


'use client';
import { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useApp } from '../Context/AppContext';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=Product+Image';

export default function HomePage() {
  const { isSignedIn, addToCart, products } = useApp();
  const [imageToggle, setImageToggle] = useState({});

  const handleAddToCart = async (productId) => {
    console.log('[handleAddToCart] Attempting to add product:', productId);
    const result = await addToCart(productId);

    if (!result.success) {
      console.log('[handleAddToCart] Add failed:', result.message);
      toast.error('Failed to add to cart. Please try again.');
      return;
    }

    console.log('[handleAddToCart] Add successful:', result);
    toast.success('Product added to cart!');
  };

  const handleImageClick = (productId) => {
    setImageToggle(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
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
            {displayProducts.map((product) => {
              const currentImage = imageToggle[product._id]
                ? product.imageAlt || product.image || PLACEHOLDER_IMAGE
                : product.image || PLACEHOLDER_IMAGE;

              return (
                <div key={product._id} 
                     className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                  <div className="relative h-80">
                    <Image
                      src={currentImage}
                      alt={product.name || 'product image'}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => handleImageClick(product._id)}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2 text-orange-700">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-800">
                        ₹{product.price}
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
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}