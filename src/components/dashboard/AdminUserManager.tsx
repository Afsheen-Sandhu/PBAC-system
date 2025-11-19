"use client";

import {
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
} from "@/services/userApi";
import type { AdminUser, PermissionItem, RoleInfo } from "@/types/user";
import { useState } from "react";

export default function AdminUserManager() {
  const { data, isLoading, isError, error, refetch } = useGetAdminUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow">
        <p className="text-sm text-muted-foreground">Loading users…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border bg-destructive/10 p-6 text-destructive">
        <p className="font-medium">Failed to load users.</p>
        <p className="text-sm text-destructive/80">
          {(error as any)?.data?.error || "Please try again later."}
        </p>
        <button
          className="mt-3 rounded-md border px-3 py-1 text-sm"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleRoleChange = async (userId: string, roleId: string) => {
    setActiveUserId(userId);
    await updateUser({ userId, roleId: roleId || null });
    setActiveUserId(null);
  };

  const handlePermissionToggle = async (
    user: AdminUser,
    permissionId: string,
    checked: boolean
  ) => {
    const currentIds = user.permissions?.map((p) => p.id) ?? [];
    const nextIds = checked
      ? Array.from(new Set([...currentIds, permissionId]))
      : currentIds.filter((id) => id !== permissionId);

    setActiveUserId(user._id);
    await updateUser({ userId: user._id, permissionIds: nextIds });
    setActiveUserId(null);
  };

  const isUserUpdating = (userId: string) =>
    isUpdating && activeUserId === userId;

  return (
    <section className="rounded-xl border bg-card p-6 shadow">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Assign roles and fine-tune permissions for every account.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2 pr-4 font-semibold">User</th>
              <th className="py-2 pr-4 font-semibold">Role</th>
              <th className="py-2 pr-4 font-semibold">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.users.map((user) => (
              <tr key={user._id}>
                <td className="py-3 pr-4">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="py-3 pr-4">
                  <select
                    className="w-full rounded-md border bg-background px-2 py-1 text-sm"
                    value={user.role?.id ?? ""}
                    disabled={isUserUpdating(user._id)}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value || "")
                    }
                  >
                    <option value="">No Role</option>
                    {data.roles.map((role: RoleInfo) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {data.permissions.map((permission: PermissionItem) => {
                      const checked = user.permissions?.some(
                        (perm) => perm.id === permission.id
                      );
                      return (
                        <label
                          key={permission.id}
                          className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={isUserUpdating(user._id)}
                            onChange={(e) =>
                              handlePermissionToggle(
                                user,
                                permission.id,
                                e.target.checked
                              )
                            }
                          />
                          {permission.name}
                        </label>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


