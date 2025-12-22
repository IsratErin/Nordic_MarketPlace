import { apiClient } from "../../../api/apiClient";
import { API_ENDPOINT } from "../../../api/endpoint";
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  User,
  RefreshTokenResponse,
} from "../types/auth.types";

class AuthServiceError extends Error {
  readonly code?: number;
  readonly originalError?: unknown;

  constructor(message: string, code?: number, originalError?: unknown) {
    super(message);
    this.name = "AuthServiceError";
    this.code = code;
    this.originalError = originalError;
  }
}

const authService = {
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        API_ENDPOINT.AUTH.Register,
        userData
      );
      return response;
    } catch (error) {
      throw new AuthServiceError("Failed to register user", undefined, error);
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINT.AUTH.Login,
        credentials
      );
      return response;
    } catch (error) {
      throw new AuthServiceError("Failed to login", undefined, error);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(API_ENDPOINT.AUTH.Logout);
    } catch (error) {
      throw new AuthServiceError("Failed to logout", undefined, error);
    }
  },

  async refreshToken(): Promise<RefreshTokenResponse | null> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINT.AUTH.Refresh,
        {} // empty body as cookies are sent automatically
      );
      return response;
    } catch {
      return null;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>("/auth/me");
      return response.user;
    } catch (error) {
      throw new AuthServiceError(
        "Failed to get current user",
        undefined,
        error
      );
    }
  },
};

export { authService, AuthServiceError };
