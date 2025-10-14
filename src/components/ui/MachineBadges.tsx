import { Badge } from "@/components/ui";
import { Clock, Star, MessageSquare, Flame } from "lucide-react";

interface MachineBadgesProps {
  createdAt: Date;
  averageRating: number;
  reviewCount: number;
}

export default function MachineBadges({ createdAt, averageRating, reviewCount }: MachineBadgesProps) {
  const daysSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const isNew = daysSinceCreated <= 7;
  const isHot = averageRating >= 4.5 && reviewCount >= 5;
  const isPopular = reviewCount >= 10;

  return (
    <div className="flex flex-wrap gap-1">
      {isNew && (
        <Badge variant="success" className="text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          New
        </Badge>
      )}
      
      {isHot && (
        <Badge variant="destructive" className="text-xs flex items-center gap-1 bg-orange-600 hover:bg-orange-700">
          <Flame className="w-3 h-3" />
          Hot
        </Badge>
      )}
      
      {isPopular && !isHot && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 border-purple-500 text-purple-400">
          <MessageSquare className="w-3 h-3" />
          Popular
        </Badge>
      )}
      
      {averageRating >= 4 && reviewCount >= 3 && !isHot && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 border-yellow-500 text-yellow-400">
          <Star className="w-3 h-3" />
          {averageRating.toFixed(1)}
        </Badge>
      )}
    </div>
  );
}