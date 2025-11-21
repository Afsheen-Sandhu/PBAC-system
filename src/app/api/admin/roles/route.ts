import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { connectToDB } from "@/lib/mongo/mongo";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import { serializeRole } from "@/lib/utils/admin-users";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const roles = await Role.find({})
      .populate({
        path: "permissions",
        model: Permission,
        select: "name description",
      })
      .lean();

    return NextResponse.json({
      roles: roles.map((role) => serializeRole(role)),
    });
  } catch (error) {
    console.error("Admin roles GET failed:", error);
    return NextResponse.json(
      { error: "Failed to load roles" },
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
      permissionIds?: string[];
    };

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }

    const normalizedName = body.name.trim();
    const existingRole = await Role.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "Role with that name already exists" },
        { status: 400 }
      );
    }

    const permissionIds = body.permissionIds?.filter(Boolean) ?? [];
    if (permissionIds.length) {
      const validPermissions = await Permission.find({
        _id: { $in: permissionIds },
      }).select("_id");

      if (validPermissions.length !== permissionIds.length) {
        return NextResponse.json(
          { error: "One or more permissions are invalid" },
          { status: 400 }
        );
      }
    }

    const role = await Role.create({
      name: normalizedName,
      description: body.description?.trim() || undefined,
      permissions: permissionIds,
    });

    const populatedRole = await role.populate({
      path: "permissions",
      model: Permission,
      select: "name description",
    });

    return NextResponse.json(
      { role: serializeRole(populatedRole) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin role POST failed:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}


