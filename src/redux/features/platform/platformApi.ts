import { baseApi } from "../../baseApi";

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  plan: "free" | "professional" | "business" | "enterprise";
  status: "trial" | "active" | "suspended" | "cancelled";
  trialEndsAt: string;
  subscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodEnd?: string;
  teamLimit: number;
  memberLimit: number;
  storageLimit: number;
  currentTeamCount: number;
  currentMemberCount: number;
  currentStorageUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  trialOrganizations: number;
  suspendedOrganizations: number;
  cancelledOrganizations: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "SuperAdmin" | "Admin" | "Member";
  organizationId?: string;
  isOrganizationOwner: boolean;
  isOrganizationAdmin: boolean;
  managedTeamIds: string[];
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  superAdmins: number;
  admins: number;
  organizationOwners: number;
  organizationAdmins: number;
  members: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

const platformApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Organization endpoints
    getAllOrganizations: builder.query<
      { success: boolean; data: Organization[]; meta: PaginationMeta },
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        plan?: string;
      }
    >({
      query: (params) => ({
        url: "/organizations",
        params,
      }),
      providesTags: ["Organization"],
    }),

    getOrganizationById: builder.query<
      { success: boolean; data: Organization },
      string
    >({
      query: (id) => `/organizations/${id}`,
      providesTags: ["Organization"],
    }),

    getOrganizationStats: builder.query<
      { success: boolean; data: OrganizationStats },
      void
    >({
      query: () => "/analytics/organizations",
      providesTags: ["Analytics"],
    }),

    updateOrganizationStatus: builder.mutation<
      { success: boolean; data: Organization },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/organizations/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Organization", "Analytics"],
    }),

    deleteOrganization: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization", "Analytics"],
    }),

    // User endpoints
    getAllUsers: builder.query<
      { success: boolean; data: User[]; meta: PaginationMeta },
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      }
    >({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),

    getUserById: builder.query<{ success: boolean; data: User }, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    getUserStats: builder.query<{ success: boolean; data: UserStats }, void>({
      query: () => "/analytics/users",
      providesTags: ["Analytics"],
    }),

    updateUserRole: builder.mutation<
      { success: boolean; data: User },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User", "Analytics"],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; data: User },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User", "Analytics"],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/users/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["User", "Analytics"],
      }
    ),

    // Platform Analytics
    getPlatformAnalytics: builder.query<
      {
        success: boolean;
        data: {
          organizations: OrganizationStats;
          users: UserStats;
          revenue: {
            monthly: number;
            yearly: number;
            growth: number;
          };
        };
      },
      void
    >({
      query: () => "/analytics/platform",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAllOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useGetOrganizationStatsQuery,
  useUpdateOrganizationStatusMutation,
  useDeleteOrganizationMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetPlatformAnalyticsQuery,
} = platformApi;
