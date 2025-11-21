import { SECTION_CONFIG, rolePanels } from "./dashboard-data";

export { SECTION_CONFIG, rolePanels };

export function getRoleName(
  role: string | { name?: string } | null | undefined
) {
  if (!role) return null;
  if (typeof role === "string") return role;
  return role.name ?? null;
}
