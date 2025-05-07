// import mongoose from "mongoose";

// let isConnected = false;

// export default async function connectDB() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "truptifoodz", // Database name must match what's in the URI
//       retryWrites: true, // Enables retryable writes
//       w: "majority", // Wait for the majority of nodes to acknowledge the write
//     });

//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ Error connecting to DB:", err.message);
//   }

//   // Add the following to ensure the connection is open
//   mongoose.connection.on('open', () => {
//     console.log('MongoDB connection is open');
//   });
//   mongoose.connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
//   });
// }
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
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
