import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMyOrganizationStatsQuery } from "@/redux/features/organization/organizationApi";
import {
  useGetUserStatsQuery,
  useGetOrganizationStatsQuery as usePlatformOrgStatsQuery,
} from "@/redux/features/platform/platformApi";
import { useAppSelector } from "@/redux/hook";
import {
  Activity,
  Building2,
  Clock,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Fetch stats based on user role
  const isAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
  const isOrgOwner = user?.role === "OrgOwner";

  // Platform admins see platform stats
  const { data: userStatsData, isLoading: isLoadingUserStats } =
    useGetUserStatsQuery(undefined, { skip: !isAdmin });

  const { data: platformOrgStatsData, isLoading: isLoadingPlatformOrgStats } =
    usePlatformOrgStatsQuery(undefined, { skip: !isAdmin });

  // Organization owners see their org stats
  const { data: orgOwnerStatsData, isLoading: isLoadingOrgOwnerStats } =
    useGetMyOrganizationStatsQuery(undefined, { skip: !isOrgOwner || isAdmin });

  const isLoading =
    isLoadingUserStats || isLoadingPlatformOrgStats || isLoadingOrgOwnerStats;
  const userStats = userStatsData?.data;
  const orgStats = isAdmin ? platformOrgStatsData?.data : orgOwnerStatsData;

  const getStats = () => {
    if (isAdmin) {
      // Admin/SuperAdmin sees platform-wide stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const platformOrgStats = orgStats as any; // Platform stats from analytics API
      return [
        {
          title: "Total Users",
          value: userStats?.totalUsers || 0,
          icon: Users,
          description: `${userStats?.activeUsers || 0} active`,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          title: "Organizations",
          value: platformOrgStats?.totalOrganizations || 0,
          icon: Building2,
          description: `${platformOrgStats?.activeSubscriptions || 0} active`,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          title: "Active Trials",
          value: platformOrgStats?.trialOrganizations || 0,
          icon: Activity,
          description: "Trial subscriptions",
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
        {
          title: "Monthly Revenue",
          value: `$${platformOrgStats?.monthlyRevenue?.toLocaleString() || 0}`,
          icon: TrendingUp,
          description: "This month",
          color: "text-orange-600",
          bg: "bg-orange-100",
        },
      ];
    }

    if (isOrgOwner) {
      // Organization owners see their org stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ownerOrgStats = orgStats as any; // Org stats from organization API
      return [
        {
          title: "Total Members",
          value: ownerOrgStats?.totalMembers || 0,
          icon: Users,
          description: `${ownerOrgStats?.activeMembers || 0} active`,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          title: "Pending Members",
          value: ownerOrgStats?.pendingMembers || 0,
          icon: Clock,
          description: "Awaiting approval",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        },
        {
          title: "Total Teams",
          value: ownerOrgStats?.totalTeams || 0,
          icon: Building2,
          description: "Active teams",
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          title: "Trial Days Left",
          value: ownerOrgStats?.daysLeftInTrial ?? "N/A",
          icon: Activity,
          description: "Trial period",
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
      ];
    }

    // Regular users see placeholder stats
    return [
      {
        title: "My Teams",
        value: 0,
        icon: Building2,
        description: "Teams you're in",
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      {
        title: "Active Tasks",
        value: 0,
        icon: Activity,
        description: "Pending tasks",
        color: "text-green-600",
        bg: "bg-green-100",
      },
      {
        title: "Team Members",
        value: 0,
        icon: Users,
        description: "Total members",
        color: "text-purple-600",
        bg: "bg-purple-100",
      },
      {
        title: "Completion Rate",
        value: "0%",
        icon: TrendingUp,
        description: "This week",
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
    ];
  };

  const stats = getStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserRole = () => {
    if (!user) return "Member";

    // Map roles to display names
    const roleMap: Record<string, string> = {
      SuperAdmin: "Platform Super Administrator",
      Admin: "Platform Administrator",
      OrgOwner: "Organization Owner",
      OrgAdmin: "Organization Administrator",
      OrgMember: "Organization Member",
    };

    return roleMap[user.role] || user.role;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your {isAdmin ? "platform" : "teams"}{" "}
          today.
        </p>
      </div>

      {/* Stats Grid */}
      {isAdmin && isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isAdmin ? (
              <>
                <a
                  href="/dashboard/organizations"
                  className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Manage Organizations</p>
                      <p className="text-sm text-gray-500">
                        View and manage all organizations
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="/dashboard/users"
                  className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Manage Users</p>
                      <p className="text-sm text-gray-500">
                        Add or update user accounts
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="/dashboard/platform-analytics"
                  className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm text-gray-500">
                        Platform performance metrics
                      </p>
                    </div>
                  </div>
                </a>
              </>
            ) : (
              <a
                href="/dashboard/my-teams"
                className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">My Teams</p>
                    <p className="text-sm text-gray-500">View your teams</p>
                  </div>
                </div>
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? "Platform Info" : "Your Info"}</CardTitle>
            <CardDescription>
              {isAdmin ? "Platform statistics" : "Your account details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="text-lg font-semibold">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {getUserRole()}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            {isAdmin && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Platform Admins</p>
                  <p className="font-medium">
                    {(userStats?.superAdmins || 0) + (userStats?.admins || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="font-medium">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    ${(orgStats as any)?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
