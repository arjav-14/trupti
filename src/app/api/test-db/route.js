// src/app/api/test-db/route.js (Next.js 13+/App Router)
import { NextResponse } from "next/server";
import { connectToDB } from "../../../config/db"; // Corrected path for relative imports

export async function GET() {
  try {
    const db = await connectToDB();

    const collections = await db.connection.db.listCollections().toArray();

    console.log("✅ MongoDB connected.");
    console.log("📂 Collections in DB:");
    collections.forEach((col) => {
      console.log(` - ${col.name}`);
    });

    return NextResponse.json({ success: true, collections });
  } catch (error) {
    console.error("❌ DB Test Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}