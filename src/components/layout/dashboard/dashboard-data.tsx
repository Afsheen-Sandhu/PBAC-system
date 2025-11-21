import type { ReactNode } from "react";
import type { User } from "@/types/user";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export type SectionConfigType = {
  title: string;
  description: string;
  feature: (user: User) => ReactNode | null;
  requirements: string[];
  slug: string;
  icon: LucideIcon;
};

export const SECTION_CONFIG: Record<string, SectionConfigType> = {
  courseBuilder: {
    slug: "courses",
    icon: BookOpen,
    title: "Courses",
    description: "Create, edit, or delete courses you manage.",
    requirements: ["create_course", "edit_course", "delete_course"],
    feature: (user) => {
      const perms = user.permissions ?? [];

      const actions = [
        perms.includes("create_course") ? "Create new course" : null,
        perms.includes("edit_course") ? "Edit existing course" : null,
        perms.includes("delete_course") ? "Archive/delete course" : null,
      ].filter((item): item is string => Boolean(item));

      if (!actions.length) return null;

      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You can manage the following course features:
          </p>
          <ul className="space-y-1 text-sm">
            {actions.map((action) => (
              <li key={action} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },

  classroomOps: {
    slug: "classroom-ops",
    icon: GraduationCap,
    title: "Classroom Ops",
    description: "Assign teachers, enroll students, and manage grades.",
    requirements: ["assign_teacher", "enroll_student", "grade_student"],
    feature: (user) => {
      const perms = user.permissions ?? [];

      const actions = [
        perms.includes("assign_teacher") ? "Assign instructors" : null,
        perms.includes("enroll_student") ? "Enroll students" : null,
        perms.includes("grade_student") ? "Record & publish grades" : null,
      ].filter((item): item is string => Boolean(item));

      if (!actions.length) return null;

      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Operational access granted:
          </p>
          <ul className="space-y-1 text-sm">
            {actions.map((action) => (
              <li key={action} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },

  analytics: {
    slug: "analytics",
    icon: BarChart3,
    title: "Progress & Insights",
    description: "Monitor course progress and student results.",
    requirements: ["view_course", "view_results"],
    feature: (user) => {
      const perms = user.permissions ?? [];

      const canViewCourse = perms.includes("view_course");
      const canViewResults = perms.includes("view_results");

      if (!canViewCourse && !canViewResults) return null;

      return (
        <div className="space-y-3 text-sm text-muted-foreground">
          {canViewCourse && (
            <p className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              <span>Access to course outlines & schedules.</span>
            </p>
          )}
          {canViewResults && (
            <p className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              <span>Access to performance dashboards.</span>
            </p>
          )}
        </div>
      );
    },
  },
};

export type SectionKey = keyof typeof SECTION_CONFIG;

export const rolePanels: Record<
  string,
  { title: string; description: string; highlights: string[] }
> = {
  default: {
    title: "Dashboard",
    description: "Access the features that match your school role.",
    highlights: ["Personalized tools", "Notifications", "Quick actions"],
  },
};
