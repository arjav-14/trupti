
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "../../../../config/db";
import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Product from "../../../../models/Product";
// Utility: Format cart items with populated product data and variant
const formatCartItems = (cart) => {
  return cart
    .map((item) => {
      if (!item.productId) return null;

      return {
        productId: item.productId._id || item.productId,
        name: item.productId.name || '',
        price: item.variant?.price || item.productId.price || 0,
        image: item.productId.image || '',
        quantity: item.quantity || 1,
        variant: item.variant || null,
      };
    })
    .filter(Boolean);
};

// GET /api/cart - Fetch cart items
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variant } = await req.json();

    if (!productId || !variant || !variant.weight?.value || !variant.price) {
      return NextResponse.json({ success: false, error: "Product ID and valid variant are required" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if same product and variant already exists
    const existingItemIndex = user.cart.findIndex(
      item =>
        item.productId.toString() === productId &&
        item.variant?.weight?.value === variant.weight.value
    );

    if (existingItemIndex > -1) {
      // Increase quantity
      user.cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item with variant
      user.cart.push({
        productId,
        quantity: 1,
        variant: {
          weight: {
            label: variant.weight.label,
            value: variant.weight.value,
          },
          price: variant.price,
        }
      });
    }

    await user.save();
    await user.populate("cart.productId");

    const formattedCart = formatCartItems(user.cart);
    return NextResponse.json({ success: true, cart: formattedCart });

  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 });
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const result = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { cart: [] } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error("Failed to clear cart:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}
