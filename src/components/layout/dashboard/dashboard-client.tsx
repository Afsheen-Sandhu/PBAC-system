"use client";

import { useEffect } from "react";
import type { User } from "@/types/user";
import { useAppDispatch } from "@/lib/hooks/store-hooks";
import { setAuth } from "@/lib/store/slices/auth-slice";
import DashboardHeader from "./dashboard-header";
import DashboardSections from "./dashboard-sections";
import DashboardSidebar from "./dashboard-sidebar";
import { getRoleName } from "./dashboard-config";

interface DashboardClientProps {
  user: User;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuth({ user, token: null }));
  }, [user, dispatch]);

  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const isAdmin = roleName === "admin";

  return (
    <section className=" mt-12  px-4 pb-16">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        <div className="flex-1 space-y-8">
          <div className="space-y-8 scroll-mt-16">
            <DashboardHeader user={user} />
            <DashboardSections user={user} />
          </div>
        </div>
      </div>
    </section>
  );
}
