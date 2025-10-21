import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

export type UserRole =
  | "SuperAdmin" // Platform super admin (no organization)
  | "Admin" // Platform admin (no organization)
  | "OrgOwner" // Organization owner (has organizationId)
  | "OrgAdmin" // Organization admin (has organizationId)
  | "OrgMember"; // Regular organization member (has organizationId)

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
 * - SuperAdmin: Platform owner - complete system access
 * - Admin: Platform administrator - manage organizations
 * - OrgOwner: Organization owner - full org control + billing
 * - OrgAdmin: Organization admin - manage users/teams (no billing)
 * - OrgMember: Regular member - view only
 */
export const dashboardRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["SuperAdmin", "Admin", "OrgOwner", "OrgAdmin", "OrgMember"],
  },
  {
    path: "/dashboard/org/teams",
    label: "Teams",
    icon: Users,
    allowedRoles: ["OrgOwner", "OrgAdmin"], // Organization teams only, not for platform admins
  },
  {
    path: "/dashboard/org/members",
    label: "Members",
    icon: Users,
    allowedRoles: ["OrgOwner", "OrgAdmin"], // Organization members
  },
  {
    path: "/dashboard/invitations",
    label: "Invitations",
    icon: UserPlus,
    allowedRoles: ["OrgOwner", "OrgAdmin"], // Organization invitations only
  },
  {
    path: "/dashboard/org/billing",
    label: "Billing",
    icon: CreditCard,
    allowedRoles: ["OrgOwner"], // Only org owners can manage billing
  },
  {
    path: "/dashboard/org/overview",
    label: "Organization",
    icon: Building2,
    allowedRoles: ["OrgOwner", "OrgAdmin"], // Organization overview
  },
  {
    path: "/dashboard/org/analytics",
    label: "Analytics",
    icon: BarChart3,
    allowedRoles: ["OrgOwner", "OrgAdmin"], // Organization analytics
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    allowedRoles: ["SuperAdmin", "Admin", "OrgOwner", "OrgAdmin", "OrgMember"],
  },
];

/**
 * Platform Admin only routes (SuperAdmin & Admin)
 * These are for managing the entire platform, not specific organizations
 */
export const platformAdminRoutes: RouteConfig[] = [
  {
    path: "/dashboard/platform/organizations",
    label: "All Organizations",
    icon: Building2,
    allowedRoles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/dashboard/platform/users",
    label: "All Platform Users",
    icon: Users,
    allowedRoles: ["SuperAdmin", "Admin"],
  },
  {
    path: "/dashboard/platform/analytics",
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
