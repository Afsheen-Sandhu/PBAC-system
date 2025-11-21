import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo/mongo";
import { requireAdmin } from "@/lib/auth/auth";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import {
  serializePermission,
  serializeRole,
  serializeUser,
} from "@/lib/utils/admin-users";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const [users, roles, permissions] = await Promise.all([
      User.find({})
        .populate({
          path: "role",
          model: Role,
          select: "name permissions",
          populate: {
            path: "permissions",
            model: Permission,
            select: "name",
          },
        })
        .populate({
          path: "permissions",
          model: Permission,
          select: "name",
        })
        .lean(),
      Role.find({}).populate("permissions").lean(),
      Permission.find({}).lean(),
    ]);

    return NextResponse.json({
      users: users.map((user) => serializeUser(user)),
      roles: roles.map((role: any) => serializeRole(role)),
      permissions: permissions.map((permission) =>
        serializePermission(permission)
      ),
    });
  } catch (error) {
    console.error("Admin users GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
