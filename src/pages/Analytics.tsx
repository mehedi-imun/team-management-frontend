import { BarChart3, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useGetAnalyticsSummaryQuery, useGetApprovalRatesQuery } from '../redux/features/analytics/analyticsApi';

const Analytics = () => {
  const { data: summaryData, isLoading: summaryLoading } = useGetAnalyticsSummaryQuery();
  const { data: ratesData, isLoading: ratesLoading } = useGetApprovalRatesQuery();

  const summary = summaryData?.data;
  const rates = ratesData?.data;

  if (summaryLoading || ratesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Teams',
      value: summary?.totalTeams || 0,
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Users',
      value: summary?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Approved Teams',
      value: summary?.approvedTeams || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Rejected Teams',
      value: summary?.rejectedTeams || 0,
      icon: XCircle,
      color: 'bg-red-500',
    },
    {
      name: 'Pending Approvals',
      value: summary?.pendingApprovals || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Rates */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Approval Rates</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Manager Approval Rate</span>
              <span className="font-medium">{rates?.managerApprovalRate?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rates?.managerApprovalRate || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Director Approval Rate</span>
              <span className="font-medium">{rates?.directorApprovalRate?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rates?.directorApprovalRate || 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Approval Rate</span>
              <span className="font-medium">{rates?.overallApprovalRate?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rates?.overallApprovalRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">Activity tracking coming soon...</p>
      </div>
    </div>
  );
};

export default Analytics;
