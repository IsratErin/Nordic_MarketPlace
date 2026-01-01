import { createSlice } from "@reduxjs/toolkit";
import type { User, AuthState as BaseAuthState } from "../types/auth.types";
import type { PayloadAction } from "@reduxjs/toolkit";

// Extending AuthState to include loading and error states
export interface AuthState extends BaseAuthState {
  loading: boolean;
  error: string | null;
}

// Initial state for authentication
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Used string patterns instead of "addCase" to avoid circular dependency
    builder
      // Register
      .addMatcher(
        (action) => action.type === "auth/register/pending",
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/register/fulfilled",
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/register/rejected",
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? "Registration failed";
        }
      )
      // Login
      .addMatcher(
        (action) => action.type === "auth/login/pending",
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/login/fulfilled",
        (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/login/rejected",
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? "Login failed";
        }
      )
      // Logout
      .addMatcher(
        (action) => action.type === "auth/logout/pending",
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/logout/fulfilled",
        (state) => {
          state.loading = false;
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === "auth/logout/rejected",
        (state) => {
          state.loading = false;
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
        }
      );
  },
});

export const { setAuth, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
