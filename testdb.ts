
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in .env.local file");
  process.exit(1);
}

console.log("Connecting to MongoDB...");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
