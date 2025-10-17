import { baseApi } from "../../baseApi";

export interface AnalyticsSummary {
  totalTeams: number;
  totalUsers: number;
  pendingApprovals: number;
  approvedTeams: number;
  rejectedTeams: number;
}

export interface TeamDistribution {
  _id: string;
  count: number;
}

export interface ApprovalRates {
  managerApprovalRate: number;
  directorApprovalRate: number;
  overallApprovalRate: number;
}

export interface OrganizationAnalytics {
  organization: {
    id: string;
    name: string;
    status: string;
    plan: string;
    subscriptionStatus: string;
  };
  members: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
  };
  roles: {
    owners: number;
    admins: number;
    members: number;
  };
  usage: {
    users: number;
    teams: number;
    storage: string;
  };
  limits: {
    maxUsers: number;
    maxTeams: number;
    maxStorage: string;
    features: string[];
  };
}

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get analytics summary
    getAnalyticsSummary: builder.query<
      { success: boolean; data: AnalyticsSummary },
      void
    >({
      query: () => ({
        url: "/analytics/summary",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    // Get team distribution
    getTeamDistribution: builder.query<
      { success: boolean; data: TeamDistribution[] },
      void
    >({
      query: () => ({
        url: "/analytics/teams",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    // Get approval rates
    getApprovalRates: builder.query<
      { success: boolean; data: ApprovalRates },
      void
    >({
      query: () => ({
        url: "/analytics/approvals",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),

    // Get organization analytics (Organization Owner only)
    getMyOrganizationAnalytics: builder.query<
      { success: boolean; data: OrganizationAnalytics },
      void
    >({
      query: () => ({
        url: "/analytics/my-organization",
        method: "GET",
      }),
      providesTags: ["OrganizationAnalytics"],
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetTeamDistributionQuery,
  useGetApprovalRatesQuery,
  useGetMyOrganizationAnalyticsQuery,
} = analyticsApi;

export default analyticsApi;
