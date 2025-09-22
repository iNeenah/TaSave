"use client";

import { useState, useTransition } from "react";
import { createReview } from "@/lib/actions/machines";

interface ReviewFormProps {
  machineId: number;
  existingReview?: {
    rating: number;
    text?: string | null;
  };
}

export default function ReviewForm({
  machineId,
  existingReview,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [text, setText] = useState(existingReview?.text || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    startTransition(() => {
      createReview(machineId, rating, text || undefined);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-green-500 mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              disabled={isPending}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-600"
              } hover:text-yellow-400 transition-colors disabled:opacity-50`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-text"
          className="block text-sm font-medium text-green-500 mb-2"
        >
          Review (optional)
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isPending}
          rows={4}
          className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-green-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:opacity-50"
          placeholder="Share your thoughts about this machine..."
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          existingReview ? "&gt; Update Review" : "&gt; Submit Review"
        )}
      </button>
    </form>
  );
}
