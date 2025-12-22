export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  name?: string | null;
  address?: string | null;
  role: Role;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterData {
  email: string;
  password: string;
  name?: string | null;
  address?: string | null;
  role?: Role;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}
export interface RefreshTokenResponse {
  accessToken: string;
}
