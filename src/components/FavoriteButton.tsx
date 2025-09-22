"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/lib/actions/machines";

interface FavoriteButtonProps {
  machineId: number;
  isFavorited: boolean;
}

export default function FavoriteButton({ machineId, isFavorited }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleFavorite(machineId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
        isFavorited
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600"
      }`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isPending ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        isFavorited ? "❤️" : "🤍"
      )}
    </button>
  );
}