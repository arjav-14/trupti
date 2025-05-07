// src/lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in your .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  // If already connected, return the cached connection
  if (cached.conn) {
    console.log("✅ Reusing existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔗 Establishing new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongooseInstance) => {
      console.log("✅ MongoDB connection established");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
