import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { AuthPayload } from "./auth";

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET not set");
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as AuthPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function getUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
