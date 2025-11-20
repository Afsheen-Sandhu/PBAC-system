import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string | null;
  permissions?: string[];
}

export function getAuthToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (header) {
    const [scheme, token] = header.split(" ");
    if (scheme === "Bearer" && token) {
      return token;
    }
  }

  const cookie = req.cookies.get("token");
  if (cookie) {
    return cookie.value;
  }

  return null;
}

export function verifyAuth(req: NextRequest): AuthPayload | null {
  const token = getAuthToken(req);
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export function requireAdmin(req: NextRequest): AuthPayload | null {
  const payload = verifyAuth(req);
  if (!payload) return null;
  const isAdmin =
    payload.role?.toLowerCase() === "admin" ||
    payload.permissions?.includes("manage_users");
  if (!isAdmin) return null;
  return payload;
}
