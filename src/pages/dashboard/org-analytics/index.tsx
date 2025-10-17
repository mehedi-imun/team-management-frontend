import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyOrganizationAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  AlertCircle,
  Building2,
  Database,
  HardDrive,
  Package,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

const OrganizationAnalyticsPage = () => {
  const { data, isLoading, error } = useGetMyOrganizationAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview of your organization's performance and usage
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (error) {
    const errorMessage = error && typeof error === 'object' && 'data' in error 
      ? (error.data as { message?: string })?.message 
      : undefined;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview of your organization's performance and usage
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage ||
              "Failed to load analytics data. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const analytics = data?.data;

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const { organization, members, roles, usage, limits } = analytics;

  // Calculate usage percentages
  const userUsagePercent = (usage.users / limits.maxUsers) * 100;
  const teamUsagePercent = (usage.teams / limits.maxTeams) * 100;

  // Parse storage strings (e.g., "2.5GB" -> 2.5)
  const parseStorage = (storageStr: string) => {
    const match = storageStr.match(/^([\d.]+)(GB|MB)$/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    return unit === "GB" ? value : value / 1024;
  };

  const currentStorage = parseStorage(usage.storage);
  const maxStorage = parseStorage(limits.maxStorage);
  const storageUsagePercent = (currentStorage / maxStorage) * 100;

  const statsCards = [
    {
      title: "Total Members",
      value: members.total,
      description: `${members.active} active, ${members.pending} pending`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Members",
      value: members.active,
      description: `${((members.active / members.total) * 100).toFixed(0)}% of total`,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Organization Owners",
      value: roles.owners,
      description: "Full access",
      icon: ShieldCheck,
      color: "text-purple-600",
    },
    {
      title: "Administrators",
      value: roles.admins,
      description: "Admin privileges",
      icon: UserPlus,
      color: "text-orange-600",
    },
    {
      title: "Team Count",
      value: usage.teams,
      description: `${limits.maxTeams - usage.teams} remaining`,
      icon: Package,
      color: "text-cyan-600",
    },
    {
      title: "Storage Used",
      value: usage.storage,
      description: `${limits.maxStorage} limit`,
      icon: HardDrive,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Analytics
          </h1>
          <p className="text-muted-foreground">
            {organization.name} • {organization.plan} Plan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              organization.status === "active"
                ? "bg-green-100 text-green-800"
                : organization.status === "pending_setup"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {organization.status}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              organization.subscriptionStatus === "active"
                ? "bg-green-100 text-green-800"
                : organization.subscriptionStatus === "trialing"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {organization.subscriptionStatus}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Member Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Members
                </span>
                <span className="text-sm font-medium">{members.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="text-sm font-medium text-green-600">
                  {members.active}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-sm font-medium text-yellow-600">
                  {members.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inactive</span>
                <span className="text-sm font-medium text-red-600">
                  {members.inactive}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role Distribution</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Owners</span>
                <span className="text-sm font-medium">{roles.owners}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Admins</span>
                <span className="text-sm font-medium">{roles.admins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="text-sm font-medium">{roles.members}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Capacity</span>
                <span className="text-xs text-muted-foreground">
                  {usage.users} / {limits.maxUsers}
                </span>
              </div>
              <Progress value={userUsagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(limits.maxUsers - usage.users)} users remaining
              </p>
            </div>

            {/* Team Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Capacity</span>
                <span className="text-xs text-muted-foreground">
                  {usage.teams} / {limits.maxTeams}
                </span>
              </div>
              <Progress value={teamUsagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {limits.maxTeams - usage.teams} teams remaining
              </p>
            </div>

            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Capacity</span>
                <span className="text-xs text-muted-foreground">
                  {usage.storage} / {limits.maxStorage}
                </span>
              </div>
              <Progress value={storageUsagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {((maxStorage - currentStorage) * 1024).toFixed(0)}MB remaining
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Plan & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Current Plan</h4>
              <div className="space-y-1">
                <p className="text-2xl font-bold capitalize">
                  {organization.plan}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {organization.subscriptionStatus}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Available Features</h4>
              <div className="flex flex-wrap gap-2">
                {limits.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Plan Limits</h4>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{limits.maxUsers}</span> max
                  users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{limits.maxTeams}</span> max
                  teams
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">{limits.maxStorage}</span>{" "}
                  storage
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Warnings */}
      {(userUsagePercent > 80 || teamUsagePercent > 80 || storageUsagePercent > 80) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> You're approaching your plan limits.
            {userUsagePercent > 80 && " User capacity is at " + userUsagePercent.toFixed(0) + "%."}
            {teamUsagePercent > 80 && " Team capacity is at " + teamUsagePercent.toFixed(0) + "%."}
            {storageUsagePercent > 80 && " Storage is at " + storageUsagePercent.toFixed(0) + "%."}
            {" "}Consider upgrading your plan to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default OrganizationAnalyticsPage;
