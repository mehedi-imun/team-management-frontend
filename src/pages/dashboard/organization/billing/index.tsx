import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useGetMyOrganizationAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  useCancelSubscriptionMutation,
  useCreateCheckoutMutation,
  useCreatePortalMutation,
  useGetSubscriptionQuery,
  useReactivateSubscriptionMutation,
} from "@/redux/features/billing/billingApi";
import type { RootState } from "@/redux/store";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Pricing plans configuration
const PLANS = {
  free: {
    name: "Free",
    price: 0,
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    features: [
      "Up to 5 team members",
      "3 teams maximum",
      "5GB storage",
      "Basic support",
      "Email notifications",
    ],
    limits: {
      maxUsers: 5,
      maxTeams: 3,
      maxStorage: "5GB",
    },
    popular: false,
  },
  professional: {
    name: "Professional",
    price: 49,
    monthlyPrice: "$49",
    yearlyPrice: "$470",
    features: [
      "Up to 50 team members",
      "20 teams",
      "100GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    limits: {
      maxUsers: 50,
      maxTeams: 20,
      maxStorage: "100GB",
    },
    popular: true,
  },
  business: {
    name: "Business",
    price: 99,
    monthlyPrice: "$99",
    yearlyPrice: "$950",
    features: [
      "Up to 200 team members",
      "Unlimited teams",
      "500GB storage",
      "24/7 premium support",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "SSO/SAML",
      "Dedicated account manager",
    ],
    limits: {
      maxUsers: 200,
      maxTeams: 999,
      maxStorage: "500GB",
    },
    popular: false,
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    monthlyPrice: "$299",
    yearlyPrice: "$2870",
    features: [
      "Unlimited team members",
      "Unlimited teams",
      "Unlimited storage",
      "24/7 premium support",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "SSO/SAML",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
    ],
    limits: {
      maxUsers: 99999,
      maxTeams: 99999,
      maxStorage: "Unlimited",
    },
    popular: false,
  },
};

