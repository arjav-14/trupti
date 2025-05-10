// 'use client';

// import React from 'react';
// import { useApp } from '../../Context/AppContext';

// const CartPage = () => {
//   const { cart, loading, removeFromCart, isSignedIn } = useApp();

//   if (!isSignedIn) {
//     return <p className="p-6 text-red-500">Please sign in to view your cart.</p>;
//   }

//   if (loading) {
//     return <p className="p-6">Loading your cart...</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul className="space-y-4">
//           {cart.map((item, index) => (
//             <li key={index} className="border p-4 rounded">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg font-semibold">{item.name}</h2>
//                   <p className="text-gray-600">Qty: {item.quantity}</p>
//                 </div>
//                 <button
//                   onClick={() => removeFromCart(item.productId)}
//                   className="text-red-500 hover:underline"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CartPage;


'use client';

import React from 'react';
import { useApp } from '../../Context/AppContext';

const CartPage = () => {
  const { cart, loading, removeFromCart, isSignedIn } = useApp();

  if (!isSignedIn) {
    return <p className="p-6 text-red-500">Please sign in to view your cart.</p>;
  }

  if (loading) {
    return <p className="p-6">Loading your cart...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item, index) => (
            <li key={index} className="border p-4 rounded flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="text-gray-800 font-medium">Price: ₹{item.price}</p>
              </div>
              <button
                type="button" // ✅ prevents page reload
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
