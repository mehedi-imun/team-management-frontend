/**
 * Invitation Types
 * Handles invitation validation and acceptance
 */

import type { UserRole } from "./user";

export interface InvitationValidateResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    organizationId: string;
    organizationName: string;
    role: UserRole;
    teamId?: string;
    teamName?: string;
    teamRole?: "TeamLead" | "Member";
    invitedBy: string;
    inviterName?: string;
    expiresAt: string;
    isExpired: boolean;
  };
}

export interface InvitationAcceptRequest {
  token: string;
  name: string;
  password: string;
}

export interface InvitationAcceptResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: UserRole;
      organizationId: string;
      organizationIds: string[];
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface InvitationTokenPayload {
  token: string;
  isValid: boolean;
  expiresAt: string | null;
  daysUntilExpiry: number;
}

// Helper to parse token from URL
export const parseInvitationToken = (url: string): string | null => {
  const match = url.match(/\/accept-invitation\/([^/?]+)/);
  return match ? match[1] : null;
};

// Helper to check if invitation is expired
export const isInvitationExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

// Helper to calculate days until expiry
export const getDaysUntilExpiry = (expiresAt: string): number => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
