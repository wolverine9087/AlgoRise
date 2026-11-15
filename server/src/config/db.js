import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) throw new Error("MONGO_URI is not configured");

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
    
  } catch (error) {

    console.error("Database connection failed:", error.message);
    process.exit(1);

  }
};

export default mongoose;
