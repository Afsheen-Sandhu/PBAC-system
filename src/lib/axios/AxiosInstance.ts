import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
