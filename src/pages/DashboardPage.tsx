import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/redux/hook";
import {
  Activity,
  Building2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: "Total Users",
      value: 0,
      icon: Users,
      description: "Registered users",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: 0,
      icon: UserCheck,
      description: "Active this month",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Teams",
      value: 0,
      icon: Building2,
      description: "Teams created",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Team Members",
      value: 0,
      icon: Activity,
      description: "Total members",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserRole = () => {
    if (!user) return "Member";

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
        <p className="text-muted-foreground">
          Here's what's happening with your teams today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user?.role === "Admin" && (
              <>
                <a
                  href="/teams"
                  className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Manage Teams</p>
                      <p className="text-sm text-muted-foreground">
                        Create and organize teams
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="/users"
                  className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Manage Users</p>
                      <p className="text-sm text-muted-foreground">
                        Add or update user accounts
                      </p>
                    </div>
                  </div>
                </a>
              </>
            )}
            <a
              href="/analytics"
              className="block p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-muted-foreground">
                    Check performance metrics
                  </p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
            <CardDescription>Your current organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Role</p>
              <p className="text-lg font-semibold">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {getUserRole()}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
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
