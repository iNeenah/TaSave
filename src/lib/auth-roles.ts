import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/db/schema";

// Define role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  contributor: 2,
  admin: 3,
};

// Define permissions for each action
export const PERMISSIONS = {
  UPLOAD_MACHINE: ["contributor", "admin"] as Role[],
  DELETE_MACHINE: ["admin"] as Role[],
  MODERATE_REVIEWS: ["admin"] as Role[],
  MANAGE_USERS: ["admin"] as Role[],
} as const;

/**
 * Check if user has required role
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has permission for specific action
 */
export function hasPermission(userRole: Role, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

/**
 * Get current user with role check
 */
export async function getCurrentUserWithRole() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  // Default to 'user' role if not set (for backward compatibility)
  const role = (user as typeof user & { role?: Role }).role || 'user';
  
  return {
    ...user,
    role: role as Role,
  };
}

/**
 * Check if current user can upload machines
 */
export async function canUploadMachines(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  if (!user) return false;
  
  return hasPermission(user.role, 'UPLOAD_MACHINE');
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  if (!user) return false;
  
  return user.role === 'admin';
}

/**
 * Check if current user can delete machines
 */
export async function canDeleteMachines(): Promise<boolean> {
  const user = await getCurrentUserWithRole();
  if (!user) return false;
  
  return hasPermission(user.role, 'DELETE_MACHINE');
}

/**
 * Require specific permission or throw error
 */
export async function requirePermission(permission: keyof typeof PERMISSIONS): Promise<void> {
  const user = await getCurrentUserWithRole();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  if (!hasPermission(user.role, permission)) {
    throw new Error(`Insufficient permissions. Required: ${PERMISSIONS[permission].join(' or ')}`);
  }
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    user: "User",
    contributor: "Contributor", 
    admin: "Administrator",
  };
  
  return roleNames[role];
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: Role): string {
  const roleColors: Record<Role, string> = {
    user: "text-gray-400 border-gray-500",
    contributor: "text-blue-400 border-blue-500",
    admin: "text-red-400 border-red-500",
  };
  
  return roleColors[role];
}