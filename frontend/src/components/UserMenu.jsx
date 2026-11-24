import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./ui/Avatar";

const ITEM =
  "block w-full px-4 py-2 text-left text-sm text-ink-muted transition hover:bg-surface-overlay hover:text-ink focus-visible:bg-surface-overlay focus-visible:text-ink focus-visible:outline-none";

// The avatar in the top right. Click it to open a small menu.
export default function UserMenu({ onLogout }) {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close the menu whenever the page changes (e.g. after clicking a link in it)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setOpen(false);
  }

  // Close on a click outside the menu, or on the Escape key
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex rounded-full transition hover:ring-2 hover:ring-brand-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Avatar user={user} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface-raised py-1 shadow-2xl shadow-black/60"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">
              {user.username}
            </p>
            <p className="truncate text-xs text-ink-subtle">{user.email}</p>
          </div>

          <Link role="menuitem" to={`/users/${user.id}`} className={ITEM}>
            My profile
          </Link>
          <Link role="menuitem" to="/my-posts" className={ITEM}>
            My posts
          </Link>
          <Link role="menuitem" to="/settings" className={ITEM}>
            Settings
          </Link>
          {isAdmin && (
            <Link role="menuitem" to="/admin" className={ITEM}>
              Admin dashboard
            </Link>
          )}

          <div className="my-1 border-t border-line" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className={`${ITEM} hover:text-danger`}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
