"use client";

import { useEffect } from "react";
import type { User } from "@/types/user";
import AdminUserManager from "@/components/layout/dashboard/admin-user-manager";
import { useAppDispatch } from "@/lib/hooks/store-hooks";
import { setAuth } from "@/lib/store/slices/auth-slice";
import DashboardHeader from "./dashboard-header";
import DashboardSections from "./dashboard-sections";
import { getRoleName } from "./dashboard-config";

export default function DashboardClient({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuth({ user, token: null }));
  }, [user, dispatch]);

  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const isAdmin = roleName === "admin";

  return (
    <section className="mx-auto mt-12 max-w-7xl space-y-8 px-4 pb-16">
      <DashboardHeader user={user} />
      <DashboardSections user={user} />
      {isAdmin && <AdminUserManager />}
    </section>
  );
}
