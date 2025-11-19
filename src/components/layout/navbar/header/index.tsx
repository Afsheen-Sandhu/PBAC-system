"use client";

import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";
import Link from "next/link";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/storeHooks";
import LogoutButton from "@/components/ui/logout-button";
import { LogIn, UserPlus } from "lucide-react";
import { setAuth } from "@/lib/store/slices/counter/auth-slice";

export function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const displayName = user?.name || user?.email || "User";

  useEffect(() => {
    if (user) return;
    if (typeof window === "undefined") return;
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setAuth({ token: storedToken, user: parsedUser }));
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }
  }, [user, dispatch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">My App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/about"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/docs"
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Dashboard
              </Link>
              <span className="hidden text-sm font-medium text-muted-foreground sm:inline-block">
                Hi, {displayName}
              </span>
              <LogoutButton className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors" />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
