/**
 * Trial Management API
 * Endpoints for trial status and feature access checks
 */

import { baseApi } from "../../baseApi";
import type { TrialStatus, FeatureAccessResponse } from "../../../types/trial";

const trialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get trial status for current organization
    getTrialStatus: builder.query<
      { success: boolean; message: string; data: TrialStatus },
      void
    >({
      query: () => ({
        url: "/trial/status",
        method: "GET",
      }),
      providesTags: ["Trial"],
    }),

    // Check if organization can access features
    checkFeatureAccess: builder.query<
      { success: boolean; message: string; data: FeatureAccessResponse },
      void
    >({
      query: () => ({
        url: "/trial/can-access-features",
        method: "GET",
      }),
      providesTags: ["Trial"],
    }),
  }),
});

export const { useGetTrialStatusQuery, useCheckFeatureAccessQuery } = trialApi;

export default trialApi;
