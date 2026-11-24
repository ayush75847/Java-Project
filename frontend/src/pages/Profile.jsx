import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getErrorMessage, getErrorStatus } from "../api/client";
import PostCard, { PostCardSkeleton } from "../components/PostCard";
import Alert from "../components/ui/Alert";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { userService } from "../services/userService";
import { formatDate } from "../utils/format";

// /users/:id: anyone's public profile and their published posts
export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const isMe = user?.id === id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Both requests at the same time, the page shows when both are back
  useEffect(() => {
    let ignore = false;
    Promise.all([userService.getProfile(id), userService.getUserPosts(id)])
      .then(([profileData, postsData]) => {
        if (ignore) return;
        setProfile(profileData);
        setPosts(postsData);
      })
      .catch((err) => {
        if (ignore) return;
        if (getErrorStatus(err) === 404) setNotFound(true);
        else setError(getErrorMessage(err));
      });
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  // Browser tab title: "maya · Inkly"
  useDocumentTitle(profile?.username);

  if (notFound) {
    return (
      <div className="px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">User not found</h1>
        <p className="mt-2 text-ink-muted">This account doesn't exist.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-brand-400 hover:text-brand-300 hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <Alert type="error">{error}</Alert>
        <Button
          variant="secondary"
          onClick={() => {
            setError("");
            setReloadKey((k) => k + 1);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-center">
        <Avatar user={profile} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="truncate text-3xl font-extrabold tracking-tight text-ink">
            {profile.username}
          </h1>
          {profile.bio ? (
            <p className="whitespace-pre-line text-ink-muted">{profile.bio}</p>
          ) : (
            isMe && (
              <p className="text-sm italic text-ink-subtle">
                You haven't written a bio yet.
              </p>
            )
          )}
          <p className="text-sm text-ink-subtle">
            Joined {formatDate(profile.joinedAt)} · {posts.length}{" "}
            {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
        {isMe && (
          <Link
            to="/settings"
            className="self-start rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400 sm:self-center"
          >
            Edit profile
          </Link>
        )}
      </section>

      <section className="pt-8">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">
            {isMe ? "Your published posts" : "Posts"}
          </h2>
          {isMe && (
            <Link
              to="/my-posts"
              className="text-sm text-brand-400 hover:text-brand-300 hover:underline"
            >
              Manage all, including hidden
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="text-ink-muted">
              {isMe
                ? "You haven't published anything yet."
                : `${profile.username} hasn't published anything yet.`}
            </p>
            {isMe && (
              <Link
                to="/write"
                className="mt-4 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
              >
                Write a post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10"
      aria-busy="true"
      aria-label="Loading profile"
    >
      <div className="flex animate-pulse items-center gap-5 border-b border-line pb-8">
        <div className="h-20 w-20 rounded-full bg-surface-overlay" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-40 rounded bg-surface-overlay" />
          <div className="h-3 w-2/3 rounded bg-surface-overlay" />
          <div className="h-3 w-32 rounded bg-surface-overlay" />
        </div>
      </div>
      <div className="space-y-4 pt-8">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </div>
  );
}
