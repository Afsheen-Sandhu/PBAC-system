import DashboardClient from "@/components/layout/dashboard/dashboard-client";
import { getDashboardUser } from "./utils";

export default async function DashboardPage() {
  const user = await getDashboardUser();
  return <DashboardClient user={user} />;
}
