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
