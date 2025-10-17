/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ITeam } from "../../../types";
import { baseApi } from "../../baseApi";

// Team API slice
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeams: builder.query<ITeam[], Record<string, any> | void>({
      query: (params: Record<string, any> = {}) => ({
        url: `/teams?${new URLSearchParams(params).toString()}`,
        method: "GET",
      }),
      providesTags: ["Team"],
      transformResponse: (response: any) => response?.data || [],
    }),

    // Fetch single team by ID
    getTeamById: builder.query({
      query: (id: string) => ({
        url: `/teams/${id}`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),

    // Create new team
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/teams",
        method: "POST",

        body: JSON.stringify(data),
      }),
      invalidatesTags: ["Team"],
    }),

    // Update team
    updateTeam: builder.mutation({
      // { teamId: team._id, data: formData }
      query: ({ teamId, data }) => ({
        url: `/teams/${teamId}`,
        method: "PATCH",

        body: JSON.stringify(data),
      }),
      invalidatesTags: ["Team"],
    }),

    // Delete single team
    deleteTeam: builder.mutation({
      query: (id: string) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    // Bulk delete teams
    bulkDeleteTeams: builder.mutation({
      query: (ids: string[]) => ({
        url: "/teams",
        method: "DELETE",
        body: JSON.stringify({ ids }),
      }),
      invalidatesTags: ["Team"],
    }),

    // Update tri-state approval status
    updateApprovalStatus: builder.mutation({
      query: ({
        teamId,
        field,
        value,
      }: {
        teamId: string;
        field: "managerApproved" | "directorApproved";
        value: "0" | "1" | "-1";
      }) => ({
        url: `/teams/${teamId}/status`,
        method: "PATCH",
        body: JSON.stringify({ field, value }),
      }),

      invalidatesTags: ["Team"],
    }),

    // Update team order (drag & drop)
    updateTeamOrder: builder.mutation({
      query: (orderList: { id: string; order: number }[]) => ({
        url: "/teams/order",
        method: "POST",
        body: JSON.stringify({ orderList }),
      }),
      invalidatesTags: ["Team"],
    }),

    // Update a team member
    updateMember: builder.mutation({
      query: ({
        teamId,
        memberId,
        name,
      }: {
        teamId: string;
        memberId: string;
        name: any;
      }) => ({
        url: `/teams/${teamId}/members/${memberId}`,
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),
      invalidatesTags: ["Team"],
    }),

    // Delete a team member
    deleteMember: builder.mutation({
      query: ({ teamId, memberId }: { teamId: string; memberId: string }) => ({
        url: `/teams/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    // Add member to team
    addMember: builder.mutation({
      query: ({
        teamId,
        data,
      }: {
        teamId: string;
        data: { email: string; name?: string; role?: "TeamLead" | "Member" };
      }) => ({
        url: `/teams/${teamId}/members`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: ["Team"],
    }),

    // Assign manager to team
    assignManager: builder.mutation({
      query: ({ teamId, managerId }: { teamId: string; managerId: string }) => ({
        url: `/teams/${teamId}/manager`,
        method: "PATCH",
        body: JSON.stringify({ managerId }),
      }),
      invalidatesTags: ["Team"],
    }),

    // Get teams managed by current user
    getMyManagedTeams: builder.query({
      query: () => ({
        url: "/teams/my-managed-teams",
        method: "GET",
      }),
      providesTags: ["Team"],
      transformResponse: (response: any) => response?.data || [],
    }),

    // Get teams with pagination (new endpoint)
    getTeams: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" }) => ({
        url: `/teams?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useBulkDeleteTeamsMutation,
  useUpdateApprovalStatusMutation,
  useUpdateTeamOrderMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useAddMemberMutation,
  useAssignManagerMutation,
  useGetMyManagedTeamsQuery,
  useGetTeamsQuery,
} = teamApi;
