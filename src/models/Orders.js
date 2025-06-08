
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String, required: true },
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: { 
      type: String, 
      required: true 
    },
    image: {
      type: String,
      default: '/images/placeholder.jpg'
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    variantDetails: {
      weight: {
        value: { 
          type: Number, 
          required: true 
        },
        unit: { 
          type: String, 
          required: true,
          enum: ['g', 'kg']
        }
      },
      price: { 
        type: Number, 
        required: true,
        min: 0
      }
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
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
  shippingAddress: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
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