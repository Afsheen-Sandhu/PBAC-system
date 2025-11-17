// Types for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Common application types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Route params types
export interface PageParams {
  slug: string;
  id: string;
}
