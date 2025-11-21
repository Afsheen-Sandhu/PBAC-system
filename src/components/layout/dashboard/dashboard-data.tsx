import type { ReactNode } from "react";
import type { User } from "@/types/user";

export type SectionConfigType = {
  title: string;
  description: string;
  feature: (user: User) => ReactNode | null;
  requirements: string[];
};

export const SECTION_CONFIG: Record<string, SectionConfigType> = {
  courseBuilder: {
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
      const perms = user.permissions ?? [];

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
