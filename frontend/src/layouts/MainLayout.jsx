import { Link, Outlet } from "react-router";
import Navbar from "../components/Navbar";

// Shared frame for every page: navbar on top, the current page, a footer at the bottom
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-ink-subtle sm:flex-row">
          <p>
            <span className="font-bold text-ink">Ink</span>
            <span className="font-bold text-brand-500">ly</span> · Where ideas find their ink.
          </p>
          <nav aria-label="Footer" className="flex gap-5">
            <Link to="/" className="hover:text-brand-400">
              Home
            </Link>
            <Link to="/posts" className="hover:text-brand-400">
              All posts
            </Link>
            <Link to="/write" className="hover:text-brand-400">
              Create post
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
