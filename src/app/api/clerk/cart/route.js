import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "../../../../config/db"; // ✅ Corrected import name
import User from "../../../../models/User";           // ✅ Corrected model path
import Product from "../../../../models/Product";     // ✅ Corrected model path
import { NextResponse } from "next/server";

// GET: Fetch Cart Items
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    let user = await User.findOne({ clerkId: userId }).populate("cart.productId");

    if (!user) {
      user = await User.create({ clerkId: userId, email: "", cart: [] });
    }

    return NextResponse.json({ cart: user.cart || [] }, { status: 200 });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add Product to Cart
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

    await connectToDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({ clerkId: userId, email: "", cart: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingItem = user.cart.find((item) =>
      item.productId.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    await user.populate("cart.productId");

    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
