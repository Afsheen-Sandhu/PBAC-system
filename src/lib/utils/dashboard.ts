import { getUser } from "@/lib/auth/session";
import { connectToDB } from "@/lib/mongo/mongo";
import Permission from "@/lib/models/Permission";
import Role from "@/lib/models/Role";
import User from "@/lib/models/User";
import type { User as UserType } from "@/types/user";
import { redirect } from "next/navigation";

async function hydrateUser(userId: string) {
  await connectToDB();
  const user = (await User.findById(userId)
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
    .lean()) as UserType | null;

  if (!user) {
    return null;
  }

  const { password, ...rest } = user as any;
  const userPerms = (user.permissions ?? []).map((perm: any) => perm.name);

  return {
    ...rest,
    permissions: userPerms,
  } as UserType;
}

export async function getDashboardUser() {
  const session = await getUser();

  if (!session) {
    redirect("/login");
  }

  const user = await hydrateUser(session.userId);

  if (!user) {
    redirect("/login");
  }

  return JSON.parse(JSON.stringify(user)) as UserType;
}

