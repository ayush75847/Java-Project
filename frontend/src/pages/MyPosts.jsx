import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../api/client";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { postService } from "../services/postService";
import { formatDate, toPlainText } from "../utils/format";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Published" },
  { value: "INACTIVE", label: "Hidden" },
];

// /my-posts: every post you wrote, published AND hidden, with quick actions
export default function MyPosts() {
  const [posts, setPosts] = useState(null); // null = still loading
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState("ALL");

  const [busyId, setBusyId] = useState(null); // the post whose hide/publish is running
  const [actionError, setActionError] = useState("");
  const [toDelete, setToDelete] = useState(null); // the post in the "Delete?" popup
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    postService
      .getMyPosts()
      .then((data) => !ignore && setPosts(data))
      .catch((err) => !ignore && setLoadError(getErrorMessage(err)));
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function retry() {
    setLoadError("");
    setReloadKey((k) => k + 1);
  }

  // Swap one post in the list for its new version from the backend
  function replacePost(updated) {
    setPosts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function toggleStatus(post) {
    setBusyId(post.id);
    setActionError("");
    try {
      // PUT needs the whole post (title + content), not only the status
      const updated = await postService.update(post.id, {
        title: post.title,
        content: post.content,
        status: post.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
      replacePost(updated);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    setActionError("");
    try {
      await postService.remove(toDelete.id);
      setPosts((list) => list.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  const counts = {
    ALL: posts?.length ?? 0,
    ACTIVE: posts?.filter((p) => p.status === "ACTIVE").length ?? 0,
    INACTIVE: posts?.filter((p) => p.status === "INACTIVE").length ?? 0,
  };
  const shown =
    filter === "ALL" ? posts : posts?.filter((p) => p.status === filter);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            My posts
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Everything you've written. Hidden posts are only visible to you and
            admins.
          </p>
        </div>
        <Link
          to="/write"
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
        >
          New post
        </Link>
      </div>

      {loadError ? (
        <div className="space-y-4">
          <Alert type="error">{loadError}</Alert>
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : posts === null ? (
        <ListSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Filter tabs: All / Published / Hidden, each with a count */}
          <div
            role="tablist"
            aria-label="Filter posts"
            className="mb-4 flex gap-1 border-b border-line"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-500 ${
                  filter === f.value
                    ? "border-brand-500 text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {f.label}
                <span className="ml-1.5 rounded-full bg-surface-overlay px-2 py-0.5 text-xs text-ink-muted">
                  {counts[f.value]}
                </span>
              </button>
            ))}
          </div>

          {actionError && (
            <div className="mb-4">
              <Alert type="error">{actionError}</Alert>
            </div>
          )}

          {shown.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-muted">
              {filter === "ACTIVE"
                ? "None of your posts are published right now."
                : "You have no hidden posts."}
            </p>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-raised">
              {shown.map((post) => (
                <MyPostRow
                  key={post.id}
                  post={post}
                  busy={busyId === post.id}
                  onToggle={() => toggleStatus(post)}
                  onDelete={() => setToDelete(post)}
                />
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this post?"
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <strong className="text-ink">{toDelete?.title}</strong> will be gone
        for good, including its image. This can't be undone.
      </ConfirmDialog>
    </div>
  );
}

function MyPostRow({ post, busy, onToggle, onDelete }) {
  const isHidden = post.status === "INACTIVE";
  const preview = toPlainText(post.content);

  return (
    <li className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block"
        />
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <StatusBadge hidden={isHidden} />
          <span className="text-xs text-ink-subtle">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <Link
          to={`/posts/${post.id}`}
          className="block truncate font-semibold text-ink transition hover:text-brand-400"
        >
          {post.title}
        </Link>
        {preview && (
          <p className="truncate text-sm text-ink-muted">{preview}</p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Link
          to={`/posts/${post.id}/edit`}
          className="rounded-lg border border-line-strong bg-surface-overlay px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
        >
          Edit
        </Link>
        <Button
          variant="secondary"
          // same width for "Hide" and "Publish", so the buttons line up row to row
          className="min-w-21 px-3! py-2!"
          onClick={onToggle}
          loading={busy}
          aria-label={isHidden ? `Publish "${post.title}"` : `Hide "${post.title}"`}
        >
          {isHidden ? "Publish" : "Hide"}
        </Button>
        <Button
          variant="danger"
          className="px-3! py-2!"
          onClick={onDelete}
          aria-label={`Delete "${post.title}"`}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}

function StatusBadge({ hidden }) {
  return hidden ? (
    <span className="rounded-full border border-line-strong px-2 py-0.5 text-xs font-medium text-ink-muted">
      Hidden
    </span>
  ) : (
    <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
      Published
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">You haven't written anything yet</p>
      <p className="mt-1 text-sm text-ink-muted">
        Your posts will show up here, published and hidden ones.
      </p>
      <Link
        to="/write"
        className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-inverse transition hover:bg-brand-400"
      >
        Write your first post
      </Link>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div
      className="animate-pulse divide-y divide-line rounded-2xl border border-line bg-surface-raised"
      aria-busy="true"
      aria-label="Loading your posts"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 p-5">
          <div className="h-3 w-24 rounded bg-surface-overlay" />
          <div className="h-4 w-2/3 rounded bg-surface-overlay" />
          <div className="h-3 w-1/2 rounded bg-surface-overlay" />
        </div>
      ))}
    </div>
  );
}
