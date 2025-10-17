import { baseApi } from "../../baseApi";

export interface Invitation {
  _id: string;
  organizationId: string;
  teamId: string;
  invitedBy: string;
  email: string;
  role: string;
  token: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  team?: {
    _id: string;
    name: string;
  };
  inviter?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateInvitationDto {
  email: string;
  teamId: string;
  role: string;
}

export interface AcceptInvitationDto {
  token: string;
  name: string;
  password: string;
}

const invitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create invitation
    createInvitation: builder.mutation<
      { success: boolean; data: Invitation; message: string },
      CreateInvitationDto
    >({
      query: (data) => ({
        url: "/invitations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invitation"],
    }),

    // Accept invitation (public endpoint)
    acceptInvitation: builder.mutation<
      {
        success: boolean;
        data: {
          user: { _id: string; name: string; email: string };
          accessToken: string;
        };
        message: string;
      },
      AcceptInvitationDto
    >({
      query: (data) => ({
        url: "/invitations/accept",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invitation", "User", "Team"],
    }),

    // Validate invitation token (public endpoint)
    validateInvitation: builder.query<
      {
        success: boolean;
        data: {
          invitation: Invitation;
          organization: { _id: string; name: string; slug: string };
          team: { _id: string; name: string };
        };
      },
      string
    >({
      query: (token) => `/invitations/validate?token=${token}`,
    }),

    // Get invitations for organization
    getInvitations: builder.query<
      {
        success: boolean;
        data: Invitation[];
        meta?: {
          total: number;
          page: number;
          limit: number;
        };
      },
      {
        page?: number;
        limit?: number;
        status?: "pending" | "accepted" | "revoked" | "expired";
        teamId?: string;
      }
    >({
      query: (params) => ({
        url: "/invitations",
        params,
      }),
      providesTags: ["Invitation"],
    }),

    // Revoke invitation
    revokeInvitation: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/invitations/${id}/revoke`,
        method: "PATCH",
      }),
      invalidatesTags: ["Invitation"],
    }),

    // Resend invitation
    resendInvitation: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/invitations/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["Invitation"],
    }),
  }),
});

export const {
  useCreateInvitationMutation,
  useAcceptInvitationMutation,
  useValidateInvitationQuery,
  useGetInvitationsQuery,
  useRevokeInvitationMutation,
  useResendInvitationMutation,
} = invitationApi;
