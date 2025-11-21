"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { User } from "@/types/user";
import { getRoleName } from "./dashboard-config";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  user: User;
  isAdmin: boolean;
};

export default function DashboardSidebar({
  user,
  isAdmin,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";

  const navLinks = useMemo(() => {
    const links = [{ label: "Overview", href: "/dashboard" }];
    if (isAdmin) {
      links.push(
        { label: "Roles & permissions", href: "/dashboard/roles-permissions" },
        { label: "User management", href: "/dashboard/user-management" }
      );
    }
    return links;
  }, [isAdmin]);

  return (
    <aside className="w-full lg:w-72">
      <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Signed in as
          </p>
          <p className="text-lg font-semibold">{user.name ?? user.email}</p>
          <p className="text-sm text-muted-foreground">
            Role: <span className="capitalize">{roleName}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Navigation
          </p>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </aside>
  );
}


