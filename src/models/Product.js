// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   description: { type: String },
// });

// const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// export default Product;


import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
