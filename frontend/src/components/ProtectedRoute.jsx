import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./ui/Spinner";

// Wraps pages only for logged-IN users (write, my posts, settings...).
// <ProtectedRoute adminOnly /> also requires the ADMIN role.
// The backend checks all of this again: this only gives a nicer experience.
export default function ProtectedRoute({ adminOnly = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Still checking the saved token: don't redirect yet, or a refresh would log you out
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-brand-500">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Not logged in: go to login, and come back here afterwards (Login reads state.from)
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
