import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../config/db"; 
import User from "../../../../models/User";  
import Product from "../../../../models/Product";  
// Get Cart
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB(); // Ensure DB connection

    const user = await User.findOne({ clerkId: userId }).populate("cart.productId");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Add to Cart
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
    }

    await connectDB(); // Ensure DB connection

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Optional: Add email if available
      user = await User.create({ clerkId: userId, email: "", cart: [] });
    }

    const existingItem = user.cart.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId: mongoose.Types.ObjectId(productId), quantity: 1 });
    }

    await user.save();
    await user.populate("cart.productId");

    return NextResponse.json({ cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
