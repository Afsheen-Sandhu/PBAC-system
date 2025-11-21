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
import RoleEditor, {
  type RoleFormState,
} from "./role-editor";
import PermissionEditor, {
  type PermissionFormState,
} from "./permission-editor";

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

  const handleRoleFieldChange = (
    field: keyof RoleFormState,
    value: string
  ) => {
    setRoleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionFieldChange = (
    field: keyof PermissionFormState,
    value: string
  ) => {
    setPermissionForm((prev) => ({ ...prev, [field]: value }));
  };

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

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <RoleEditor
          roleForm={roleForm}
          roles={roles}
          permissions={permissions}
          permissionsLoading={permissionsLoading}
          rolesLoading={rolesLoading}
          rolesStatusMessage={rolesStatusMessage}
          isSavingRole={isSavingRole}
          activePermissionIds={activePermissionIds}
          onRoleFieldChange={handleRoleFieldChange}
          onSubmitRole={handleRoleSubmit}
          onResetRole={resetRoleForm}
          onTogglePermission={handleRolePermissionToggle}
          onSelectRole={handleSelectRole}
          onDeleteRole={handleRoleDelete}
        />
        <PermissionEditor
          permissionForm={permissionForm}
          permissions={permissions}
          permissionsLoading={permissionsLoading}
          permissionsStatusMessage={permissionsStatusMessage}
          isSavingPermission={isSavingPermission}
          onPermissionFieldChange={handlePermissionFieldChange}
          onSubmitPermission={handlePermissionSubmit}
          onResetPermission={resetPermissionForm}
          onSelectPermission={handleSelectPermission}
          onDeletePermission={handlePermissionDelete}
        />
      </div>
    </section>
  );
}


