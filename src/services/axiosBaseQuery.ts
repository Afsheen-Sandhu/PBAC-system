// src/services/api/CustomBaseQuery.ts
import axiosInstance from "@/lib/axios/AxiosInstance";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";

// ✅ Type for error responses
export interface AxiosBaseQueryError {
  status?: number;
  data?: unknown;
  message?: string;
}

// ✅ Arguments for each query/mutation
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
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl ? `${baseUrl}${url}` : url,
        method,
        data,
        params,
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
