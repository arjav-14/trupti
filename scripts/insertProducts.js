import 'dotenv/config'; // or use dotenv.config() as shown above


import mongoose from 'mongoose';
import { connectToDB } from '../src/config/db.js';  // ✅ .js required
import Product from '../src/models/Product.js';      // ✅ .js required

const products = [
    { name: 'Mango Pickle', img: '/images/mango-pickle.jpg', price: 199, description: 'Traditional raw mango pickle with aromatic spices' },
    { name: 'Lemon Pickle', img: '/images/lemon-pickle.jpg', price: 149, description: 'Tangy and spicy authentic lemon pickle' },
    { name: 'Chili Pickle', img: '/images/chili-pickle.jpg', price: 179, description: 'Hot and spicy green chili pickle' }
  ];
  

const insertProducts = async () => {
  try {
    await connectToDB();
    await Product.insertMany(products);
    console.log('Products inserted successfully');
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertProducts();
