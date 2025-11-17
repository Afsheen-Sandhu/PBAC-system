"use client";

import { ThemeToggle } from "@/components/ui/theme/ThemeToggle";
import Link from "next/link";

export function Header() {
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
        <div className="flex flex-1 justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
