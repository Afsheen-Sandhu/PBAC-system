"use client";

import { Spinner } from "../spinner";



interface GlobalLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function GlobalLoadingOverlay({
  isLoading,
  message = "Loading...",
}: GlobalLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-lg">
        <Spinner />
        <p className="text-lg font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
}
