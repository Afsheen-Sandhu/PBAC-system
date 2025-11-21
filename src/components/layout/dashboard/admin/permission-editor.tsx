"use client";

import type { PermissionItem } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2 } from "lucide-react";

export type PermissionFormState = {
  id: string | null;
  name: string;
  description: string;
};

const textFieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

interface PermissionEditorProps {
  permissionForm: PermissionFormState;
  permissions: PermissionItem[];
  permissionsLoading: boolean;
  permissionsStatusMessage: string | null;
  isSavingPermission: boolean;
  onPermissionFieldChange: (
    field: keyof PermissionFormState,
    value: string
  ) => void;
  onSubmitPermission: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetPermission: () => void;
  onSelectPermission: (permission: PermissionItem) => void;
  onDeletePermission: (permissionId: string) => void;
}

export default function PermissionEditor({
  permissionForm,
  permissions,
  permissionsLoading,
  permissionsStatusMessage,
  isSavingPermission,
  onPermissionFieldChange,
  onSubmitPermission,
  onResetPermission,
  onSelectPermission,
  onDeletePermission,
}: PermissionEditorProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {permissionForm.id ? "Edit Permission" : "Create Permission"}
          </h3>
          {permissionForm.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetPermission}
            >
              Cancel
            </Button>
          )}
        </div>

        <form onSubmit={onSubmitPermission} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Permission name
            </label>
            <Input
              type="text"
              value={permissionForm.name}
              onChange={(e) => onPermissionFieldChange("name", e.target.value)}
              placeholder="e.g., create_course"
              className={textFieldClass}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={permissionForm.description}
              onChange={(e) =>
                onPermissionFieldChange("description", e.target.value)
              }
              placeholder="Optional description"
              className={`${textFieldClass} min-h-[80px]`}
            />
          </div>

          <Button type="submit" disabled={isSavingPermission}>
            {permissionForm.id ? "Update permission" : "Create permission"}
          </Button>
        </form>
      </div>

      <div className="mt-4 space-y-3">
        {permissionsLoading && (
          <p className="text-sm text-muted-foreground">
            Loading permissions…
          </p>
        )}
        {permissionsStatusMessage && (
          <p className="text-sm text-destructive">
            {permissionsStatusMessage}
          </p>
        )}
        {!permissionsLoading && permissions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No permissions created yet.
          </p>
        )}
        <div className="divide-y rounded-lg border bg-card">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <div className="space-y-1">
                <p className="font-semibold">{permission.name}</p>
                {permission.description && (
                  <p className="text-sm text-muted-foreground max-w-xl">
                    {permission.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectPermission(permission)}
                  disabled={isSavingPermission}
                >
                  <span className="sr-only">Edit permission</span>
                  <Edit2 className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive"
                  onClick={() => onDeletePermission(permission.id)}
                  disabled={isSavingPermission}
                >
                  <span className="sr-only">Delete permission</span>
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

