import { Link, Outlet, useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

// Shared frame for every page: a simple top bar + the current page below it.
// (The full Navbar with avatar and menu comes in step 9.4.)
export default function MainLayout() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 h-16 border-b border-line bg-surface-raised/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-ink">Ink</span>
            <span className="text-brand-500">ly</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {isLoggedIn ? (
              <>
                <span className="text-ink-muted">Hi, {user.username}</span>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium text-ink-muted hover:text-brand-400"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-ink-inverse hover:bg-brand-400"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
