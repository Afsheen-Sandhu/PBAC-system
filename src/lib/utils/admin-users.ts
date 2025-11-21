type SerializedPermission = {
  id: string;
  name: string;
};

type SerializedRole = {
  id: string;
  name: string;
  permissions?: SerializedPermission[];
};

const serializePermissions = (permissions?: any[]): SerializedPermission[] =>
  permissions?.map((perm: any) => ({
    id: perm._id.toString(),
    name: perm.name,
  })) ?? [];

export const serializePermission = (permission: any): SerializedPermission => ({
  id: permission._id.toString(),
  name: permission.name,
});

interface SerializeRoleOptions {
  includePermissions?: boolean;
}

export const serializeRole = (
  role: any,
  options: SerializeRoleOptions = { includePermissions: true }
): SerializedRole => ({
  id: role._id.toString(),
  name: role.name,
  ...(options.includePermissions && {
    permissions: serializePermissions(role.permissions),
  }),
});

interface SerializeUserOptions {
  includeRolePermissions?: boolean;
}

export const serializeUser = (
  user: any,
  options: SerializeUserOptions = { includeRolePermissions: true }
) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
    ? {
        id: user.role._id.toString(),
        name: user.role.name,
        ...(options.includeRolePermissions && {
          permissions: serializePermissions(user.role.permissions),
        }),
      }
    : null,
  permissions: serializePermissions(user.permissions),
});


