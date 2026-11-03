import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-ink">Page not found</h1>
      <Link
        to="/"
        className="mt-2 inline-block text-brand-400 hover:text-brand-300 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
