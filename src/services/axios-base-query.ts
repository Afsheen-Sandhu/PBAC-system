// src/services/api/CustomBaseQuery.ts
import axiosInstance from "@/lib/axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";
import { RootState } from "@/lib/store/store";


export interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
  message?: string;
}


export interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

export type AxiosBaseQueryType = BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
>;

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl?: string } = {}): AxiosBaseQueryType =>
  async ({ url, method, data, params }, api) => {
    const state = api.getState() as RootState;
    const token = state.auth.token;

    try {
      const result = await axiosInstance({
        url: baseUrl ? `${baseUrl}${url}` : url,
        method,
        data,
        params,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      return { data: result };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        },
      };
    }
  };
