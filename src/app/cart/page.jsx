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
  const { cart, loading, removeFromCart, updateQuantity, isSignedIn } = useApp();

  // Calculate total
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
              className="flex items-center gap-6 border rounded-lg p-4 shadow-sm bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-gray-700 font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                  <div className="flex items-center gap-2 ml-6">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.productId, item.quantity - 1)
                          : removeFromCart(item.productId)
                      }
                      className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center font-medium">
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
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="flex justify-between items-center pt-6 border-t mt-8">
            <p className="text-xl font-semibold">
              Total: ₹{totalPrice.toFixed(2)}
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
              onClick={() => alert('Proceeding to checkout...')}
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
