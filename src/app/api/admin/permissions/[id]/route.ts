import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { connectToDB } from "@/lib/mongo/mongo";
import Permission from "@/lib/models/Permission";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import { serializePermission } from "@/lib/utils/admin-users";
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
    };

    const update: Record<string, any> = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: "Permission name cannot be empty" },
          { status: 400 }
        );
      }

      const normalizedName = body.name.trim();
      const conflict = await Permission.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "Another permission already uses that name" },
          { status: 400 }
        );
      }

      update.name = normalizedName;
    }

    if (body.description !== undefined) {
      update.description = body.description?.trim() || undefined;
    }

    const permission = await Permission.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    revalidatePath("/dashboard");

    return NextResponse.json({ permission: serializePermission(permission) });
  } catch (error) {
    console.error("Admin permission PATCH failed:", error);
    return NextResponse.json(
      { error: "Failed to update permission" },
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

    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }

    await Role.updateMany(
      { permissions: id },
      { $pull: { permissions: id } }
    );

    await User.updateMany({ permissions: id }, { $pull: { permissions: id } });

    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin permission DELETE failed:", error);
    return NextResponse.json(
      { error: "Failed to delete permission" },
      { status: 500 }
    );
  }
}


