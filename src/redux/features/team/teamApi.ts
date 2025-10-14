/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ITeam } from "../../../types";
import { baseApi } from "../../baseApi";

// Team API slice
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeams: builder.query<ITeam[], Record<string, any> | void>({
      query: (params: Record<string, any> = {}) => ({
        url: "/teams",
        method: "GET",
        params,
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
      query: (data) => (
        console.log(data),
        {
          url: "/teams",
          method: "POST",

          body: JSON.stringify(data),
        }
      ),
      invalidatesTags: ["Team"],
    }),

    // Update team
    updateTeam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/teams/${id}`,
        method: "PUT",

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
        data: { ids },
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
        value: 0 | 1 | 2;
      }) => ({
        url: `/teams/${teamId}/status`,
        method: "PATCH",
        data: { field, value },
      }),
      invalidatesTags: ["Team"],
    }),

    // Update team order (drag & drop)
    updateTeamOrder: builder.mutation({
      query: (order: { id: string; order: number }[]) => ({
        url: "/teams/order",
        method: "POST",
        data: { order },
      }),
      invalidatesTags: ["Team"],
    }),

    // Update a team member
    updateMember: builder.mutation({
      query: ({
        teamId,
        memberId,
        data,
      }: {
        teamId: string;
        memberId: string;
        data: any;
      }) => ({
        url: `/teams/${teamId}/members/${memberId}`,
        method: "PATCH",
        data,
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
} = teamApi;
