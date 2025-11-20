import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "./auth";

export function getUser(): AuthPayload | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET not set");
    return null;
  }

  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
