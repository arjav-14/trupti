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
    console.error("❌ Webhook signature invalid", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    console.log("✅ Clerk user created:", data);
    // Optionally save to DB here
  }

  return NextResponse.json({ received: true });
}
