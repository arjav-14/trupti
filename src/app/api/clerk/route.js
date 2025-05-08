// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// export async function POST(req) {
//   const payload = await req.text();
//   const headerPayload = headers();

//   const svixHeaders = {
//     "svix-id": headerPayload.get("svix-id"),
//     "svix-timestamp": headerPayload.get("svix-timestamp"),
//     "svix-signature": headerPayload.get("svix-signature"),
//   };

//   const webhook = new Webhook(WEBHOOK_SECRET);

//   let event;
//   try {
//     event = webhook.verify(payload, svixHeaders);
//   } catch (err) {
//     console.error("❌ Webhook signature invalid", err);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   const { type, data } = event;

//   if (type === "user.created") {
//     console.log("✅ Clerk user created:", data);
//     // Optionally save to DB here
//   }

//   return NextResponse.json({ received: true });
// }


import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "../../../../config/db"; // Ensure correct path
import User from "../../../../models/User";  // Ensure correct path

// Load Webhook Secret from Environment Variables
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    // Ensure Webhook Secret Exists
    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in .env file");
    }

    // Extract Headers
    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Verify Webhook Signature
    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      console.error("❌ Missing Svix headers");
      return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
    }

    const payload = await req.text();
    const webhook = new Webhook(WEBHOOK_SECRET);

    let event;
    try {
      event = webhook.verify(payload, svixHeaders);
    } catch (err) {
      console.error("❌ Webhook signature invalid:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { type, data } = event;
    await connectDB();  // Ensure MongoDB connection

    // Prepare user data
    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      imageUrl: data.image_url,
    };

    console.log("🛠 Processing webhook:", type, userData);

    // Handle Clerk Webhook Events
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