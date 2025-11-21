import AdminUserManager from "@/components/layout/dashboard/admin/user-manager";
import DashboardHeader from "@/components/layout/dashboard/overview/dashboard-header";
import DashboardSidebar from "@/components/layout/dashboard/dashboard-sidebar";
import { getDashboardUser } from "@/lib/utils/dashboard";
import { getRoleName } from "@/components/layout/dashboard/overview/dashboard-config";

export default async function UserManagementPage() {
  const user = await getDashboardUser();
  const roleName = getRoleName(user.role as any)?.toLowerCase() ?? "default";
  const isAdmin = roleName === "admin";

  return (
    <section className="mt-10 px-6 pb-16 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        <div className="flex-1 space-y-8">
          <DashboardHeader user={user} />
          <section className="scroll-mt-16">
            <AdminUserManager />
          </section>
        </div>
      </div>
    </section>
  );
}


