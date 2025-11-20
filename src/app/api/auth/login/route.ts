import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import { connectToDB } from "@/lib/mongo/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email })
      .populate({
        path: "role",
        model: Role,
        select: "name permissions",
      })
      .populate({
        path: "permissions",
        model: Permission,
        select: "name",
      });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Prepare payload for JWT
    const rolePermissionNames =
      user.role && typeof user.role === "object"
        ? user.role.permissions?.map((perm: any) => perm.name)
        : [];

    const directPermissionNames =
      user.permissions?.map((perm: any) => perm.name) ?? [];

    const mergedPermissions = Array.from(
      new Set([...(rolePermissionNames || []), ...directPermissionNames])
    );

    const roleInfo =
      user.role && typeof user.role === "object"
        ? {
            id: user.role._id,
            name: user.role.name,
          }
        : null;

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: roleInfo?.name ?? null,
      permissions: mergedPermissions,
    };

    const secret = process.env.JWT_SECRET || "default_dummy_secret";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    const { password: _, ...userData } = user.toObject();
    const sanitizedUser = {
      ...userData,
      role: roleInfo,
    };

    const response = NextResponse.json({
      message: "Login successful",
      user: { ...sanitizedUser, role: roleInfo, permissions: mergedPermissions },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login Error:", error.message, error.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Login Error:", error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
