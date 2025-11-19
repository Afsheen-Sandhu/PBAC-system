"use client";

import { useLogout } from "@/lib/hooks/useLogout";

interface LogoutButtonProps {
  className?: string;
  label?: string;
}

export default function LogoutButton({
  className = "px-4 py-2 rounded-md bg-gray-200",
  label = "Logout",
}: LogoutButtonProps) {
  const logout = useLogout();

  return (
    <button type="button" onClick={logout} className={className}>
      {label}
    </button>
  );
}


