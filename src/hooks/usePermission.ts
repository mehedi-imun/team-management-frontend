/**
 * Permission Hook for Role-Based Access Control
 * Use this hook to check permissions in components
 */

import { useAppSelector } from "@/redux/hook";
import type { UserRole } from "@/types/user";

// Permission definitions matching backend
export const Permission = {
  // Platform Permissions
  PLATFORM_VIEW_ALL_ORGANIZATIONS: "platform:view_all_organizations",
  PLATFORM_CREATE_ORGANIZATION: "platform:create_organization",
  PLATFORM_UPDATE_ORGANIZATION: "platform:update_organization",
  PLATFORM_DELETE_ORGANIZATION: "platform:delete_organization",
  PLATFORM_SUSPEND_ORGANIZATION: "platform:suspend_organization",
  PLATFORM_VIEW_ALL_USERS: "platform:view_all_users",
  PLATFORM_CREATE_ADMIN: "platform:create_admin",
  PLATFORM_VIEW_ANALYTICS: "platform:view_analytics",
  PLATFORM_MANAGE_SETTINGS: "platform:manage_settings",
  PLATFORM_MANAGE_BILLING_PLANS: "platform:manage_billing_plans",

  // Organization Permissions
  ORG_VIEW_SETTINGS: "org:view_settings",
  ORG_UPDATE_SETTINGS: "org:update_settings",
  ORG_DELETE_ORGANIZATION: "org:delete_organization",
  ORG_VIEW_BILLING: "org:view_billing",
  ORG_MANAGE_BILLING: "org:manage_billing",
  ORG_UPGRADE_PLAN: "org:upgrade_plan",
  ORG_CANCEL_SUBSCRIPTION: "org:cancel_subscription",

  // Member Management
  ORG_VIEW_MEMBERS: "org:view_members",
  ORG_INVITE_MEMBERS: "org:invite_members",
  ORG_UPDATE_MEMBER_ROLE: "org:update_member_role",
  ORG_REMOVE_MEMBERS: "org:remove_members",
  ORG_MANAGE_ADMINS: "org:manage_admins",

  // Team Management
  ORG_VIEW_TEAMS: "org:view_teams",
  ORG_CREATE_TEAM: "org:create_team",
  ORG_UPDATE_TEAM: "org:update_team",
  ORG_DELETE_TEAM: "org:delete_team",
  ORG_MANAGE_TEAM_MEMBERS: "org:manage_team_members",

  // Invitations
  ORG_VIEW_INVITATIONS: "org:view_invitations",
  ORG_SEND_INVITATIONS: "org:send_invitations",
  ORG_CANCEL_INVITATIONS: "org:cancel_invitations",

  // Analytics
  ORG_VIEW_ANALYTICS: "org:view_analytics",
  ORG_VIEW_REPORTS: "org:view_reports",
  ORG_EXPORT_REPORTS: "org:export_reports",

  // General
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_PROFILE: "view_profile",
  UPDATE_PROFILE: "update_profile",
} as const;

export type PermissionValue = (typeof Permission)[keyof typeof Permission];