export default function BillingPage() {
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);

  // API hooks
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useGetSubscriptionQuery();
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetMyOrganizationAnalyticsQuery();
  const [createCheckout, { isLoading: checkoutLoading }] =
    useCreateCheckoutMutation();
  const [createPortal, { isLoading: portalLoading }] =
    useCreatePortalMutation();
  const [cancelSubscription, { isLoading: cancelLoading }] =
    useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: reactivateLoading }] =
    useReactivateSubscriptionMutation();

  // State
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS | null>(
    null
  );
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly"
  );

  // Check for successful checkout in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    if (sessionId) {
      toast({
        title: "Success!",
        description: "Your subscription has been activated successfully.",
      });
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast]);

  if (subscriptionLoading || analyticsLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-[300px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load billing information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const subscription = subscriptionData?.data;
  const analytics = analyticsData?.data;
  const currentPlan = subscription?.plan || "free";
  const planDetails = PLANS[currentPlan as keyof typeof PLANS];
  const isOwner = user?.isOrganizationOwner;

  // Debug: Log subscription data
  console.log("=== SUBSCRIPTION DATA ===");
  console.log("Full subscription object:", subscription);
  console.log("Plan:", subscription?.plan);
  console.log("Status:", subscription?.status);
  console.log("Has Subscription:", subscription?.hasSubscription);
  console.log("Current Period End:", subscription?.currentPeriodEnd);
  console.log("Cancel At Period End:", subscription?.cancelAtPeriodEnd);
  console.log("========================");

  // Calculate usage percentages
  const userUsagePercent = analytics
    ? (analytics.usage.users / analytics.limits.maxUsers) * 100
    : 0;
  const teamUsagePercent = analytics
    ? (analytics.usage.teams / analytics.limits.maxTeams) * 100
    : 0;

  const handleUpgradePlan = async (
    plan: keyof typeof PLANS,
    interval: "monthly" | "annual"
  ) => {
    if (!isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only organization owners can upgrade plans.",
        variant: "destructive",
      });
      return;
    }

    if (plan === "free") {
      toast({
        title: "Invalid Action",
        description: "Cannot upgrade to free plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createCheckout({
        plan: plan as "professional" | "business" | "enterprise",
        interval,
      }).unwrap();

      // Redirect to Stripe Checkout
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to create checkout session.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    if (!isOwner) {
      toast({
        title: "Permission Denied",
        description: "Only organization owners can manage subscriptions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createPortal().unwrap();
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to open customer portal.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      toast({
        title: "Subscription Canceled",
        description:
          "Your subscription will be canceled at the end of the billing period.",
      });
      setShowCancelDialog(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to cancel subscription.",
        variant: "destructive",
      });
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription().unwrap();
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated successfully.",
      });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to reactivate subscription.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      trialing: { color: "bg-blue-100 text-blue-800", label: "Trial" },
      past_due: { color: "bg-red-100 text-red-800", label: "Past Due" },
      canceled: { color: "bg-gray-100 text-gray-800", label: "Canceled" },
    };
    const variant = variants[status] || variants.active;
    return (
      <Badge className={variant.color}>
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {variant.label}
      </Badge>
    );
  };

  const openUpgradeDialog = (plan: keyof typeof PLANS) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and usage
        </p>
      </div>

      {/* Trial Banner */}
      {subscription?.status === "trialing" &&
        subscription?.currentPeriodEnd && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Trial Period Active
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Trial ends on{" "}
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {isOwner && (
                  <Button onClick={() => openUpgradeDialog("professional")}>
                    Upgrade Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Canceled Subscription Banner */}
      {subscription?.cancelAtPeriodEnd && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Subscription Ending
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Your subscription will end on{" "}
                    {subscription.currentPeriodEnd &&
                      new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {isOwner && (
                <Button
                  onClick={handleReactivateSubscription}
                  disabled={reactivateLoading}
                >
                  {reactivateLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reactivate Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{planDetails.name}</h3>
                  {subscription?.status && getStatusBadge(subscription.status)}
                </div>
                <p className="text-3xl font-bold">
                  {planDetails.monthlyPrice}
                  <span className="text-lg text-muted-foreground font-normal">
                    /month
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Plan includes:</p>
                <ul className="space-y-1">
                  {planDetails.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {subscription?.currentPeriodEnd &&
                !subscription?.cancelAtPeriodEnd && (
                  <div className="pt-4 space-y-2 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Subscription Status:
                      </p>
                      <span className="font-medium text-foreground">
                        {subscription?.hasSubscription
                          ? "Active Subscription"
                          : "No Active Subscription"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Next billing date:
                      </p>
                      <span className="font-medium text-foreground">
                        {new Date(
                          subscription.currentPeriodEnd
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

              {subscription?.status === "trialing" &&
                subscription?.currentPeriodEnd && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Trial ends:
                      </p>
                      <span className="font-medium text-foreground">
                        {new Date(
                          subscription.currentPeriodEnd
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {isOwner && (
              <div className="flex flex-col gap-2">
                {currentPlan !== "enterprise" && (
                  <Button
                    variant="default"
                    onClick={() => {
                      const nextPlan =
                        currentPlan === "free"
                          ? "professional"
                          : currentPlan === "professional"
                          ? "business"
                          : "enterprise";
                      openUpgradeDialog(nextPlan as keyof typeof PLANS);
                    }}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                )}
                {currentPlan !== "free" && subscription?.hasSubscription && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </Button>
                    {!subscription?.cancelAtPeriodEnd && (
                      <Button
                        variant="outline"
                        className="text-red-600"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel Plan
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your organization's resource usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">
                  {analytics.usage.users} / {analytics.limits.maxUsers}
                </p>
                <Progress value={userUsagePercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {analytics.limits.maxUsers - analytics.usage.users} remaining
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="text-2xl font-bold">
                  {analytics.usage.teams} /{" "}
                  {analytics.limits.maxTeams === 99999
                    ? "∞"
                    : analytics.limits.maxTeams}
                </p>
                <Progress value={teamUsagePercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {analytics.limits.maxTeams === 99999
                    ? "Unlimited"
                    : `${
                        analytics.limits.maxTeams - analytics.usage.teams
                      } remaining`}
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">
                  {analytics.usage.storage} / {analytics.limits.maxStorage}
                </p>
                <Progress value={25} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {analytics.limits.maxStorage === "Unlimited"
                    ? "Unlimited"
                    : "75% available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your organization's needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(PLANS).map(([key, plan]) => {
              const isCurrent = currentPlan === key;
              const isUpgrade = plan.price > planDetails.price;

              return (
                <div
                  key={key}
                  className={`p-6 border rounded-lg space-y-4 ${
                    isCurrent
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  } ${plan.popular ? "relative" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-3xl font-bold mt-2">
                      {plan.monthlyPrice}
                      <span className="text-sm text-muted-foreground font-normal">
                        /month
                      </span>
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isOwner && (
                    <Button
                      className="w-full"
                      variant={
                        isCurrent
                          ? "outline"
                          : isUpgrade
                          ? "default"
                          : "secondary"
                      }
                      disabled={isCurrent || checkoutLoading || key === "free"}
                      onClick={() => {
                        if (key !== "free") {
                          openUpgradeDialog(key as keyof typeof PLANS);
                        }
                      }}
                    >
                      {checkoutLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isCurrent
                        ? "Current Plan"
                        : isUpgrade
                        ? "Upgrade"
                        : "Contact Sales"}
                      {isUpgrade && <Zap className="ml-2 h-4 w-4" />}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose
              access to premium features at the end of your billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
            >
              {cancelLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Upgrade to {selectedPlan && PLANS[selectedPlan].name}
            </DialogTitle>
            <DialogDescription>Choose your billing interval</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={billingInterval === "monthly" ? "default" : "outline"}
                onClick={() => setBillingInterval("monthly")}
                className="flex-1"
              >
                Monthly
                <br />
                {selectedPlan && PLANS[selectedPlan].monthlyPrice}/mo
              </Button>
              <Button
                variant={billingInterval === "annual" ? "default" : "outline"}
                onClick={() => setBillingInterval("annual")}
                className="flex-1"
              >
                Annual
                <br />
                {selectedPlan && PLANS[selectedPlan].yearlyPrice}/yr
                <Badge className="ml-2 bg-green-500">Save 20%</Badge>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedPlan) {
                  handleUpgradePlan(selectedPlan, billingInterval);
                }
              }}
              disabled={checkoutLoading}
            >
              {checkoutLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
