import { baseApi } from '../../baseApi';

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

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get analytics summary
    getAnalyticsSummary: builder.query<{ success: boolean; data: AnalyticsSummary }, void>({
      query: () => ({
        url: '/analytics/summary',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),
    
    // Get team distribution
    getTeamDistribution: builder.query<{ success: boolean; data: TeamDistribution[] }, void>({
      query: () => ({
        url: '/analytics/teams',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),
    
    // Get approval rates
    getApprovalRates: builder.query<{ success: boolean; data: ApprovalRates }, void>({
      query: () => ({
        url: '/analytics/approvals',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetTeamDistributionQuery,
  useGetApprovalRatesQuery,
} = analyticsApi;

export default analyticsApi;
