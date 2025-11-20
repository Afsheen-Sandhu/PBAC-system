import { memo } from "react";
import type { AdminUser, PermissionItem, RoleInfo } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";

interface UserRowProps {
  user: AdminUser;
  roles: RoleInfo[];
  permissions: PermissionItem[];
  onRoleChange: (userId: string, roleId: string) => void;
  onPermissionToggle: (
    user: AdminUser,
    permissionId: string,
    checked: boolean
  ) => void;
}

const UserRow = memo(
  ({
    user,
    roles,
    permissions,
    onRoleChange,
    onPermissionToggle,
  }: UserRowProps) => {
    return (
      <TableRow>
        <TableCell>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </TableCell>
        <TableCell>
          <select
            className="w-full rounded-md border bg-background px-2 py-1 text-sm"
            value={user.role?.id ?? ""}
            onChange={(e) => onRoleChange(user._id, e.target.value || "")}
          >
            <option value="">No Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => {
              const checked = user.permissions?.some(
                (perm) => perm.id === permission.id
              );
              return (
                <label
                  key={permission.id}
                  className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                >
                  <Checkbox
                    checked={checked}
                    onChange={(e) =>
                      onPermissionToggle(user, permission.id, e.target.checked)
                    }
                  />
                  {permission.name}
                </label>
              );
            })}
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

UserRow.displayName = "UserRow";

export { UserRow };
