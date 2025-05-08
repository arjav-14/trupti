// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDB } from "../../../../config/db";  // Corrected import
// import User from "../../../../models/User";  
// import Product from "../../../../models/Product";  

// // Get Cart
// export async function GET(req) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDB();  // Corrected function name

//     const user = await User.findOne({ clerkId: userId }).populate("cart.productId");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ cart: user.cart || [] });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// // Add to Cart
// export async function POST(req) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { productId } = await req.json();

//     if (!productId) {
//       return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
//     }

//     await connectToDB();  // Corrected function name

//     let user = await User.findOne({ clerkId: userId });

//     if (!user) {
//       user = await User.create({ clerkId: userId, email: "", cart: [] });
//     }

//     const existingItem = user.cart.find((item) => item.productId.equals(productId));

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       user.cart.push({ productId: mongoose.Types.ObjectId(productId), quantity: 1 });
//     }

//     await user.save();
//     await user.populate("cart.productId");

//     return NextResponse.json({ cart: user.cart });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { getAuth } from '@clerk/nextjs/server';
import { connectToDB } from '../../../config/db';
import User from '../../../models/User';
import Product from '../../../models/Product';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectToDB();

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ clerkId: userId }).populate('cart.productId');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      let user = await User.findOne({ clerkId: userId });

      if (!user) {
        // Create user if not found
        user = await User.create({ clerkId: userId, email: '', cart: [] });
      }

      // Check if product already in cart
      const existingItem = user.cart.find(item => item.productId.equals(productId));

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cart.push({ productId: new mongoose.Types.ObjectId(productId), quantity: 1 });
      }

      await user.save();
      await user.populate('cart.productId');

      return res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
