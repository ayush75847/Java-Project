import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../api/client";
import PostCard, { PostCardSkeleton } from "../components/PostCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { postService } from "../services/postService";
import { toPlainText } from "../utils/format";

// /posts: the full public feed (every PUBLISHED post, newest first) with a search box
export default function AllPosts() {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState(null); // null = still loading
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;
    postService
      .getFeed()
      .then((data) => !ignore && setPosts(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)));
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function retry() {
    setError("");
    setReloadKey((k) => k + 1);
  }

  // Search in the title, the author's name and the text of the post
  const query = search.trim().toLowerCase();
  const shown = posts?.filter(
    (p) =>
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.author.username.toLowerCase().includes(query) ||
      toPlainText(p.content).toLowerCase().includes(query),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          All <span className="text-brand-500">posts</span>
        </h1>
        <p className="text-ink-muted">Every story published on Inkly, newest first.</p>
      </section>

      {posts?.length > 0 && (
        <div className="relative mb-6">
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 3.47 9.77l3.13 3.13a.75.75 0 1 0 1.06-1.06l-3.13-3.13A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or words in the post"
            aria-label="Search posts"
            className="w-full rounded-xl border border-line-strong bg-surface-raised py-3 pr-3 pl-10 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      )}

      {error ? (
        <div className="space-y-4">
          <Alert type="error">{error}</Alert>
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : posts === null ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading posts">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">No posts yet</p>
          <p className="mt-1 text-sm text-ink-muted">Be the first one to write something.</p>
          <Link
            to={isLoggedIn ? "/write" : "/register"}
            className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
          >
            {isLoggedIn ? "Write a post" : "Sign up to write"}
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-muted">
          No posts match "{search.trim()}".
        </p>
      ) : (
        <>
          {query && (
            <p className="mb-4 text-sm text-ink-subtle">
              {shown.length} {shown.length === 1 ? "result" : "results"}
            </p>
          )}
          <div className="space-y-4">
            {shown.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
