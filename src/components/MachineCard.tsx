import Link from "next/link";
import { Machine } from "@/db/schema";
import { toggleFavorite, toggleTodo } from "@/lib/actions/machines";

interface MachineCardProps {
  machine: Machine;
  isFavorited?: boolean;
  isInTodo?: boolean;
  userReviewCount?: number;
  averageRating?: number;
}

export default function MachineCard({
  machine,
  isFavorited = false,
  isInTodo = false,
  userReviewCount = 0,
  averageRating = 0,
}: MachineCardProps) {
  const difficultyColors = {
    very_easy: "bg-green-100 text-green-800",
    easy: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const difficultyLabels = {
    very_easy: "Very Easy",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {machine.name}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              difficultyColors[machine.difficulty]
            }`}
          >
            {difficultyLabels[machine.difficulty]}
          </span>
        </div>

        {machine.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {machine.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {machine.author && <span>By {machine.author}</span>}
          {machine.creationDate && <span>{machine.creationDate}</span>}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {averageRating && averageRating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {Number(averageRating || 0).toFixed(1)} ({userReviewCount}{" "}
                  reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/machines/${machine.id}`}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
          >
            View Details →
          </Link>

          <div className="flex space-x-2">
            <form action={toggleFavorite.bind(null, machine.id)}>
              <button
                type="submit"
                className={`p-2 rounded-full transition-colors ${
                  isFavorited
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorited ? "❤️" : "🤍"}
              </button>
            </form>

            <form action={toggleTodo.bind(null, machine.id)}>
              <button
                type="submit"
                className={`p-2 rounded-full transition-colors ${
                  isInTodo
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isInTodo ? "Remove from todo" : "Add to todo"}
              >
                {isInTodo ? "✅" : "📝"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
