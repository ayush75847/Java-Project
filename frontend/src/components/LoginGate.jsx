import { Link, useLocation } from "react-router";
import GoogleButton from "./GoogleButton";
import Divider from "./ui/Divider";

// Shown under the preview of a post for visitors who are not logged in.
// The backend only sent the first part of the post, so there is nothing to "unhide" here:
// logging in is the only way to get the rest. Every button brings the reader back to this post.
export default function LoginGate({ author, readingMinutes }) {
  const { pathname } = useLocation();
  const backHere = { from: pathname }; // Login, Register and Verify all read state.from

  return (
    <aside className="relative mx-auto mt-2 max-w-2xl overflow-hidden rounded-2xl border border-brand-500/30 bg-linear-to-b from-brand-500/10 to-surface-raised p-8 text-center shadow-2xl shadow-black/40 sm:p-10">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-ink">Log in to view the full blog</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        You&apos;ve reached the end of the preview. This is a {readingMinutes} min read by{" "}
        <span className="font-semibold text-ink">{author.username}</span>. Log in, or create a free account in
        seconds, to read the whole story and every other story on Inkly.
      </p>

      <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3">
        <Link
          to="/register"
          state={backHere}
          className="rounded-xl bg-brand-500 px-6 py-3 font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400"
        >
          Create a free account
        </Link>
        <GoogleButton redirectTo={pathname} />
        <Divider>already a member?</Divider>
        <Link
          to="/login"
          state={backHere}
          className="rounded-xl border border-line-strong bg-surface-overlay px-6 py-3 font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
        >
          Log in
        </Link>
      </div>
    </aside>
  );
}
