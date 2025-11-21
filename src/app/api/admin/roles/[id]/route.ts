import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { connectToDB } from "@/lib/mongo/mongo";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import User from "@/lib/models/User";
import { serializeRole } from "@/lib/utils/admin-users";
import { revalidatePath } from "next/cache";

interface Params {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const body = (await req.json()) as {
      name?: string;
      description?: string | null;
      permissionIds?: string[];
    };

    const update: Record<string, any> = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: "Role name cannot be empty" },
          { status: 400 }
        );
      }

      const normalizedName = body.name.trim();
      const conflict = await Role.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "Another role already uses that name" },
          { status: 400 }
        );
      }

      update.name = normalizedName;
    }

    if (body.description !== undefined) {
      update.description = body.description?.trim() || undefined;
    }

    if (body.permissionIds !== undefined) {
      const permissionIds = body.permissionIds.filter(Boolean);
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
      update.permissions = permissionIds;
    }

    const updatedRole = await Role.findByIdAndUpdate(id, update, {
      new: true,
    }).populate({
      path: "permissions",
      model: Permission,
      select: "name description",
    });

    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    revalidatePath("/dashboard");

    return NextResponse.json({ role: serializeRole(updatedRole) });
  } catch (error) {
    console.error("Admin role PATCH failed:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    await User.updateMany({ role: id }, { $set: { role: null } });

    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin role DELETE failed:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}


