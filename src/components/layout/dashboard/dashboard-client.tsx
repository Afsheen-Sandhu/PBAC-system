"use client";

import { useEffect } from "react";
import type { User } from "@/types/user";
import AdminUserManager from "@/components/layout/dashboard/admin-user-manager";
import AdminRolePermissionManager from "@/components/layout/dashboard/admin-role-permission-manager";
import { useAppDispatch } from "@/lib/hooks/store-hooks";
import { setAuth } from "@/lib/store/slices/auth-slice";
import DashboardHeader from "./dashboard-header";
import DashboardSections from "./dashboard-sections";
import DashboardSidebar from "./dashboard-sidebar";
import { getRoleName } from "./dashboard-config";

export default function DashboardClient({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuth({ user, token: null }));
  }, [user, dispatch]);

  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const isAdmin = roleName === "admin";

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 pb-16">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        <div className="flex-1 space-y-8">
          <div id="dashboard-overview" className="space-y-8 scroll-mt-16">
            <DashboardHeader user={user} />
            <DashboardSections user={user} />
          </div>
          {isAdmin && (
            <>
              <section id="role-permissions" className="scroll-mt-16">
                <AdminRolePermissionManager />
              </section>
              <section id="user-management" className="scroll-mt-16">
                <AdminUserManager />
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
