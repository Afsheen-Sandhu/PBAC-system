import { useMemo } from "react";
import type { User } from "@/types/user";
import { SECTION_CONFIG, rolePanels, getRoleName } from "./dashboard-config";
import type { SectionConfigType, SectionKey } from "./dashboard-data";

type AvailableSection = SectionConfigType & { key: SectionKey };

interface DashboardSectionsProps {
  user: User;
  activeSectionKey?: SectionKey;
}

export default function DashboardSections({
  user,
  activeSectionKey,
}: DashboardSectionsProps) {
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";
  const panel = rolePanels[roleName] ?? rolePanels.default;

  const availableSections = useMemo<AvailableSection[]>(() => {
    if (!user?.permissions?.length) return [];
    return Object.entries(SECTION_CONFIG)
      .map(([key, section]) => {
        const hasAnyPermission = section.requirements.some((perm) =>
          user.permissions?.includes(perm)
        );
        if (!hasAnyPermission) return null;
        return { ...section, key: key as SectionKey };
      })
      .filter((section): section is AvailableSection => Boolean(section));
  }, [user?.permissions]);

  const filteredSections = useMemo(() => {
    if (!activeSectionKey) return availableSections;
    return availableSections.filter(
      (section) => section.key === activeSectionKey
    );
  }, [availableSections, activeSectionKey]);

  const hasAccess = filteredSections.length > 0;
  const emptyMessage = activeSectionKey
    ? "You currently don’t have permissions assigned for this section. Please contact an administrator if you believe this is an error."
    : "You currently don’t have permissions assigned. Please contact an administrator if you believe this is an error.";

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">{panel.title}</h2>
      <p className="mt-2 text-muted-foreground">{panel.description}</p>
      {!hasAccess ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.key}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3">{section.feature(user)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
