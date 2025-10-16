import { baseApi } from '../../baseApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Director';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Director';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'Admin' | 'Manager' | 'Director';
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query<{ data: User[]; meta: Record<string, unknown> }, Record<string, string>>({
      query: (params = {}) => ({
        url: `/users?${new URLSearchParams(params).toString()}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    
    // Get user by ID
    getUserById: builder.query<{ success: boolean; data: User }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    
    // Create user
    createUser: builder.mutation<{ success: boolean; data: User }, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update user
    updateUser: builder.mutation<{ success: boolean; data: User }, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Delete user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Toggle user status
    toggleUserStatus: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Change password
    changePassword: builder.mutation<{ success: boolean }, ChangePasswordRequest>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useChangePasswordMutation,
} = userApi;

export default userApi;
