"use client";

import type { RoleInfo, PermissionItem } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";

export type RoleFormState = {
  id: string | null;
  name: string;
  description: string;
  permissionIds: string[];
};

const textFieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

interface RoleEditorProps {
  roleForm: RoleFormState;
  roles: RoleInfo[];
  permissions: PermissionItem[];
  permissionsLoading: boolean;
  rolesLoading: boolean;
  rolesStatusMessage: string | null;
  isSavingRole: boolean;
  activePermissionIds: Set<string>;
  onRoleFieldChange: (field: keyof RoleFormState, value: string) => void;
  onSubmitRole: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetRole: () => void;
  onTogglePermission: (permissionId: string) => void;
  onSelectRole: (role: RoleInfo) => void;
  onDeleteRole: (roleId: string) => void;
}

export default function RoleEditor({
  roleForm,
  roles,
  permissions,
  permissionsLoading,
  rolesLoading,
  rolesStatusMessage,
  isSavingRole,
  activePermissionIds,
  onRoleFieldChange,
  onSubmitRole,
  onResetRole,
  onTogglePermission,
  onSelectRole,
  onDeleteRole,
}: RoleEditorProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {roleForm.id ? "Edit Role" : "Create Role"}
          </h3>
          {roleForm.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetRole}
            >
              Cancel
            </Button>
          )}
        </div>

        <form onSubmit={onSubmitRole} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Role name
            </label>
            <Input
              type="text"
              value={roleForm.name}
              onChange={(e) => onRoleFieldChange("name", e.target.value)}
              placeholder="e.g., Instructor"
              className={textFieldClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={roleForm.description}
              onChange={(e) => onRoleFieldChange("description", e.target.value)}
              placeholder="Optional role summary"
              className={`${textFieldClass} min-h-[80px]`}
            />
          </div>

          <div className="space-y-1">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Permissions
              </label>
              {permissionsLoading && (
                <span className="text-xs text-muted-foreground">Loading…</span>
              )}
            </div>
            <div className="rounded-md border bg-muted/40 p-3">
              {permissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No permissions yet. You can still save the role.
                </p>
              ) : (
                <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-start gap-2 rounded-md bg-background px-2 py-1 text-sm shadow-xs"
                    >
                      <Checkbox
                        checked={activePermissionIds.has(permission.id)}
                        onChange={() => onTogglePermission(permission.id)}
                        disabled={isSavingRole}
                      />
                      <div>
                        <p className="font-medium leading-snug">
                          {permission.name}
                        </p>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSavingRole}>
            {roleForm.id ? "Update role" : "Create role"}
          </Button>
        </form>
      </div>

      <div className="mt-4 space-y-3">
        {rolesLoading && (
          <p className="text-sm text-muted-foreground">Loading roles…</p>
        )}
        {rolesStatusMessage && (
          <p className="text-sm text-destructive">{rolesStatusMessage}</p>
        )}
        {!rolesLoading && roles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No roles have been created yet.
          </p>
        )}
        <div className="divide-y rounded-lg border bg-card">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex flex-wrap items-start justify-between gap-4 px-4 py-3"
            >
              <div className="space-y-1">
                <p className="font-semibold">{role.name}</p>
                {role.description && (
                  <p className="text-sm text-muted-foreground max-w-xl">
                    {role.description}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {role.permissions?.length ? (
                    role.permissions.map((perm) => (
                      <span
                        key={perm.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {perm.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No permissions assigned
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectRole(role)}
                  disabled={isSavingRole}
                >
                  <span className="sr-only">Edit role</span>
                  <Edit2 className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive"
                  onClick={() => onDeleteRole(role.id)}
                  disabled={isSavingRole}
                >
                  <span className="sr-only">Delete role</span>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

