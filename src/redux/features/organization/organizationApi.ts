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
      providesTags: (_result, _error, id) => [
        { type: "Organization", id },
      ],
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
} = organizationApi;
