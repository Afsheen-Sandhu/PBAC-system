import type { User } from "@/types/user";
import { getRoleName } from "./dashboard-config";

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const roleName = getRoleName(user?.role)?.toLowerCase() ?? "default";

  return (
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
      </div>
    </header>
  );
}
