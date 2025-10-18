import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

export type UserRole =
  | "SuperAdmin"  // Platform super admin (no organization)
  | "Admin"       // Platform admin (no organization)
  | "OrgOwner"    // Member with isOrganizationOwner = true
  | "OrgAdmin"    // Member with isOrganizationAdmin = true
  | "Member";     // Regular organization member

export interface RouteConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  element?: ReactNode;
  children?: RouteConfig[];
}

/**
 * Dynamic route configuration based on user roles
 * Routes are automatically filtered based on the logged-in user's role
 * 
 * Backend Role System:
 * - SuperAdmin: Platform admin, no organizationId
 * - Admin: Platform admin, no organizationId  
 * - Member: Organization user (default role)
 *   - isOrganizationOwner: true = Can manage billing, settings
 *   - isOrganizationAdmin: true = Can manage users, teams
 */
export const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["SuperAdmin", "Admin", "OrgOwner", "OrgAdmin", "Member"],
  },
  {
    path: "/teams",
    label: "Teams",
    icon: Users,
    allowedRoles: ["SuperAdmin", "OrgOwner", "OrgAdmin"],
  },
  {
    path: "/users",
    label: "Users",
    icon: Users,
    allowedRoles: ["SuperAdmin", "Admin"], // Platform admins only
  },
  {
    path: "/invitations",
    label: "Invitations",
    icon: UserPlus,
    allowedRoles: ["SuperAdmin", "OrgOwner", "OrgAdmin"],
  },
  {
    path: "/billing",
    label: "Billing",
    icon: CreditCard,
    allowedRoles: ["SuperAdmin", "OrgOwner"], // Only org owners can manage billing
  },
  {
    path: "/organization",
    label: "Organization",
    icon: Building2,
    allowedRoles: ["SuperAdmin", "OrgOwner"], // Organization settings
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    allowedRoles: ["SuperAdmin", "OrgOwner", "OrgAdmin"],
  },
  {
    path: "/reports",
    label: "Reports",
    icon: FileText,
    allowedRoles: ["SuperAdmin", "OrgOwner", "OrgAdmin"],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    allowedRoles: ["SuperAdmin", "Admin", "OrgOwner", "OrgAdmin", "Member"],
  },
];

/**
 * Platform Admin only routes (SuperAdmin & Admin)
 * These are for managing the entire platform, not specific organizations
 */
export const platformAdminRoutes: RouteConfig[] = [
  {
    path: "/platform/organizations",
    label: "All Organizations",
    icon: Building2,
    allowedRoles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/platform/users",
    label: "All Platform Users",
    icon: Users,
    allowedRoles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/platform/analytics",
    label: "Platform Analytics",
    icon: BarChart3,
    allowedRoles: ["SuperAdmin", "Admin"],
  },
];

/**
 * Filter routes based on user role
 * @param routes - Array of route configurations
 * @param userRole - Current user's role
 * @returns Filtered routes that the user has access to
 */
export const getFilteredRoutes = (
  routes: RouteConfig[],
  userRole?: UserRole
): RouteConfig[] => {
  if (!userRole) return [];

  return routes.filter((route) => route.allowedRoles.includes(userRole));
};

/**
 * Get all accessible routes for a user
 * @param userRole - Current user's role
 * @param isPlatformAdmin - Whether user is SuperAdmin or Admin (no organizationId)
 * @returns Combined filtered routes
 */
export const getUserRoutes = (
  userRole?: UserRole,
  isPlatformAdmin: boolean = false
): RouteConfig[] => {
  if (!userRole) return [];

  const filtered = getFilteredRoutes(dashboardRoutes, userRole);

  // Add platform admin routes if SuperAdmin or Admin
  if (isPlatformAdmin) {
    return [...filtered, ...platformAdminRoutes];
  }

  return filtered;
};

/**
 * Check if user has access to a specific route
 * @param path - Route path to check
 * @param userRole - Current user's role
 * @returns Boolean indicating access
 */
export const hasRouteAccess = (path: string, userRole?: UserRole): boolean => {
  if (!userRole) return false;

  const allRoutes = [...dashboardRoutes, ...platformAdminRoutes];
  const route = allRoutes.find((r) => r.path === path);

  if (!route) return false;

  return route.allowedRoles.includes(userRole);
};
