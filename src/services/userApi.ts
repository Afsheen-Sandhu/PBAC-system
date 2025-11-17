import { apiSlice } from "./api";
import { User, LoginRequest, LoginResponse } from "@/types/user";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "get",
      }),
      providesTags: ["User"],
    }),

    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetUserQuery, useLoginUserMutation } = userApi;
