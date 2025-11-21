import type { AdminUser, PermissionItem, RoleInfo } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRow, TableCell } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { memo } from "react";
import { Loader2 } from "lucide-react";

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
  rowLoading: boolean;
}

const UserTable = memo(
  ({
    user,
    roles,
    permissions,
    onRoleChange,
    onPermissionToggle,
    rowLoading,
  }: UserRowProps) => {
    return (
      <TableRow className="relative">
        <TableCell>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </TableCell>

        <TableCell>
          <Select
            value={user.role?.id ?? ""}
            options={roles}
            defaultOptionText="No Role"
            disabled={rowLoading}
            onChange={(e) => onRoleChange(user._id, e.target.value || "")}
          />
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
                    disabled={rowLoading}
                    onChange={(e) =>
                      onPermissionToggle(
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
        </TableCell>

      
        {rowLoading && (
          <td className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </td>
        )}
      </TableRow>
    );
  }
);

UserTable.displayName = "UserTable";

export { UserTable };
