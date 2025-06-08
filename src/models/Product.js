import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true 
  },
  image: { 
    type: String,
    required: true,
    default: '/images/placeholder.jpg'
  },
  imageAlt: { 
    type: String,
    required: true,
    default: '/images/logo.jpg'
  },
  variants: [{
    weight: {
      value: {
        type: Number,
        required: true,
        enum: [150, 250, 500, 1000] // Only allow these specific weights
      },
      unit: {
        type: String,
        default: 'g',
        enum: ['g'] // Only allow grams
      }
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      // Calculate price based on weight proportion
      // 150g = ₹149 (roughly 1/6 of 1000g price)
      // 250g = ₹199 (roughly 2/7 of 1000g price)
      // 500g = ₹399 (roughly 4/7 of 1000g price)
      // 1000g = ₹699 (base price)
      validate: {
        validator: function(price) {
          const weightPriceMap = {
            150: 149,
            250: 199,
            500: 399,
            1000: 699
          };
          return price === weightPriceMap[this.weight.value];
        },
        message: 'Price must match the standard price for the selected weight'
      }
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for better search performance
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
