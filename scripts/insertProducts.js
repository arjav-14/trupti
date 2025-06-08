// import 'dotenv/config'; // or use dotenv.config() as shown above


// import mongoose from 'mongoose';
// import { connectToDB } from '../src/config/db.js';  // ✅ .js required
// import Product from '../src/models/Product.js';      // ✅ .js required

// const products = [
//     { 
//         name: 'Kairi Lasun Pickle', 
//         image: '/images/kairi.jpg', 
//         imageAlt :'/images/logo.jpg',
//         price: 199, 
//         description: `A flavorful fusion of tangy raw mango and bold garlic, Kairi Lasan ka Achar brings a rustic twist to your everyday meals. Carefully balanced with traditional spices and a hint of sweetness, this pickle delivers a unique taste that's both sharp and satisfying.

// Whether paired with roti, paratha, or a simple bowl of dal-rice, it adds a burst of vibrant flavor that lingers long after the last bite.`
//     },
//     { 
//         name: 'Karal Pickle', 
//         image: '/images/karal.png', 
//         imageAlt :'/images/logo.jpg',
//         price: 149, 
//         description: `Experience the bold, traditional taste of Karaal Kairi ka Aachar – a unique, oil-free Indian pickle. Handmade in small batches using premium-quality, hygienically handled ingredients, this tangy delicacy blends raw mango with time-honored spices and a touch of jaggery to naturally balance the flavor.

// Free from red chilli and refined oils, this pickle is a perfect companion to your everyday meals – whether it's roti, dal-chawal, or paratha. Add a spoonful to your plate and enjoy a burst of authentic flavor with every bite.`
//     }
// ];
  

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



import 'dotenv/config';
import mongoose from 'mongoose';
import { connectToDB } from '../src/config/db.js';
import Product from '../src/models/Product.js';

const products = [
    { 
        name: 'Kairi Lasun Pickle',
        image: '/images/kairi.jpg',
        imageAlt: '/images/logo.jpg',
        description: `A flavorful fusion of tangy raw mango and bold garlic, Kairi Lasan ka Achar brings a rustic twist to your everyday meals. Carefully balanced with traditional spices and a hint of sweetness, this pickle delivers a unique taste that's both sharp and satisfying.

Whether paired with roti, paratha, or a simple bowl of dal-rice, it adds a burst of vibrant flavor that lingers long after the last bite.`,
        variants: [
            {
                weight: { value: 150, unit: 'g' },
                price: 149,
                inStock: true
            },
            {
                weight: { value: 250, unit: 'g' },
                price: 199,
                inStock: true
            },
            {
                weight: { value: 500, unit: 'g' },
                price: 399,
                inStock: true
            },
            {
                weight: { value: 1000, unit: 'g' },
                price: 699,
                inStock: true
            }
        ],
        isActive: true
    },
    { 
        name: 'Karal Pickle',
        image: '/images/karal.png',
        imageAlt: '/images/logo.jpg',
        description: `Experience the bold, traditional taste of Karaal Kairi ka Aachar – a unique, oil-free Indian pickle. Handmade in small batches using premium-quality, hygienically handled ingredients, this tangy delicacy blends raw mango with time-honored spices and a touch of jaggery to naturally balance the flavor.

Free from red chilli and refined oils, this pickle is a perfect companion to your everyday meals – whether it's roti, dal-chawal, or paratha. Add a spoonful to your plate and enjoy a burst of authentic flavor with every bite.`,
        variants: [
            {
                weight: { value: 150, unit: 'g' },
                price: 149,
                inStock: true
            },
            {
                weight: { value: 250, unit: 'g' },
                price: 199,
                inStock: true
            },
            {
                weight: { value: 500, unit: 'g' },
                price: 399,
                inStock: true
            },
            {
                weight: { value: 1000, unit: 'g' },
                price: 699,
                inStock: true
            }
        ],
        isActive: true
    }
];
``
// ...existing code...