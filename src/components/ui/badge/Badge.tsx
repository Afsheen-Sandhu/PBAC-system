import React from "react";

interface BadgeProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Badge({
  variant = "primary",
  size = "md",
  children,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full font-medium";

  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-pink-200 text-gray-900",
    outline: "border border-gray-300 text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
