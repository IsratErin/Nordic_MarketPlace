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

export const registerUser = createAsyncThunk<
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

export const loginUser = createAsyncThunk<
  {
    user: AuthState["user"];
    accessToken: string;
  },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    console.log("Login response:", response);
    return {
      user: response.user,
      accessToken: response.accessToken,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const initializeAuth = createAsyncThunk<
  {
    user: AuthState["user"];
    accessToken: string;
  } | null,
  void,
  { rejectValue: string }
>("auth/initialize", async () => {
  return null;
});