// Role-Permission mapping (matches backend exactly)
const ROLE_PERMISSIONS: Record<UserRole, PermissionValue[]> = {
  SuperAdmin: [
    // All permissions
    Permission.PLATFORM_VIEW_ALL_ORGANIZATIONS,
    Permission.PLATFORM_CREATE_ORGANIZATION,
    Permission.PLATFORM_UPDATE_ORGANIZATION,
    Permission.PLATFORM_DELETE_ORGANIZATION,
    Permission.PLATFORM_SUSPEND_ORGANIZATION,
    Permission.PLATFORM_VIEW_ALL_USERS,
    Permission.PLATFORM_CREATE_ADMIN,
    Permission.PLATFORM_VIEW_ANALYTICS,
    Permission.PLATFORM_MANAGE_SETTINGS,
    Permission.PLATFORM_MANAGE_BILLING_PLANS,
    Permission.ORG_VIEW_SETTINGS,
    Permission.ORG_UPDATE_SETTINGS,
    Permission.ORG_DELETE_ORGANIZATION,
    Permission.ORG_VIEW_BILLING,
    Permission.ORG_MANAGE_BILLING,
    Permission.ORG_UPGRADE_PLAN,
    Permission.ORG_CANCEL_SUBSCRIPTION,
    Permission.ORG_VIEW_MEMBERS,
    Permission.ORG_INVITE_MEMBERS,
    Permission.ORG_UPDATE_MEMBER_ROLE,
    Permission.ORG_REMOVE_MEMBERS,
    Permission.ORG_MANAGE_ADMINS,
    Permission.ORG_VIEW_TEAMS,
    Permission.ORG_CREATE_TEAM,
    Permission.ORG_UPDATE_TEAM,
    Permission.ORG_DELETE_TEAM,
    Permission.ORG_MANAGE_TEAM_MEMBERS,
    Permission.ORG_VIEW_INVITATIONS,
    Permission.ORG_SEND_INVITATIONS,
    Permission.ORG_CANCEL_INVITATIONS,
    Permission.ORG_VIEW_ANALYTICS,
    Permission.ORG_VIEW_REPORTS,
    Permission.ORG_EXPORT_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
  ],

  Admin: [
    Permission.PLATFORM_VIEW_ALL_ORGANIZATIONS,
    Permission.PLATFORM_CREATE_ORGANIZATION,
    Permission.PLATFORM_UPDATE_ORGANIZATION,
    Permission.PLATFORM_SUSPEND_ORGANIZATION,
    Permission.PLATFORM_VIEW_ALL_USERS,
    Permission.PLATFORM_VIEW_ANALYTICS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
  ],

  OrgOwner: [
    Permission.ORG_VIEW_SETTINGS,
    Permission.ORG_UPDATE_SETTINGS,
    Permission.ORG_DELETE_ORGANIZATION,
    Permission.ORG_VIEW_BILLING,
    Permission.ORG_MANAGE_BILLING,
    Permission.ORG_UPGRADE_PLAN,
    Permission.ORG_CANCEL_SUBSCRIPTION,
    Permission.ORG_VIEW_MEMBERS,
    Permission.ORG_INVITE_MEMBERS,
    Permission.ORG_UPDATE_MEMBER_ROLE,
    Permission.ORG_REMOVE_MEMBERS,
    Permission.ORG_MANAGE_ADMINS,
    Permission.ORG_VIEW_TEAMS,
    Permission.ORG_CREATE_TEAM,
    Permission.ORG_UPDATE_TEAM,
    Permission.ORG_DELETE_TEAM,
    Permission.ORG_MANAGE_TEAM_MEMBERS,
    Permission.ORG_VIEW_INVITATIONS,
    Permission.ORG_SEND_INVITATIONS,
    Permission.ORG_CANCEL_INVITATIONS,
    Permission.ORG_VIEW_ANALYTICS,
    Permission.ORG_VIEW_REPORTS,
    Permission.ORG_EXPORT_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
  ],

  OrgAdmin: [
    Permission.ORG_VIEW_SETTINGS,
    Permission.ORG_VIEW_MEMBERS,
    Permission.ORG_INVITE_MEMBERS,
    Permission.ORG_UPDATE_MEMBER_ROLE,
    Permission.ORG_REMOVE_MEMBERS,
    Permission.ORG_VIEW_TEAMS,
    Permission.ORG_CREATE_TEAM,
    Permission.ORG_UPDATE_TEAM,
    Permission.ORG_DELETE_TEAM,
    Permission.ORG_MANAGE_TEAM_MEMBERS,
    Permission.ORG_VIEW_INVITATIONS,
    Permission.ORG_SEND_INVITATIONS,
    Permission.ORG_CANCEL_INVITATIONS,
    Permission.ORG_VIEW_ANALYTICS,
    Permission.ORG_VIEW_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
  ],

  OrgMember: [
    Permission.ORG_VIEW_MEMBERS,
    Permission.ORG_VIEW_TEAMS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROFILE,
    Permission.UPDATE_PROFILE,
  ],
};

export const usePermission = () => {
  const { user } = useAppSelector((state) => state.auth);

  /**
   * Check if user has a specific permission
   */
  const can = (permission: PermissionValue): boolean => {
    if (!user) return false;
    const userRole = user.role as UserRole;
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
  };

  /**
   * Check if user has ANY of the specified permissions
   */
  const canAny = (...permissions: PermissionValue[]): boolean => {
    return permissions.some((permission) => can(permission));
  };

  /**
   * Check if user has ALL of the specified permissions
   */
  const canAll = (...permissions: PermissionValue[]): boolean => {
    return permissions.every((permission) => can(permission));
  };

  /**
   * Check if user has specific role(s)
   */
  const isRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  /**
   * Check if user is platform admin (SuperAdmin or Admin)
   */
  const isPlatformAdmin = (): boolean => {
    return isRole("SuperAdmin", "Admin");
  };

  /**
   * Check if user is organization role
   */
  const isOrganizationRole = (): boolean => {
    return isRole("OrgOwner", "OrgAdmin", "OrgMember");
  };

  /**
   * Check if user can manage another user's role
   */
  const canManageRole = (targetRole: UserRole): boolean => {
    if (!user) return false;
    const userRole = user.role as UserRole;

    // SuperAdmin can manage everyone
    if (userRole === "SuperAdmin") return true;

    // Admin can manage organization roles
    if (userRole === "Admin") {
      return ["OrgOwner", "OrgAdmin", "OrgMember"].includes(targetRole);
    }

    // OrgOwner can manage OrgAdmin and OrgMember
    if (userRole === "OrgOwner") {
      return ["OrgAdmin", "OrgMember"].includes(targetRole);
    }

    // OrgAdmin can manage OrgMember only
    if (userRole === "OrgAdmin") {
      return targetRole === "OrgMember";
    }

    return false;
  };

  return {
    can,
    canAny,
    canAll,
    isRole,
    isPlatformAdmin,
    isOrganizationRole,
    canManageRole,
  };
};
