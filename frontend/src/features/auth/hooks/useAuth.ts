import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export function useAuth() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const isAdmin = user?.role === "ADMIN";

  console.log("useAuth - user:", user);
  console.log("useAuth - isAdmin:", isAdmin);

  return { user, isAuthenticated, isAdmin };
}
