import { useMemo } from "react";
import type { User } from "@/types/user";
import { SECTION_CONFIG, rolePanels, getRoleName } from "./dashboard-config";

interface DashboardSectionsProps {
  user: User;
}

export default function DashboardSections({ user }: DashboardSectionsProps) {
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const panel = rolePanels[roleName] ?? rolePanels.default;

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
  );
}
