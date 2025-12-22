import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export function useAuth() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const isAdmin = user?.role === "ADMIN";
  return { user, isAuthenticated, isAdmin };
}
