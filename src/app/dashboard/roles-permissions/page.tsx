import AdminRolePermissionManager from "@/components/layout/dashboard/admin-role-permission-manager";
import DashboardHeader from "@/components/layout/dashboard/dashboard-header";
import DashboardSidebar from "@/components/layout/dashboard/dashboard-sidebar";
import { getDashboardUser } from "../utils";
import { getRoleName } from "@/components/layout/dashboard/dashboard-config";

export default async function RolesPermissionsPage() {
  const user = await getDashboardUser();
  const roleName = getRoleName(user.role as any)?.toLowerCase() ?? "default";
  const isAdmin = roleName === "admin";

  return (
    <section className="mt-10 px-4 pb-16 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        <div className="flex-1 space-y-8">
          <DashboardHeader user={user} />
          <section className="scroll-mt-16">
            <AdminRolePermissionManager />
          </section>
        </div>
      </div>
    </section>
  );
}


