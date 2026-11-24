import { Link, useLocation } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Any URL that doesn't exist, e.g. /hello or a mistyped link
export default function NotFound() {
  const { pathname } = useLocation();
  useDocumentTitle("Page not found");

  return (
    <section className="relative overflow-hidden">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
        {/* A big "404" where the 0 is an ink drop, like the logo */}
        <p className="fade-up flex items-center text-8xl font-black tracking-tighter text-ink sm:text-9xl" aria-hidden="true">
          4
          <svg className="mx-1 h-[0.8em] w-[0.6em] text-brand-500" viewBox="0 0 30 40" fill="currentColor">
            <path d="M15 0S0 18 0 26a15 15 0 0 0 30 0C30 18 15 0 15 0Z" />
          </svg>
          4
        </p>

        <h1 className="fade-up mt-6 text-3xl font-extrabold tracking-tight text-ink [animation-delay:80ms] sm:text-4xl">
          This page ran out of ink.
        </h1>
        <p className="fade-up mt-4 text-ink-muted [animation-delay:160ms]">
          We couldn't find{" "}
          <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-sm break-all text-brand-300">{pathname}</code>.
          It may have been moved, deleted, or the link has a typo.
        </p>

        <div className="fade-up mt-10 flex w-full flex-col justify-center gap-3 [animation-delay:240ms] sm:w-auto sm:flex-row">
          <Link
            to="/"
            className="rounded-xl bg-brand-500 px-6 py-3 font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400"
          >
            Back to home
          </Link>
          <Link
            to="/posts"
            className="rounded-xl border border-line-strong bg-surface-raised/80 px-6 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-400"
          >
            Browse all posts
          </Link>
        </div>
      </div>
    </section>
  );
}
