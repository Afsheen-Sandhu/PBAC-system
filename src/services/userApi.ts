import { apiSlice } from "./api";
import {
  User,
  LoginRequest,
  LoginResponse,
  AdminUsersResponse,
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
  }),

  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useLoginUserMutation,
  useSignupUserMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
} = userApi;
