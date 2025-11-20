"use client";

import Link from "next/link";
import LogoutButton from "@/components/ui/logout-button";
import { useMemo } from "react";
import type { User } from "@/types/user";
import AdminUserManager from "@/components/dashboard/AdminUserManager";

const SECTION_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    feature: (user: User) => React.ReactNode | null;
    requirements: string[];
  }
> = {
  courseBuilder: {
    title: "Courses",
    description: "Create, edit, or delete courses you manage.",
    requirements: ["create_course", "edit_course", "delete_course"],
    feature: (user) => {
      const perms = user.permissions || [];
      const actions = [
        perms.includes("create_course") && "Create new course",
        perms.includes("edit_course") && "Edit existing course",
        perms.includes("delete_course") && "Archive/delete course",
      ].filter(Boolean) as string[];

      if (!actions.length) return null;

      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You can manage the following course features:
          </p>
          <ul className="list-disc pl-5 text-sm">
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      );
    },
  },
  classroomOps: {
    title: "Classroom Ops",
    description: "Assign teachers, enroll students, and manage grades.",
    requirements: ["assign_teacher", "enroll_student", "grade_student"],
    feature: (user) => {
      const perms = user.permissions || [];
      const actions = [
        perms.includes("assign_teacher") && "Assign instructors",
        perms.includes("enroll_student") && "Enroll students",
        perms.includes("grade_student") && "Record & publish grades",
      ].filter(Boolean) as string[];

      if (!actions.length) return null;

      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Operational access granted:
          </p>
          <ul className="list-disc pl-5 text-sm">
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      );
    },
  },
  analytics: {
    title: "Progress & Insights",
    description: "Monitor course progress and student results.",
    requirements: ["view_course", "view_results"],
    feature: (user) => {
      const perms = user.permissions || [];
      const canViewCourse = perms.includes("view_course");
      const canViewResults = perms.includes("view_results");

      if (!canViewCourse && !canViewResults) return null;

      return (
        <div className="space-y-1 text-sm text-muted-foreground">
          {canViewCourse && <p>✔ Access to course outlines & schedules.</p>}
          {canViewResults && <p>✔ Access to performance dashboards.</p>}
        </div>
      );
    },
  },
};

const rolePanels: Record<
  string,
  { title: string; description: string; highlights: string[] }
> = {
  default: {
    title: "Dashboard",
    description: "Access the features that match your school role.",
    highlights: ["Personalized tools", "Notifications", "Quick actions"],
  },
};

function getRoleName(role: string | { name?: string } | null | undefined) {
  if (!role) return null;
  if (typeof role === "string") return role;
  return role.name ?? null;
}

export default function DashboardClient({ user }: { user: User }) {
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const panel = rolePanels[roleName] ?? rolePanels.default;
  const isAdmin = roleName === "admin";

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
    <section className="mx-auto mt-12 max-w-4xl space-y-8 px-4 pb-16">
      <header className="rounded-xl border bg-card p-6 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold">{user.name || user.email}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Role: <span className="capitalize">{roleName}</span>
            </p>
          </div>
          <LogoutButton className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80" />
        </div>
      </header>

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">{panel.title}</h2>
        <p className="mt-2 text-muted-foreground">{panel.description}</p>
        {availableSections.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You currently don’t have permissions assigned. Please contact an
            administrator if you believe this is an error.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {availableSections.map((section) => (
              <div
                key={section.title}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{section.feature(user)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdmin && <AdminUserManager />}
    </section>
  );
}
