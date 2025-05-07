import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "truptifoodz", // Database name must match what's in the URI
      retryWrites: true, // Enables retryable writes
      w: "majority", // Wait for the majority of nodes to acknowledge the write
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Error connecting to DB:", err.message);
  }

  // Add the following to ensure the connection is open
  mongoose.connection.on('open', () => {
    console.log('MongoDB connection is open');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
}
