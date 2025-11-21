import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { connectToDB } from "@/lib/mongo/mongo";
import Permission from "@/lib/models/Permission";
import { serializePermission } from "@/lib/utils/admin-users";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const permissions = await Permission.find({}).lean();

    return NextResponse.json({
      permissions: permissions.map((permission) =>
        serializePermission(permission)
      ),
    });
  } catch (error) {
    console.error("Admin permissions GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load permissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const body = (await req.json()) as {
      name?: string;
      description?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Permission name is required" },
        { status: 400 }
      );
    }

    const normalizedName = body.name.trim();
    const existing = await Permission.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Permission with that name already exists" },
        { status: 400 }
      );
    }

    const permission = await Permission.create({
      name: normalizedName,
      description: body.description?.trim() || undefined,
    });

    return NextResponse.json(
      { permission: serializePermission(permission) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin permission POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create permission" },
      { status: 500 }
    );
  }
}


