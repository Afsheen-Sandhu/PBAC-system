export interface RoleInfo {
  id: string;
  name: string;
}

export interface PermissionItem {
  id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: RoleInfo | string | null;
  permissions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AdminUser extends Omit<User, "permissions" | "role"> {
  role: RoleInfo | null;
  permissions: PermissionItem[];
}

export interface AdminUsersResponse {
  users: AdminUser[];
  roles: RoleInfo[];
  permissions: PermissionItem[];
}
