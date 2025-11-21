"use client";

import Link from "next/link";
import type { User } from "@/types/user";
import { SECTION_CONFIG, getRoleName } from "./dashboard-config";
import { useMemo } from "react";

type DashboardSidebarProps = {
  user: User;
  isAdmin: boolean;
};

export default function DashboardSidebar({ user, isAdmin }: DashboardSidebarProps) {
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";

  const navLinks = useMemo(() => {
    const links = [{ label: "Dashboard", href: "#dashboard-overview" }];
    if (isAdmin) {
      links.push(
        { label: "Roles & permissions", href: "#role-permissions" },
        { label: "User management", href: "#user-management" }
      );
    }
    return links;
  }, [isAdmin]);

  const availableSections = useMemo(() => {
    if (!user?.permissions?.length) return [];
    return Object.values(SECTION_CONFIG)
      .map((section) => {
        const hasAnyPermission = section.requirements.some((perm) =>
          user.permissions?.includes(perm)
        );
        if (!hasAnyPermission) return null;
        return section;
      })
      .filter((section): section is (typeof SECTION_CONFIG)[string] =>
        Boolean(section)
      );
  }, [user?.permissions]);

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
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{link.label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Available tools
          </p>
          {availableSections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Permissions pending. Contact an administrator.
            </p>
          ) : (
            <ul className="space-y-2">
              {availableSections.map((section) => (
                <li
                  key={section.title}
                  className="rounded-md border border-dashed px-3 py-2"
                >
                  <p className="text-sm font-semibold">{section.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}


