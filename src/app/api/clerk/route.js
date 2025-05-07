import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {connectDB} from "../../../config/db"; 
import User from "../../../models/User";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    // Extract headers
    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Validate headers
    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      console.error("❌ Missing svix headers");
      return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
    }

    const payload = await req.text();
    const webhook = new Webhook(WEBHOOK_SECRET);

    let event;
    try {
      event = webhook.verify(payload, svixHeaders);
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { type, data } = event;
    await connectDB();

    // Prepare user data
    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address,
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      imageUrl: data.image_url,
    };

    console.log("🛠 Processing webhook:", type, userData);

    // Handle different Clerk webhook events
    try {
      switch (type) {
        case "user.created":
          await User.create(userData);
          console.log("✅ User created:", userData.clerkId);
          break;
        case "user.updated":
          await User.findOneAndUpdate({ clerkId: data.id }, userData, { upsert: true });
          console.log("📝 User updated:", userData.clerkId);
          break;
        case "user.deleted":
          await User.findOneAndDelete({ clerkId: data.id });
          console.log("❌ User deleted:", data.id);
          break;
        default:
          console.warn("⚠️ Unhandled Clerk event type:", type);
      }
    } catch (error) {
      console.error("❌ Database operation failed:", error);
    }

    return NextResponse.json({ success: true, message: `Webhook processed: ${type}` });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}