import { Badge } from "@/components/ui";
import { getRoleDisplayName, getRoleBadgeColor } from "@/lib/auth-roles";
import { Role } from "@/db/schema";

interface UserRoleBadgeProps {
  role: Role;
  className?: string;
}

export default function UserRoleBadge({ role, className = "" }: UserRoleBadgeProps) {
  const displayName = getRoleDisplayName(role);
  const colorClass = getRoleBadgeColor(role);

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${colorClass} ${className}`}
    >
      {displayName}
    </Badge>
  );
}