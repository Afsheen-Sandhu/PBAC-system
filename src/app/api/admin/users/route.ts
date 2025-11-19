import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo/mongo";
import { requireAdmin } from "@/lib/auth/auth";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";

function serializeUser(user: any) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
      ? {
          id: user.role._id.toString(),
          name: user.role.name,
        }
      : null,
    permissions:
      user.permissions?.map((perm: any) => ({
        id: perm._id.toString(),
        name: perm.name,
      })) ?? [],
  };
}

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const [users, roles, permissions] = await Promise.all([
      User.find()
        .populate({ path: "role", model: Role, select: "name" })
        .populate({ path: "permissions", model: Permission, select: "name" }),
      Role.find().select("name"),
      Permission.find().select("name"),
    ]);

    return NextResponse.json({
      users: users.map(serializeUser),
      roles: roles.map((role) => ({
        id: role._id.toString(),
        name: role.name,
      })),
      permissions: permissions.map((perm) => ({
        id: perm._id.toString(),
        name: perm.name,
      })),
    });
  } catch (error) {
    console.error("Admin users GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}


