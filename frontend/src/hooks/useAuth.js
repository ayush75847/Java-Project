import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Any component can do: const { user, isAdmin, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
