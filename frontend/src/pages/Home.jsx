import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../api/client";
import PostCard, { PostCardSkeleton } from "../components/PostCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { postService } from "../services/postService";

// The public feed: every ACTIVE post, newest first
export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0); // bump it to fetch again ("Try again")

  useEffect(() => {
    let ignore = false; // the page was left before the answer came back: don't update it

    postService
      .getFeed()
      .then((data) => !ignore && setPosts(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function retry() {
    setError("");
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {isLoggedIn ? (
            <>
              Welcome back,{" "}
              <span className="text-brand-500">{user.username}</span>
            </>
          ) : (
            <>
              Stories worth <span className="text-brand-500">reading</span>
            </>
          )}
        </h1>
        <p className="text-ink-muted">
          The latest posts from the Inkly community.
        </p>
      </section>

      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading posts">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : error ? (
        <div className="space-y-4">
          <Alert type="error">{error}</Alert>
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <EmptyFeed isLoggedIn={isLoggedIn} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyFeed({ isLoggedIn }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">No posts yet</p>
      <p className="mt-1 text-sm text-ink-muted">
        Be the first one to write something.
      </p>
      <Link
        to={isLoggedIn ? "/write" : "/register"}
        className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
      >
        {isLoggedIn ? "Write a post" : "Sign up to write"}
      </Link>
    </div>
  );
}
