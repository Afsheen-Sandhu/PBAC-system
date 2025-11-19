import mongoose from "mongoose";
import { connectToDB } from "./src/lib/mongo/mongo";
import User from "./src/lib/models/User";
import Role from "./src/lib/models/Role";
import { hashPassword } from "./src/lib/hash/Hash";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const seedAdmin = async (): Promise<void> => {
  try {
    await connectToDB();
    console.log(" MongoDB connected");

    // Find the Admin role
    const adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      throw new Error("Admin role not found. Please run dataSeed.ts first.");
    }

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("👤 Admin user already exists");
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await hashPassword("admin123");

    // Create the admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: adminRole._id,
      permissions: adminRole.permissions,
    });

    await adminUser.save();
    console.log("👤 Admin user seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding admin failed:", error);
    process.exit(1);
  }
};

seedAdmin();
