import TrialBanner from "@/components/trial/TrialBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyOrganizationStatsQuery } from "@/redux/features/organization/organizationApi";
import { useAppSelector } from "@/redux/hook";
import { Clock, UserCheck, Users, UsersRound, UserX } from "lucide-react";

interface OrganizationStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  inactiveMembers: number;
  totalTeams: number;
  daysLeftInTrial?: number;
}

const OrganizationOverviewPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const organizationId = user?.organizationId;

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    error,
  } = useGetMyOrganizationStatsQuery(undefined, {
    skip: !organizationId,
    refetchOnMountOrArgChange: true,
  });

  // Handle nested response structure
  const stats = ((statsResponse as { data?: OrganizationStats })?.data ||
    statsResponse ||
    {}) as OrganizationStats;

  if (isStatsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load organization overview
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Trial Banner - Only for organization users */}
      <TrialBanner />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Overview
        </h1>
        <p className="text-muted-foreground">
          Dashboard overview of your organization's key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              All organization members
            </p>
          </CardContent>
        </Card>

        {/* Active Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.activeMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        {/* Pending Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Members
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats?.pendingMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        {/* Inactive Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Members
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.inactiveMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Not currently active
            </p>
          </CardContent>
        </Card>

        {/* Total Teams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeams || 0}</div>
            <p className="text-xs text-muted-foreground">Active teams</p>
          </CardContent>
        </Card>

        {/* Trial Days Left */}
        {stats?.daysLeftInTrial !== undefined && (
          <Card className="border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trial Status
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.daysLeftInTrial} days
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining in trial
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions or Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Navigate to different sections using the sidebar to manage your
            organization.
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <a
              href="/dashboard/org/members"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Manage Members</span>
            </a>
            <a
              href="/dashboard/org/teams"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <UsersRound className="h-4 w-4" />
              <span className="text-sm font-medium">View Teams</span>
            </a>
            <a
              href="/dashboard/org/billing"
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Manage Billing</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationOverviewPage;
