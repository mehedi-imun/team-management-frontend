import { baseApi } from "../../baseApi";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForceChangePasswordRequest,
} from "../../../types/password";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: "SuperAdmin" | "Admin" | "OrgOwner" | "OrgAdmin" | "OrgMember";
      organizationId?: string;
      organizationIds?: string[];
      mustChangePassword?: boolean;
      isActive: boolean;
      firstLogin?: string;
      lastLoginAt?: string;
    };
    accessToken: string;
    refreshToken: string;
    mustChangePassword?: boolean; // Top-level flag for easy access
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  organizationSlug: string;
}

export interface SetupOrganizationRequest {
  token: string;
  name: string;
  password: string;
  organizationName: string;
  organizationSlug: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Organization", "User"],
    }),

    setupOrganization: builder.mutation<
      LoginResponse,
      SetupOrganizationRequest
    >({
      query: (data) => ({
        url: "/auth/setup-organization",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization", "User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    // Password change endpoints
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forceChangePassword: builder.mutation<
      ChangePasswordResponse,
      ForceChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/force-change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSetupOrganizationMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForceChangePasswordMutation,
} = authApi;

export default authApi;
