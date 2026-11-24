import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Wraps pages only for logged-OUT users (login, register, verify).
// Someone already logged in is sent on: back to the page ProtectedRoute sent them
// from (state.from), or to the home page.
// This also runs the moment login succeeds, so it must use state.from too,
// otherwise it would win the race against Login's own navigate() and always go to "/".
export default function GuestRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // still checking the saved token
  if (isLoggedIn) return <Navigate to={location.state?.from || "/"} replace />;
  return <Outlet />;
}
