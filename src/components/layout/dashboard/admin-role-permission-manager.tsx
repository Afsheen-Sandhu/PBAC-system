"use client";

import { useMemo, useState } from "react";
import type { RoleInfo, PermissionItem } from "@/types/user";
import {
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useGetAdminPermissionsQuery,
  useCreateAdminPermissionMutation,
  useUpdateAdminPermissionMutation,
  useDeleteAdminPermissionMutation,
} from "@/services/user-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const textFieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

type RoleFormState = {
  id: string | null;
  name: string;
  description: string;
  permissionIds: string[];
};

type PermissionFormState = {
  id: string | null;
  name: string;
  description: string;
};

const initialRoleForm: RoleFormState = {
  id: null,
  name: "",
  description: "",
  permissionIds: [],
};

const initialPermissionForm: PermissionFormState = {
  id: null,
  name: "",
  description: "",
};

export default function AdminRolePermissionManager() {
  const [roleForm, setRoleForm] = useState<RoleFormState>(initialRoleForm);
  const [permissionForm, setPermissionForm] =
    useState<PermissionFormState>(initialPermissionForm);

  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorData,
  } = useGetAdminRolesQuery();
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    isError: permissionsError,
    error: permissionsErrorData,
  } = useGetAdminPermissionsQuery();

  const [createRole, createRoleState] = useCreateAdminRoleMutation();
  const [updateRole, updateRoleState] = useUpdateAdminRoleMutation();
  const [deleteRole, deleteRoleState] = useDeleteAdminRoleMutation();

  const [createPermission, createPermissionState] =
    useCreateAdminPermissionMutation();
  const [updatePermission, updatePermissionState] =
    useUpdateAdminPermissionMutation();
  const [deletePermission, deletePermissionState] =
    useDeleteAdminPermissionMutation();

  const permissions = permissionsData?.permissions ?? [];
  const roles = rolesData?.roles ?? [];

  const isSavingRole =
    createRoleState.isLoading || updateRoleState.isLoading || deleteRoleState.isLoading;
  const isSavingPermission =
    createPermissionState.isLoading ||
    updatePermissionState.isLoading ||
    deletePermissionState.isLoading;

  const activePermissionIds = useMemo(
    () => new Set(roleForm.permissionIds),
    [roleForm.permissionIds]
  );

  const resetRoleForm = () => setRoleForm(initialRoleForm);
  const resetPermissionForm = () => setPermissionForm(initialPermissionForm);

  const handleRoleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!roleForm.name.trim()) return;

    const payload = {
      name: roleForm.name.trim(),
      description: roleForm.description.trim() || undefined,
      permissionIds: roleForm.permissionIds,
    };

    try {
      if (roleForm.id) {
        await updateRole({ roleId: roleForm.id, ...payload }).unwrap();
      } else {
        await createRole(payload).unwrap();
      }
      resetRoleForm();
    } catch (error) {
      console.error("Failed to save role", error);
    }
  };

  const handlePermissionSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!permissionForm.name.trim()) return;

    const payload = {
      name: permissionForm.name.trim(),
      description: permissionForm.description.trim() || undefined,
    };

    try {
      if (permissionForm.id) {
        await updatePermission({
          permissionId: permissionForm.id,
          ...payload,
        }).unwrap();
      } else {
        await createPermission(payload).unwrap();
      }
      resetPermissionForm();
    } catch (error) {
      console.error("Failed to save permission", error);
    }
  };

  const handleSelectRole = (role: RoleInfo) => {
    setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions?.map((perm) => perm.id) ?? [],
    });
  };

  const handleSelectPermission = (permission: PermissionItem) => {
    setPermissionForm({
      id: permission.id,
      name: permission.name,
      description: permission.description || "",
    });
  };

  const handleRolePermissionToggle = (permissionId: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissionIds.includes(permissionId);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((id) => id !== permissionId)
          : [...prev.permissionIds, permissionId],
      };
    });
  };

  const handleRoleDelete = async (roleId: string) => {
    if (!window.confirm("Delete this role? Users assigned to it will lose it.")) {
      return;
    }

    try {
      await deleteRole(roleId).unwrap();
      if (roleForm.id === roleId) {
        resetRoleForm();
      }
    } catch (error) {
      console.error("Failed to delete role", error);
    }
  };

  const handlePermissionDelete = async (permissionId: string) => {
    if (
      !window.confirm(
        "Delete this permission? It will be removed from all roles and users."
      )
    ) {
      return;
    }

    try {
      await deletePermission(permissionId).unwrap();
      if (permissionForm.id === permissionId) {
        resetPermissionForm();
      }
    } catch (error) {
      console.error("Failed to delete permission", error);
    }
  };

  const rolesStatusMessage =
    rolesError && rolesErrorData
      ? (rolesErrorData as any)?.data?.error || "Unable to load roles."
      : null;
  const permissionsStatusMessage =
    permissionsError && permissionsErrorData
      ? (permissionsErrorData as any)?.data?.error ||
        "Unable to load permissions."
      : null;

  return (
    <section className="rounded-xl border bg-card p-6 shadow">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">
          Define role templates and manage the permissions they grant.
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {roleForm.id ? "Edit Role" : "Create Role"}
              </h3>
              {roleForm.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetRoleForm}
                >
                  Cancel
                </Button>
              )}
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Role name
                </label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Instructor"
                  className={textFieldClass}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional role summary"
                  className={`${textFieldClass} min-h-[80px]`}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Permissions
                  </label>
                  {permissionsLoading && (
                    <span className="text-xs text-muted-foreground">
                      Loading…
                    </span>
                  )}
                </div>
                {permissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No permissions yet. You can still save the role.
                  </p>
                ) : (
                  <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-3">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={activePermissionIds.has(permission.id)}
                          onChange={() =>
                            handleRolePermissionToggle(permission.id)
                          }
                          disabled={isSavingRole}
                        />
                        <span>{permission.name}</span>
                      </label>
                    ))}
                  </div>
                )}
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
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-lg border bg-background p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">{role.name}</p>
                    {role.description && (
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {role.permissions?.length ? (
                        role.permissions.map((perm) => (
                          <span
                            key={perm.id}
                            className="rounded-full border px-2 py-0.5 text-xs"
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
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSelectRole(role)}
                      disabled={isSavingRole}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive"
                      onClick={() => handleRoleDelete(role.id)}
                      disabled={isSavingRole}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {permissionForm.id ? "Edit Permission" : "Create Permission"}
              </h3>
              {permissionForm.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetPermissionForm}
                >
                  Cancel
                </Button>
              )}
            </div>

            <form onSubmit={handlePermissionSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Permission name
                </label>
                <input
                  type="text"
                  value={permissionForm.name}
                  onChange={(e) =>
                    setPermissionForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., create_course"
                  className={textFieldClass}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={permissionForm.description}
                  onChange={(e) =>
                    setPermissionForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
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
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-start justify-between rounded-lg border bg-background p-4 shadow-sm"
              >
                <div>
                  <p className="text-base font-semibold">{permission.name}</p>
                  {permission.description && (
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSelectPermission(permission)}
                    disabled={isSavingPermission}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive"
                    onClick={() => handlePermissionDelete(permission.id)}
                    disabled={isSavingPermission}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


