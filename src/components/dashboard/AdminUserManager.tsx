"use client";

import {
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
} from "@/services/userApi";
import type { AdminUser, PermissionItem, RoleInfo } from "@/types/user";
import { useCallback } from "react";
import { UserRow } from "./UserRow";
import { useDispatch } from "react-redux";
import { setLoading } from "@/lib/store/slices/counter/loading-slice";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export default function AdminUserManager() {
  const { data, isLoading, isError, error, refetch } = useGetAdminUsersQuery();
  const [updateUser] = useUpdateAdminUserMutation();
  const dispatch = useDispatch();

  const handleRoleChange = useCallback(
    async (userId: string, roleId: string) => {
      dispatch(
        setLoading({ isLoading: true, message: "Updating user role..." })
      );
      try {
        await updateUser({ userId, roleId: roleId || null });
      } catch (err) {
        console.error("Failed to update role:", err);
      } finally {
        dispatch(setLoading({ isLoading: false }));
      }
    },
    [updateUser, dispatch]
  );

  const handlePermissionToggle = useCallback(
    async (user: AdminUser, permissionId: string, checked: boolean) => {
      dispatch(
        setLoading({
          isLoading: true,
          message: "Updating user permissions...",
        })
      );
      const currentIds = user.permissions?.map((p) => p.id) ?? [];
      const nextIds = checked
        ? Array.from(new Set([...currentIds, permissionId]))
        : currentIds.filter((id) => id !== permissionId);

      try {
        await updateUser({ userId: user._id, permissionIds: nextIds });
      } catch (err) {
        console.error("Failed to update permissions:", err);
      } finally {
        dispatch(setLoading({ isLoading: false }));
      }
    },
    [updateUser, dispatch]
  );

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

  return (
    <section className="rounded-xl border bg-card p-6 shadow">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Assign roles and fine-tune permissions for every account.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                roles={data.roles}
                permissions={data.permissions}
                onRoleChange={handleRoleChange}
                onPermissionToggle={handlePermissionToggle}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

