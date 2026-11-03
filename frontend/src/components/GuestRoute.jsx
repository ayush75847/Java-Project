import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Wraps pages only for logged-OUT users (login, register, verify).
// Someone already logged in is sent to the home page instead.
export default function GuestRoute() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // still checking the saved token
  if (isLoggedIn) return <Navigate to="/" replace />;
  return <Outlet />;
}
