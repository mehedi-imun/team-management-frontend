import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useGetSubscriptionQuery } from "../redux/features/billing/billingApi";
import type { RootState } from "../redux/store";

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "blue",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendLabel?: string;
  color?: "blue" | "green" | "purple" | "orange";
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trendLabel && (
        <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
      )}
    </div>
  );
}

// Quick Action Card
function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  color = "indigo",
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color?: string;
}) {
  return (
    <Link
      to={href}
      className="group bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center group-hover:bg-${color}-200 transition-colors`}
        >
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: subscription } = useGetSubscriptionQuery();

  const isAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
  const currentPlan = subscription?.data?.plan || "free";

  // Mock data (replace with real API calls)
  const stats = {
    teams: 12,
    members: 47,
    activeTeams: 10,
    pendingApprovals: 3,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-indigo-100 mb-6">
          Here's what's happening with your teams today.
        </p>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
            asChild
          >
            <Link to="/teams/new">Create New Team</Link>
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <Link to="/invitations">Invite Members</Link>
          </Button>
        </div>
      </div>

      {/* Plan Upgrade Banner (if FREE plan) */}
      {currentPlan === "free" && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  You're on the FREE plan
                </h3>
                <p className="text-sm text-gray-600">
                  Upgrade to unlock more users, teams, and advanced features
                </p>
              </div>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              asChild
            >
              <Link to="/billing">Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Teams"
          value={stats.teams}
          icon={UsersRound}
          trend="+12%"
          trendLabel="vs last month"
          color="blue"
        />
        <StatCard
          title="Total Members"
          value={stats.members}
          icon={Users}
          trend="+8%"
          trendLabel="vs last month"
          color="green"
        />
        <StatCard
          title="Active Teams"
          value={stats.activeTeams}
          icon={Building2}
          color="purple"
        />
        {isAdmin && (
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={TrendingUp}
            color="orange"
          />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            title="Create Team"
            description="Set up a new team and add members"
            icon={UsersRound}
            href="/teams/new"
            color="blue"
          />
          <QuickAction
            title="Invite Members"
            description="Send email invitations to join teams"
            icon={Users}
            href="/invitations"
            color="green"
          />
          {isAdmin && (
            <QuickAction
              title="View Analytics"
              description="Check team performance and metrics"
              icon={TrendingUp}
              href="/analytics"
              color="purple"
            />
          )}
          <QuickAction
            title="Manage Billing"
            description="View plans and manage subscription"
            icon={CreditCard}
            href="/billing"
            color="orange"
          />
          <QuickAction
            title="Organization Settings"
            description="Configure your organization details"
            icon={Building2}
            href="/organization"
            color="indigo"
          />
          {isAdmin && (
            <QuickAction
              title="User Management"
              description="Add, edit, or remove users"
              icon={Users}
              href="/users"
              color="pink"
            />
          )}
        </div>
      </div>

      {/* Recent Activity (Admin only) */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "Team created",
                name: "Development Team",
                time: "2 hours ago",
              },
              {
                action: "Member invited",
                name: "john@example.com",
                time: "5 hours ago",
              },
              {
                action: "Team approved",
                name: "Marketing Team",
                time: "1 day ago",
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/reports">View All Activity</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
