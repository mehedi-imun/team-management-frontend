import type { RouteConfig, UserRole } from "@/config/routes.config";

export interface User {
  role: "SuperAdmin" | "Admin" | "OrgOwner" | "OrgAdmin" | "OrgMember";
  name: string;
  email: string;
  organizationId?: string;
}

/**
 * Convert user role to typed UserRole
 * NEW SIMPLIFIED VERSION - Direct role mapping, no complex logic!
 *
 * Backend now uses single role field with 5 values:
 * - SuperAdmin: Platform owner
 * - Admin: Platform administrator
 * - OrgOwner: Organization owner
 * - OrgAdmin: Organization administrator
 * - OrgMember: Regular member
 */
export const mapUserRole = (user?: User | null): UserRole | undefined => {
  if (!user) return undefined;

  // Direct role mapping - that's it!
  return user.role as UserRole;
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
  const platformRoutes = routes.filter((r) =>
    r.path.startsWith("/dashboard/platform")
  );
  if (platformRoutes.length > 0) {
    sections.push({
      title: "Platform",
      items: platformRoutes,
    });
  }

  // Organization routes
  const orgRoutes = routes.filter(
    (r) =>
      r.path.startsWith("/dashboard/org/") &&
      !r.path.includes("/teams") &&
      !r.path.includes("/members")
  );
  if (orgRoutes.length > 0) {
    sections.push({
      title: "Organization",
      items: orgRoutes,
    });
  }

  // Team Management routes
  const teamRoutes = routes.filter(
    (r) =>
      r.path === "/dashboard/org/teams" ||
      r.path === "/dashboard/org/members" ||
      r.path === "/dashboard/invitations"
  );
  if (teamRoutes.length > 0) {
    sections.push({
      title: "Team Management",
      items: teamRoutes,
    });
  }

  // Settings
  const settingsRoutes = routes.filter((r) => r.path === "/dashboard/settings");
  if (settingsRoutes.length > 0) {
    sections.push({
      title: "",
      items: settingsRoutes,
    });
  }

  return sections;
};

/**
 * Get user display role
 * Maps backend role to user-friendly display names
 */
export const getUserDisplayRole = (user?: User | null): string => {
  if (!user) return "Member";

  // Direct role to display name mapping
  switch (user.role) {
    case "SuperAdmin":
      return "Platform Super Admin";
    case "Admin":
      return "Platform Admin";
    case "OrgOwner":
      return "Organization Owner";
    case "OrgAdmin":
      return "Organization Admin";
    case "OrgMember":
      return "Member";
    default:
      return "Member";
  }
};
