import mongoose from "mongoose";
import Permission from "./src/lib/models/Permission";
import Role from "./src/lib/models/Role";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing. Set it in .env.local before seeding.");
}

const MONGO_URI = process.env.MONGO_URI as string;

const permissions = [
  "create_course",
  "edit_course",
  "delete_course",
  "view_course",
  "assign_teacher",
  "enroll_student",
  "grade_student",
  "view_results",
] as const;

const rolePermissions: Record<string, (typeof permissions)[number][]> = {
  Admin: [
    "create_course",
    "edit_course",
    "delete_course",
    "assign_teacher",
    "enroll_student",
    "view_results",
  ],
  Teacher: ["view_course", "grade_student", "view_results"],
  Student: ["view_course", "view_results"],
  Parent: ["view_results"],
};

const seedData = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🍃 MongoDB connected");

    // Insert permissions only if not already present
    await Permission.insertMany(
      permissions.map((p) => ({ name: p })),
      { ordered: false }
    ).catch(() => null);

    console.log("🔐 Permissions seeded");

    const allPermissions = await Permission.find();

    for (const roleName in rolePermissions) {
      const rolePermIds = allPermissions
        .filter((p) => rolePermissions[roleName].includes(p.name))
        .map((p) => p._id);

      await Role.findOneAndUpdate(
        { name: roleName },
        { permissions: rolePermIds },
        { upsert: true }
      );
    }

    console.log("👥 Roles seeded");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
