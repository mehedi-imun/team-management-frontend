import { baseApi } from "../../baseApi";

export interface SubscriptionDetails {
  organizationId: string;
  plan: "free" | "professional" | "business" | "enterprise";
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CreateCheckoutDto {
  plan: "professional" | "business" | "enterprise";
  interval: "monthly" | "annual";
}

const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Stripe checkout session
    createCheckout: builder.mutation<
      {
        success: boolean;
        data: { sessionId: string; url: string };
        message: string;
      },
      CreateCheckoutDto
    >({
      query: (data) => ({
        url: "/billing/create-checkout",
        method: "POST",
        body: data,
      }),
    }),

    // Verify checkout session
    verifyCheckout: builder.query<
      {
        success: boolean;
        data: {
          organization: {
            _id: string;
            name: string;
            plan: string;
            subscriptionStatus: string;
          };
          subscription: {
            id: string;
            status: string;
            currentPeriodEnd: string;
          };
        };
        message: string;
      },
      string
    >({
      query: (sessionId) => `/billing/verify-checkout?session_id=${sessionId}`,
      providesTags: ["Billing", "Organization"],
    }),

    // Create customer portal session
    createPortal: builder.mutation<
      { success: boolean; data: { url: string }; message: string },
      void
    >({
      query: () => ({
        url: "/billing/create-portal",
        method: "POST",
      }),
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/billing/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Organization"],
    }),

    // Reactivate subscription
    reactivateSubscription: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/billing/reactivate",
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Organization"],
    }),

    // Get subscription details
    getSubscription: builder.query<
      { success: boolean; data: SubscriptionDetails },
      void
    >({
      query: () => "/billing/subscription",
      providesTags: ["Billing"],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useVerifyCheckoutQuery,
  useLazyVerifyCheckoutQuery,
  useCreatePortalMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useGetSubscriptionQuery,
} = billingApi;
