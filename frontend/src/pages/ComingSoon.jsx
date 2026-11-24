import { Link } from "react-router";

// TEMPORARY: holds the place of pages we build in the next steps,
// so the navbar links and protected routes can already be tried out.
export default function ComingSoon({ title }) {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-ink-muted">This page is coming in the next step.</p>
      <Link
        to="/"
        className="mt-4 inline-block text-brand-400 hover:text-brand-300 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
