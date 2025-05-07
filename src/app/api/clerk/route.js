import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDB } from "./config/db";
import User from "./models/User";
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
export async function POST(req) {
  const payload = await req.text();
  const headerPayload = headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };
  const webhook = new Webhook(WEBHOOK_SECRET);

  let event;
  try {
    event = webhook.verify(payload, svixHeaders);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  await connectToDB();

  if (type === "user.created") {
    try {
      const newUser = new User({
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      });

      await newUser.save();
      console.log("✅ User saved to DB:", newUser);
    } catch (err) {
      console.error("❌ Failed to save user:", err.message);
    }
  }

  else if (type === "user.updated") {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.email_addresses?.[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
        { new: true }
      );

      if (updatedUser) {
        console.log("📝 User updated in DB:", updatedUser);
      } else {
        console.warn("⚠️ User not found for update:", data.id);
      }
    } catch (err) {
      console.error("❌ Failed to update user:", err.message);
    }
  }

  else if (type === "user.deleted") {
    try {
      const deletedUser = await User.findOneAndDelete({ clerkId: data.id });

      if (deletedUser) {
        console.log("❌ User deleted from DB:", deletedUser);
      } else {
        console.warn("⚠️ User not found for deletion:", data.id);
      }
    } catch (err) {
      console.error("❌ Failed to delete user:", err.message);
    }
  }

  else {
    console.log("ℹ️ Unhandled Clerk event type:", type);
  }

  return NextResponse.json({ received: true });
}
