import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo/mongo";
import { requireAdmin } from "@/lib/auth/auth";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import { revalidatePath } from "next/cache";
import { serializeUser } from "@/lib/utils/admin-users";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const body = await req.json();
    const { roleId, permissionIds } = body as {
      roleId?: string | null;
      permissionIds?: string[];
    };

    const update: Record<string, any> = {};

    if (roleId !== undefined) {
      if (roleId) {
        const roleExists = await Role.exists({ _id: roleId });
        if (!roleExists) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 400 }
          );
        }
        update.role = roleId;
      } else {
        update.role = null;
      }
    }

    if (permissionIds !== undefined) {
      if (permissionIds.length > 0) {
        const perms = await Permission.find({
          _id: { $in: permissionIds },
        }).select("_id");
        if (perms.length !== permissionIds.length) {
          return NextResponse.json(
            { error: "One or more permissions are invalid" },
            { status: 400 }
          );
        }
      }
      update.permissions = permissionIds;
    }

    const updatedUser = await User.findByIdAndUpdate(id, update, {
      new: true,
    })
      .populate({ path: "role", model: Role, select: "name" })
      .populate({ path: "permissions", model: Permission, select: "name" });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    revalidatePath("/dashboard");

    return NextResponse.json({
      user: serializeUser(updatedUser, { includeRolePermissions: false }),
    });
  } catch (error) {
    console.error("Admin user update failed:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
