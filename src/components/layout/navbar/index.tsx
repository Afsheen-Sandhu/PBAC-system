"use client";

import { ThemeToggle } from "@/components/ui/theme";
import Link from "next/link";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/store-hooks";
import { LogIn, UserPlus } from "lucide-react";
import { setAuth } from "@/lib/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks/useLogout";

export function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const displayName = user?.name || user?.email || "User";
  const handleLogout = useLogout();

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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/70 lg:px-10">
      <div className="flex h-16 w-full items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">My App</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />
          {user ? (
            <Button onClick={handleLogout} variant="secondary" size="md">
              Logout
            </Button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
