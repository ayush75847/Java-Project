import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";

// The main links. "Create post" is shown to everyone: a logged-out visitor
// is sent to log in first and then lands on the editor (ProtectedRoute does that).
const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/posts", label: "All posts", end: true },
  { to: "/write", label: "Create post" },
];

// Desktop link: orange when it's the current page
function desktopLinkClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-brand-500/10 text-brand-400" : "text-ink-muted hover:bg-surface-overlay hover:text-ink"
  }`;
}

function mobileLinkClass({ isActive }) {
  return `block rounded-lg px-3 py-2.5 text-base font-medium transition ${
    isActive ? "bg-brand-500/10 text-brand-400" : "text-ink-muted hover:bg-surface-overlay hover:text-ink"
  }`;
}

// The bar at the top of every page
export default function Navbar() {
  const { isLoggedIn, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // the phone menu

  // Close the phone menu when the page changes
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  // ...and on the Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Log out = go home FIRST, then forget the user.
  // The other way round, on a page like /settings, ProtectedRoute would notice
  // "logged out" before the move home and send you to /login instead.
  const logoutPending = useRef(false);

  function finishLogout() {
    logoutPending.current = false;
    logout();
    toast.success("You've been logged out");
  }

  function handleLogout() {
    if (location.pathname === "/") return finishLogout(); // already home
    logoutPending.current = true;
    navigate("/", { replace: true });
  }

  // Runs after every page change: once we've arrived home, finish the logout
  useEffect(() => {
    if (logoutPending.current && location.pathname === "/") finishLogout();
  });

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface-raised/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="rounded text-xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            <span className="text-ink">Ink</span>
            <span className="text-brand-500">ly</span>
          </Link>

          {/* Desktop links (hidden on phones, they're in the menu there) */}
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={desktopLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* While the saved token is being checked, show nothing (avoids a "Log in" flash) */}
          {!loading &&
            (isLoggedIn ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-ink-muted transition hover:text-brand-400 sm:block"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
                >
                  Sign up
                </Link>
              </>
            ))}

          {/* Phone menu button (☰ / ✕) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-surface-overlay hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-500 md:hidden"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Phone menu: drops down under the bar */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="space-y-1 border-t border-line bg-surface-raised px-4 py-3 md:hidden"
        >
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={mobileLinkClass}>
              {l.label}
            </NavLink>
          ))}
          {!loading && !isLoggedIn && (
            <NavLink to="/login" className={mobileLinkClass}>
              Log in
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
