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
