import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "../../../../../config/db";
import User from "../../../../../models/User";
import { NextResponse } from "next/server";

// DELETE: Remove item from cart
export async function DELETE(req, { params }) {
  try {
    const { userId } = getAuth(req);
    const { productId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter out the product from the cart
    user.cart = user.cart.filter((item) => item.productId.toString() !== productId);

    await user.save();
    await user.populate("cart.productId");

    return NextResponse.json({ success: true, cart: user.cart }, { status: 200 });
  } catch (error) {
    console.error("DELETE Cart Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update item quantity
export async function PUT(req, { params }) {
    try {
      const { userId } = getAuth(req);
      const { productId } = params;
      const { quantity } = await req.json();
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      if (!quantity || quantity < 1) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
  
      await connectToDB();
      const user = await User.findOne({ clerkId: userId });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      const item = user.cart.find(item => item.productId.toString() === productId);
      if (!item) {
        return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
      }
  
      item.quantity = quantity;
      await user.save();
      await user.populate("cart.productId");
  
      const formattedCart = user.cart.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        description: item.productId.description,
        quantity: item.quantity,
      }));
  
      return NextResponse.json({ success: true, cart: formattedCart }, { status: 200 });
  
    } catch (error) {
      console.error("PUT Cart Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  