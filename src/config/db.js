import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (err) {
        console.error("Error connecting to DB:", err.message);
        process.exit(1);  // Exit process with failure
    }
}

// Handling connection events
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
});

// Handle process termination
process.on("SIGINT", async () => {
    try {
        await mongoose.connection.close();
        console.log("Mongoose connection closed through app termination");
        process.exit(0);
    } catch (err) {
        console.error("Error closing Mongoose connection:", err.message);
        process.exit(1);
    }
});

export default connectDB;