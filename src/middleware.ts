import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/session";

const publicRoutes = ["/login", "/signup"];
const privateRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isPrivateRoute = privateRoutes.includes(path);

  const token = req.cookies.get("token")?.value;
  const session = token ? verifyToken(token) : null;

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (path === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
