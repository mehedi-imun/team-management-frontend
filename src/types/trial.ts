/**
 * Trial Management Types
 * Handles trial status, expiry, and feature access
 */

export interface TrialStatus {
  isOnTrial: boolean;
  daysLeft: number;
  trialEndsAt: string | null;
  hasExpired: boolean;
  canAccessFeatures: boolean;
  subscriptionStatus:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "incomplete";
}

export interface FeatureAccessResponse {
  canAccess: boolean;
  reason?: string;
}

export interface TrialWarningLevel {
  daysLeft: number;
  severity: "info" | "warning" | "danger" | "expired";
  color: "blue" | "orange" | "red" | "gray";
  message: string;
  showUpgradeButton: boolean;
}

// Helper function to get warning level
export const getTrialWarningLevel = (daysLeft: number): TrialWarningLevel => {
  if (daysLeft <= 0) {
    return {
      daysLeft: 0,
      severity: "expired",
      color: "gray",
      message:
        "Your trial has expired. Upgrade now to continue using all features.",
      showUpgradeButton: true,
    };
  } else if (daysLeft === 1) {
    return {
      daysLeft: 1,
      severity: "danger",
      color: "red",
      message:
        "Only 1 day left in your trial! Upgrade to avoid feature restrictions.",
      showUpgradeButton: true,
    };
  } else if (daysLeft <= 3) {
    return {
      daysLeft,
      severity: "danger",
      color: "red",
      message: `Only ${daysLeft} days left in your trial! Upgrade to continue after trial ends.`,
      showUpgradeButton: true,
    };
  } else if (daysLeft <= 7) {
    return {
      daysLeft,
      severity: "warning",
      color: "orange",
      message: `${daysLeft} days left in your trial. Upgrade anytime to unlock all features.`,
      showUpgradeButton: true,
    };
  } else {
    return {
      daysLeft,
      severity: "info",
      color: "blue",
      message: `You have ${daysLeft} days left in your trial period.`,
      showUpgradeButton: false,
    };
  }
};

export interface TrialBlockedFeature {
  feature:
    | "create_team"
    | "invite_member"
    | "advanced_analytics"
    | "custom_branding";
  message: string;
  upgradeRequired: boolean;
}

export const TRIAL_BLOCKED_FEATURES: Record<string, TrialBlockedFeature> = {
  create_team: {
    feature: "create_team",
    message: "Your trial has expired. Please upgrade to create new teams.",
    upgradeRequired: true,
  },
  invite_member: {
    feature: "invite_member",
    message: "Your trial has expired. Please upgrade to invite new members.",
    upgradeRequired: true,
  },
  advanced_analytics: {
    feature: "advanced_analytics",
    message: "Advanced analytics are only available on paid plans.",
    upgradeRequired: true,
  },
  custom_branding: {
    feature: "custom_branding",
    message:
      "Custom branding is only available on Business and Enterprise plans.",
    upgradeRequired: true,
  },
};
