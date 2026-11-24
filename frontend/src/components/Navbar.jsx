import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";

// The bar at the top of every page
export default function Navbar() {
  const { isLoggedIn, loading, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-line bg-surface-raised/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="rounded text-xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
        >
          <span className="text-ink">Ink</span>
          <span className="text-brand-500">ly</span>
        </Link>

        {/* While the saved token is being checked, show nothing (avoids a "Log in" flash) */}
        {!loading && (
          <nav className="flex items-center gap-3 text-sm">
            {isLoggedIn ? (
              <>
                <Link
                  to="/write"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 font-semibold text-ink-inverse transition hover:bg-brand-400 sm:px-4"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.6 2.6a2 2 0 0 1 2.8 0l1 1a2 2 0 0 1 0 2.8l-9 9a2 2 0 0 1-.9.5l-3.6 1a.75.75 0 0 1-.9-.9l1-3.6a2 2 0 0 1 .5-.9l9-9Z" />
                  </svg>
                  <span>Write</span>
                </Link>
                <UserMenu onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium text-ink-muted transition hover:text-brand-400"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-ink-inverse transition hover:bg-brand-400"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
