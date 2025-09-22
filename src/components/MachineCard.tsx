import Link from "next/link";
import { Machine } from "@/db/schema";
import FavoriteButton from "./FavoriteButton";
import TodoButton from "./TodoButton";

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
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:border-green-500 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-green-500 line-clamp-2">
            {machine.name}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-green-400 border border-gray-600`}
          >
            {difficultyLabels[machine.difficulty]}
          </span>
        </div>

        {machine.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {machine.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {machine.author && <span className="text-gray-400">By {machine.author}</span>}
          {machine.creationDate && <span className="text-gray-400">{machine.creationDate}</span>}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {averageRating && averageRating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-400 ml-1">
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
            className="text-green-500 hover:text-green-400 font-medium text-sm font-mono"
          >
            &gt; View Details
          </Link>

          <div className="flex space-x-2">
            <FavoriteButton machineId={machine.id} isFavorited={isFavorited} />
            <TodoButton machineId={machine.id} isInTodo={isInTodo} />
          </div>
        </div>
      </div>
    </div>
  );
}
