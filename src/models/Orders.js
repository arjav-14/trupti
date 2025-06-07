// // import mongoose from 'mongoose';

// // const orderSchema = new mongoose.Schema({
// //   userId: {
// //     type: String,
// //     required: true
// //   },
// //   items: [{
// //     productId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: 'Product',
// //       required: true
// //     },
// //     quantity: {
// //       type: Number,
// //       required: true,
// //       min: 1
// //     }
// //   }],
// //   totalAmount: {
// //     type: Number,
// //     required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['pending', 'processing', 'delivered'],
// //     default: 'pending'
// //   },
// //   shippingAddress: {
// //     type: String,
// //     required: true
// //   }
// // }, {
// //   timestamps: true
// // });

// // const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
// // export default Order;

// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true
//   },
//   items: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     price: {
//       type: Number,
//       required: true
//     }
//   }],
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'delivered'],
//     default: 'pending'
//   },
//   shippingAddress: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
// export default Order;

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, required: true, unique: true },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  paymentDetails: {
    paymentId: String,
    orderId: String,
    signature: String
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;