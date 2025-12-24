import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService, AuthServiceError } from "../services/authService";
import type {
  LoginCredentials,
  RegisterData,
  AuthState,
} from "../types/auth.types";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AuthServiceError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

const registerUser = createAsyncThunk<
  { message: string },
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    return await authService.register(userData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const loginUser = createAsyncThunk<
  {
    user: AuthState["user"];
    accessToken: string;
  },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    // Just store access token in Redux (ignore refresh token for now)
    console.log("Login response:", response);
    return {
      user: response.user,
      accessToken: response.accessToken,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// No token persistence across page refresh for now
const initializeAuth = createAsyncThunk<
  {
    user: AuthState["user"];
    accessToken: string;
  } | null,
  void,
  { rejectValue: string }
>("auth/initialize", async () => {
  // No stored auth state - user must login again after page refresh
  // authservice.refreshToken could be used here to get a new access token using the refresh token cookie
  // authservice.getCurrentUser could be used later to get user details
  return null;
});

export { registerUser, loginUser, logoutUser, initializeAuth };
