import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetPlatformAnalyticsQuery } from "@/redux/features/platform/platformApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Building2,
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  AlertCircle,
} from "lucide-react";

const PlatformAnalyticsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const isAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";

  // Redirect organization owners to their own analytics page
  useEffect(() => {
    if (user && !isAdmin && user.isOrganizationOwner) {
      navigate("/dashboard/org-analytics", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const { data, isLoading, error } = useGetPlatformAnalyticsQuery(undefined, {
    skip: !isAdmin, // Skip query if not admin
  });

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview of platform performance and statistics
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view platform analytics. 
            This page is only accessible to Super Admins and Admins.
            {user?.isOrganizationOwner && (
              <span className="block mt-2">
                Redirecting to your organization analytics...
              </span>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview of platform performance and statistics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.data;

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Monthly Revenue",
      value: `$${stats.revenue?.monthly?.toLocaleString() || 0}`,
      description: "Current month revenue",
      icon: DollarSign,
      trend: `${stats.revenue?.growth || 0}% growth`,
    },
    {
      title: "Yearly Revenue",
      value: `$${stats.revenue?.yearly?.toLocaleString() || 0}`,
      description: "Current year revenue",
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Total Organizations",
      value: stats.organizations?.totalOrganizations || 0,
      description: `${stats.organizations?.activeSubscriptions || 0} active`,
      icon: Building2,
      trend: null,
    },
    {
      title: "Total Users",
      value: stats.users?.totalUsers || 0,
      description: `${stats.users?.activeUsers || 0} active users`,
      icon: Users,
      trend: null,
    },
    {
      title: "Trial Organizations",
      value: stats.organizations?.trialOrganizations || 0,
      description: "Currently in trial",
      icon: Package,
      trend: null,
    },
    {
      title: "Suspended Orgs",
      value: stats.organizations?.suspendedOrganizations || 0,
      description: "Suspended organizations",
      icon: UserCheck,
      trend: null,
    },
    {
      title: "Super Admins",
      value: stats.users?.superAdmins || 0,
      description: "Platform administrators",
      icon: CreditCard,
      trend: null,
    },
    {
      title: "Organization Owners",
      value: stats.users?.organizationOwners || 0,
      description: "Active org owners",
      icon: UserPlus,
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into your platform performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.trend && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  {stat.trend} from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Super Admins
              </span>
              <span className="text-sm font-medium">
                {stats.users?.superAdmins || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admins</span>
              <span className="text-sm font-medium">
                {stats.users?.admins || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Organization Owners
              </span>
              <span className="text-sm font-medium">
                {stats.users?.organizationOwners || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Organization Admins
              </span>
              <span className="text-sm font-medium">
                {stats.users?.organizationAdmins || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Members</span>
              <span className="text-sm font-medium">
                {stats.users?.members || 0}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Active Users
              </span>
              <span className="text-sm font-medium text-green-600">
                {stats.users?.activeUsers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Inactive Users
              </span>
              <span className="text-sm font-medium text-orange-600">
                {stats.users?.inactiveUsers || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Organizations
              </span>
              <span className="text-sm font-medium">
                {stats.organizations?.totalOrganizations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trial</span>
              <span className="text-sm font-medium">
                {stats.organizations?.trialOrganizations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="text-sm font-medium text-green-600">
                {stats.organizations?.activeSubscriptions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Suspended</span>
              <span className="text-sm font-medium text-orange-600">
                {stats.organizations?.suspendedOrganizations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancelled</span>
              <span className="text-sm font-medium text-red-600">
                {stats.organizations?.cancelledOrganizations || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      {stats.revenue && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Monthly Revenue
              </span>
              <span className="text-sm font-medium">
                ${stats.revenue.monthly?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Yearly Revenue
              </span>
              <span className="text-sm font-medium">
                ${stats.revenue.yearly?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Revenue
              </span>
              <span className="text-sm font-medium">
                ${stats.organizations?.totalRevenue?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Revenue Growth
              </span>
              <span className="text-sm font-medium text-green-600">
                {stats.revenue.growth || 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlatformAnalyticsPage;
