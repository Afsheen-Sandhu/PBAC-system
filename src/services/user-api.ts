import { apiSlice } from "./api";
import {
  User,
  LoginRequest,
  LoginResponse,
  AdminUsersResponse,
  RoleInfo,
  PermissionItem,
} from "@/types/user";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "get",
      }),
      providesTags: ["User"],
    }),

    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),

    signupUser: builder.mutation<
      LoginResponse,
      Omit<LoginRequest, "email" | "password"> & {
        name: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => ({
        url: "/api/auth/signup",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),

    getAdminUsers: builder.query<AdminUsersResponse, void>({
      query: () => ({
        url: "/api/admin/users",
        method: "get",
      }),
      providesTags: ["AdminUsers"],
    }),

    updateAdminUser: builder.mutation<
      { user: AdminUsersResponse["users"][number] },
      { userId: string; roleId?: string | null; permissionIds?: string[] }
    >({
      query: ({ userId, ...body }) => ({
        url: `/api/admin/users/${userId}`,
        method: "patch",
        data: body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    getAdminRoles: builder.query<{ roles: RoleInfo[] }, void>({
      query: () => ({
        url: "/api/admin/roles",
        method: "get",
      }),
      providesTags: ["AdminRoles"],
    }),

    createAdminRole: builder.mutation<
      { role: RoleInfo },
      { name: string; description?: string; permissionIds?: string[] }
    >({
      query: (body) => ({
        url: "/api/admin/roles",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["AdminRoles", "AdminUsers"],
    }),

    updateAdminRole: builder.mutation<
      { role: RoleInfo },
      {
        roleId: string;
        name?: string;
        description?: string | null;
        permissionIds?: string[];
      }
    >({
      query: ({ roleId, ...body }) => ({
        url: `/api/admin/roles/${roleId}`,
        method: "patch",
        data: body,
      }),
      invalidatesTags: ["AdminRoles", "AdminUsers"],
    }),

    deleteAdminRole: builder.mutation<{ success: boolean }, string>({
      query: (roleId) => ({
        url: `/api/admin/roles/${roleId}`,
        method: "delete",
      }),
      invalidatesTags: ["AdminRoles", "AdminUsers"],
    }),

    getAdminPermissions: builder.query<{ permissions: PermissionItem[] }, void>({
      query: () => ({
        url: "/api/admin/permissions",
        method: "get",
      }),
      providesTags: ["AdminPermissions"],
    }),

    createAdminPermission: builder.mutation<
      { permission: PermissionItem },
      { name: string; description?: string }
    >({
      query: (body) => ({
        url: "/api/admin/permissions",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["AdminPermissions", "AdminRoles", "AdminUsers"],
    }),

    updateAdminPermission: builder.mutation<
      { permission: PermissionItem },
      { permissionId: string; name?: string; description?: string | null }
    >({
      query: ({ permissionId, ...body }) => ({
        url: `/api/admin/permissions/${permissionId}`,
        method: "patch",
        data: body,
      }),
      invalidatesTags: ["AdminPermissions", "AdminRoles", "AdminUsers"],
    }),

    deleteAdminPermission: builder.mutation<{ success: boolean }, string>({
      query: (permissionId) => ({
        url: `/api/admin/permissions/${permissionId}`,
        method: "delete",
      }),
      invalidatesTags: ["AdminPermissions", "AdminRoles", "AdminUsers"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useLoginUserMutation,
  useSignupUserMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useGetAdminRolesQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
  useGetAdminPermissionsQuery,
  useCreateAdminPermissionMutation,
  useUpdateAdminPermissionMutation,
  useDeleteAdminPermissionMutation,
} = userApi;
