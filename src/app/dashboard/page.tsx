import { getUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import User from "@/lib/models/User";
import Role from "@/lib/models/Role";
import Permission from "@/lib/models/Permission";
import { connectToDB } from "@/lib/mongo/mongo";

async function getUserDetails(userId: string) {
  await connectToDB();
  const user = await User.findById(userId)
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
    .lean();

  if (!user) {
    return null;
  }

const { password, ...userWithoutPassword } = user instanceof Array ? user[0] : user;
  return userWithoutPassword;
}

export default async function DashboardPage() {
  const session = getUser();

  if (!session) {
    redirect("/login");
  }

  const user = await getUserDetails(session.userId);

  if (!user) {
    redirect("/login");
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return <DashboardClient user={plainUser} />;
}
