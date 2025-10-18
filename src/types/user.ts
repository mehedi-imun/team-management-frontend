/**
 * User Types for Role-Based Access Control
 * Matches backend User model exactly
 */

export type UserRole = 
  | "SuperAdmin"   // Platform owner - complete system access
  | "Admin"        // Platform administrator - manage organizations
  | "OrgOwner"     // Organization owner - full org control + billing
  | "OrgAdmin"     // Organization admin - manage users/teams (no billing)
  | "OrgMember";   // Regular member - view only

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string; // Optional for platform admins
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  plan: "free" | "professional" | "business" | "enterprise";
  billingCycle: "monthly" | "annual";
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  
  // Stripe
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  
  // Limits
  limits: {
    maxUsers: number;
    maxTeams: number;
    maxStorage: string;
    features: string[];
  };
  
  // Usage
  usage: {
    users: number;
    teams: number;
    storage: string;
  };
  
  // Settings
  settings: {
    primaryColor: string;
    allowedDomains: string[];
    ssoEnabled: boolean;
    requireMFA: boolean;
    sessionTimeout: number;
  };
  
  // Owner
  ownerId: string;
  ownerEmail?: string;
  ownerName?: string;
  
  // Status
  status: "pending_setup" | "active" | "suspended";
  isActive: boolean;
  
  // Virtuals
  isOnTrial?: boolean;
  daysLeftInTrial?: number;
  usersPercentage?: number;
  teamsPercentage?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  organizationId: string;
  members: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt?: string;
}

export interface Invitation {
  _id: string;
  email: string;
  organizationId: string;
  role: UserRole;
  invitedBy: string;
  status: "pending" | "accepted" | "expired";
  token: string;
  expiresAt: string;
  createdAt?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Analytics Types
export interface PlatformAnalytics {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  revenue: {
    monthly: number;
    annual: number;
    total: number;
  };
  planDistribution: {
    free: number;
    professional: number;
    business: number;
    enterprise: number;
  };
  growthRate: {
    organizations: number;
    users: number;
    revenue: number;
  };
}

export interface OrganizationAnalytics {
  totalMembers: number;
  activeMembers: number;
  totalTeams: number;
  storageUsed: string;
  planLimits: {
    maxUsers: number;
    maxTeams: number;
    maxStorage: string;
  };
  usage: {
    usersPercentage: number;
    teamsPercentage: number;
  };
  memberActivity: {
    date: string;
    count: number;
  }[];
  teamGrowth: {
    date: string;
    count: number;
  }[];
}
