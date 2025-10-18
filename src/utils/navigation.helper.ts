import type { RouteConfig, UserRole } from "@/config/routes.config";

export interface User {
  role: string;
  isOrganizationOwner?: boolean;
  isOrganizationAdmin?: boolean;
  name: string;
  email: string;
}

/**
 * Convert user role string to typed UserRole
 * Based on backend User model:
 * - role: "SuperAdmin" | "Admin" | "Member"
 * - isOrganizationOwner: boolean
 * - isOrganizationAdmin: boolean
 */
export const mapUserRole = (user?: User | null): UserRole | undefined => {
  if (!user) return undefined;

  // Platform Admins (no organizationId)
  if (user.role === "SuperAdmin") return "SuperAdmin";
  if (user.role === "Admin") return "Admin";

  // Organization roles (role = "Member" + flags)
  if (user.role === "Member") {
    if (user.isOrganizationOwner) return "OrgOwner";
    if (user.isOrganizationAdmin) return "OrgAdmin";
    return "Member";
  }

  // Default fallback
  return "Member";
};

/**
 * Group routes into sections for sidebar display
 */
export const groupRoutes = (routes: RouteConfig[]) => {
  const sections: { title: string; items: RouteConfig[] }[] = [];

  // Main navigation (Dashboard)
  const mainRoutes = routes.filter((r) => r.path === "/dashboard");
  if (mainRoutes.length > 0) {
    sections.push({
      title: "",
      items: mainRoutes,
    });
  }

  // Platform Admin routes
  const platformRoutes = routes.filter((r) => r.path.startsWith("/platform"));
  if (platformRoutes.length > 0) {
    sections.push({
      title: "Platform",
      items: platformRoutes,
    });
  }

  // Organization routes
  const orgRoutes = routes.filter(
    (r) =>
      r.path === "/organization" ||
      r.path === "/billing" ||
      r.path === "/analytics" ||
      r.path === "/reports"
  );
  if (orgRoutes.length > 0) {
    sections.push({
      title: "Organization",
      items: orgRoutes,
    });
  }

  // Team Management routes
  const teamRoutes = routes.filter(
    (r) => r.path === "/teams" || r.path === "/invitations"
  );
  if (teamRoutes.length > 0) {
    sections.push({
      title: "Team Management",
      items: teamRoutes,
    });
  }

  // User Management routes
  const userRoutes = routes.filter((r) => r.path === "/users");
  if (userRoutes.length > 0) {
    sections.push({
      title: "User Management",
      items: userRoutes,
    });
  }

  // Settings
  const settingsRoutes = routes.filter((r) => r.path === "/settings");
  if (settingsRoutes.length > 0) {
    sections.push({
      title: "Settings",
      items: settingsRoutes,
    });
  }

  return sections;
};

/**
 * Get user display role
 * Maps backend role structure to user-friendly display names
 */
export const getUserDisplayRole = (user?: User | null): string => {
  if (!user) return "Member";

  // Platform roles
  if (user.role === "SuperAdmin") return "Platform Super Admin";
  if (user.role === "Admin") return "Platform Admin";

  // Organization roles
  if (user.role === "Member") {
    if (user.isOrganizationOwner) return "Organization Owner";
    if (user.isOrganizationAdmin) return "Organization Admin";
    return "Member";
  }

  return user.role || "Member";
};
