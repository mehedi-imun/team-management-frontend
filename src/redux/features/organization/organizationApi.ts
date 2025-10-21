import { baseApi } from "../../baseApi";

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
  plan: "free" | "professional" | "business" | "enterprise";
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  status: "pending_setup" | "active" | "suspended";
  limits: {
    maxUsers: number;
    maxTeams: number;
    maxStorage: string;
    features: string[];
  };
  usage: {
    users: number;
    teams: number;
    storage: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
  plan?: "free" | "professional" | "business" | "enterprise";
}

export interface CreateOrganizationWithSetupDto {
  name: string;
  slug: string;
  ownerEmail: string;
  ownerName: string;
  plan?: "professional" | "business" | "enterprise";
}

export interface UpdateOrganizationDto {
  name?: string;
  slug?: string;
}

export interface OrganizationMember {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  role: string;
  status?: "active" | "inactive" | "pending";
  joinedAt?: string;
  teams?: string[];
  isActive?: boolean;
}

export interface OrganizationStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  inactiveMembers: number;
  totalTeams: number;
  daysLeftInTrial?: number;
}

const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's organizations
    getOrganizations: builder.query<
      { success: boolean; data: Organization[] },
      void
    >({
      query: () => "/organizations",
      providesTags: ["Organization"],
    }),

    // Get organization by ID
    getOrganization: builder.query<
      { success: boolean; data: Organization },
      string
    >({
      query: (id) => `/organizations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Organization", id }],
    }),

    // Create organization
    createOrganization: builder.mutation<
      { success: boolean; data: Organization },
      CreateOrganizationDto
    >({
      query: (data) => ({
        url: "/organizations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Update organization
    updateOrganization: builder.mutation<
      { success: boolean; data: Organization },
      { id: string; data: UpdateOrganizationDto }
    >({
      query: ({ id, data }) => ({
        url: `/organizations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Organization", id },
        "Organization",
      ],
    }),

    // Delete organization
    deleteOrganization: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),

    // Admin: Create organization with setup token
    createOrganizationWithSetup: builder.mutation<
      { success: boolean; data: Organization; message: string },
      CreateOrganizationWithSetupDto
    >({
      query: (data) => ({
        url: "/organizations/create-with-setup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Admin: Get all organizations (Platform Admin only)
    getAllOrganizations: builder.query<
      {
        success: boolean;
        data: Organization[];
        meta?: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/organizations/all",
        params,
      }),
      providesTags: ["Organization"],
    }),

    // Get organization members
    getOrganizationMembers: builder.query<
      { data: OrganizationMember[]; meta: any },
      { organizationId: string; page?: number; limit?: number; search?: string }
    >({
      query: ({ organizationId, page = 1, limit = 10, search = "" }) => ({
        url: `/organizations/${organizationId}/members?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (response: any) => response || { data: [], meta: {} },
    }),

    // Get organization stats for current user's organization
    getMyOrganizationStats: builder.query<OrganizationStats, void>({
      query: () => ({
        url: "/organizations/stats",
        method: "GET",
      }),
      providesTags: ["Organization"],
      transformResponse: (response: any) =>
        response?.data || {
          totalMembers: 0,
          activeMembers: 0,
          pendingMembers: 0,
          inactiveMembers: 0,
          totalTeams: 0,
          daysLeftInTrial: undefined,
        },
    }),

    // Invite member
    inviteMember: builder.mutation<
      any,
      { email: string; name?: string; role?: string }
    >({
      query: (data) => ({
        url: "/invitations/send",
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: ["User", "Invitation"],
    }),

    // Update member status
    updateMemberStatus: builder.mutation<
      any,
      { userId: string; isActive: boolean }
    >({
      query: ({ userId, isActive }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
      invalidatesTags: ["User"],
    }),

    // Remove member
    removeMember: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Team"],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useCreateOrganizationWithSetupMutation,
  useGetAllOrganizationsQuery,
  useGetOrganizationMembersQuery,
  useGetMyOrganizationStatsQuery,
  useInviteMemberMutation,
  useUpdateMemberStatusMutation,
  useRemoveMemberMutation,
} = organizationApi;
