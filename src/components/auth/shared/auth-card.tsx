"use client";

import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkHref?: string;
  footerLinkLabel?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">
      <div className="grid w-full gap-10 rounded-2xl border bg-base-100 p-8 shadow-lg md:grid-cols-[1.2fr,1fr]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
          {footerText && footerLinkHref && footerLinkLabel && (
            <p className="text-sm text-muted-foreground">
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="font-medium text-primary hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          )}
        </div>
        <div className="hidden flex-col justify-between rounded-xl bg-base-200 p-6 md:flex">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Modern School Management
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One place for students, teachers, parents, and admins to manage
              everyday school workflows.
            </p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-foreground">
            <li>• Role-based dashboards</li>
            <li>• Fine-grained permissions</li>
            <li>• Secure, token-based access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


