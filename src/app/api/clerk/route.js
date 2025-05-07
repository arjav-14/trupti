import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  // Handle different events
  if (type === "user.created") {
    console.log("✅ User created:", data);
  } else if (type === "user.updated") {
    console.log("📝 User updated:", data);
  } else if (type === "user.deleted") {
    console.log("❌ User deleted:", data);
  } else {
    console.log("ℹ️ Unhandled event:", type);
  }

  return NextResponse.json({ received: true });
}
