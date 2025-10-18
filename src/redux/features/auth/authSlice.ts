import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface User {
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
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean; // Track if password change is required
}

// Load user from localStorage on initialization
const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  mustChangePassword: loadUserFromStorage()?.mustChangePassword || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.mustChangePassword = action.payload.mustChangePassword || false;
      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.mustChangePassword = false;
      // Clear from localStorage
      localStorage.removeItem("user");
    },
    clearMustChangePassword: (state) => {
      state.mustChangePassword = false;
      if (state.user) {
        state.user.mustChangePassword = false;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, clearUser, clearMustChangePassword } =
  authSlice.actions;
export default authSlice.reducer;
