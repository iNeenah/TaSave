// No imports needed for SVG icons

interface DifficultyBadgeProps {
  difficulty: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function DifficultyBadge({ 
  difficulty, 
  size = "md", 
  showLabel = true 
}: DifficultyBadgeProps) {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "very_easy":
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          label: "Very Easy",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          glowColor: "shadow-green-500/20"
        };
      case "easy":
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          label: "Easy",
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          glowColor: "shadow-blue-500/20"
        };
      case "medium":
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          ),
          label: "Medium",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          glowColor: "shadow-yellow-500/20"
        };
      case "hard":
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 12c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-4 4c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" />
            </svg>
          ),
          label: "Hard",
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          glowColor: "shadow-red-500/20"
        };
      default:
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          label: "Unknown",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          glowColor: "shadow-gray-500/20"
        };
    }
  };

  const config = getDifficultyConfig(difficulty);

  const sizeClasses = {
    sm: {
      container: "px-2 py-1 text-xs",
      icon: "w-3 h-3",
      text: "text-xs"
    },
    md: {
      container: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      text: "text-sm"
    },
    lg: {
      container: "px-4 py-2 text-base",
      icon: "w-5 h-5",
      text: "text-base"
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`
      inline-flex items-center space-x-2 rounded-full border
      ${config.bgColor} ${config.borderColor} ${config.glowColor}
      ${classes.container}
      difficulty-badge
      hover:shadow-lg transition-all duration-300
    `}>
      <div className={`${config.color} ${classes.icon}`}>
        {config.icon}
      </div>
      {showLabel && (
        <span className={`font-medium ${config.color} ${classes.text}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}