import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const requestCookies = await cookies();
  requestCookies.delete("token");
  return NextResponse.json({ message: "Logged out" });
}