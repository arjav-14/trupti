import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../config/db";
import User from "../../../../models/User";

const formatCartItems = (cart) => {
  return cart.map((item) => {
    // Check if productId exists and is populated
    if (!item.productId) {
      return null;
    }

    return {
      productId: item.productId._id || item.productId,
      name: item.productId.name || '',
      price: item.productId.price || 0,
      image: item.productId.image || '',
      quantity: item.quantity || 1
    };
  }).filter(Boolean); // Remove any null items
};

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    await connectToDB();
    const user = await User.findOne({ clerkId: userId }).populate('cart.productId');

    if (!user) {
      return NextResponse.json({ cart: [] });
    }

    const formattedCart = formatCartItems(user.cart);
    return NextResponse.json({ success: true, cart: formattedCart });

  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find if product already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Increment quantity if product exists
      user.cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    // Populate cart items after saving
    await user.populate('cart.productId');

    const formattedCart = formatCartItems(user.cart);
    return NextResponse.json({ success: true, cart: formattedCart });

  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}