import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "../../../../../config/db";
import { NextResponse } from "next/server";
import User from "../../../../../models/User";

export async function PUT(req, { params }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { 
        status: 401 
      });
    }

    const { variantWeight, quantity } = await req.json();
    const productId = params.productId;

    await connectToDB();

    const user = await User.findOne({ clerkId: userId })
      .populate('cart.productId');

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { 
        status: 404 
      });
    }

    // Find the cart item
    const cartItemIndex = user.cart.findIndex(
      item => 
        item.productId._id.toString() === productId && 
        item.variant.weight.value === Number(variantWeight)
    );

    if (cartItemIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: "Item not found in cart" 
      }, { 
        status: 404 
      });
    }

    // Update quantity
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    // Format cart data for response
    const formattedCart = user.cart.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.image,
      quantity: item.quantity,
      variant: {
        weight: {
          value: item.variant.weight.value,
          unit: item.variant.weight.unit
        },
        price: item.variant.price
      },
      totalPrice: item.variant.price * item.quantity
    }));

    return NextResponse.json({
      success: true,
      cart: formattedCart
    });

  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

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

    // Remove item from cart
    user.cart = user.cart.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    return NextResponse.json({ 
      success: true, 
      cart: user.cart 
    });

  } catch (error) {
    console.error("Cart deletion error:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = getAuth(req);
    const productId = params.productId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { variant, quantity } = await req.json();

    await connectToDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add item to cart
    user.cart.push({ productId, variant, quantity });
    await user.save();

    return NextResponse.json({ 
      success: true, 
      cart: user.cart 
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}
