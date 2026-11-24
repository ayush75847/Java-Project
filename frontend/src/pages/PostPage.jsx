import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "../api/client";
import AuthorBox from "../components/AuthorBox";
import PostContent from "../components/PostContent";
import ReadingProgress from "../components/ReadingProgress";
import Alert from "../components/ui/Alert";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { postService } from "../services/postService";
import { formatDate, readingTime } from "../utils/format";
import { sizedImage } from "../utils/image";

// One full post: /posts/:id
export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load the post. Waits for the login check, so the owner can also see their hidden posts.
  useEffect(() => {
    if (authLoading) return;
    let ignore = false;

    postService
      .getPost(id)
      .then((data) => !ignore && setPost(data))
      .catch((err) => {
        if (ignore) return;
        if (getErrorStatus(err) === 404) setNotFound(true);
        else setError(getErrorMessage(err));
      });

    return () => {
      ignore = true;
    };
  }, [id, authLoading, reloadKey]);

  // Browser tab title: "Post title · Inkly"
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} · Inkly`;
    return () => {
      document.title = "Inkly";
    };
  }, [post]);

  function retry() {
    setError("");
    setReloadKey((k) => k + 1);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await postService.remove(post.id);
      toast.success("Post deleted", { description: post.title });
      navigate(isOwner ? "/my-posts" : "/posts", { replace: true });
    } catch (err) {
      toast.error("Couldn't delete the post", { description: getErrorMessage(err) });
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (notFound) return <PostNotFound />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <Alert type="error">{error}</Alert>
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!post) return <PostSkeleton />;

  // The rules are the same as the backend's: only the author edits, author or admin deletes
  const isOwner = user?.id === post.author.id;
  const canDelete = isOwner || isAdmin;
  const isHidden = post.status === "INACTIVE";
  // Saved again more than a minute after it was created
  const wasEdited =
    new Date(post.updatedAt) - new Date(post.createdAt) > 60 * 1000;

  return (
    <article className="px-4 pt-10 pb-20 sm:pt-14">
      <ReadingProgress />

      {/* Header: same width as the text below it */}
      <header className="mx-auto max-w-2xl">
        <Link
          to="/posts"
          className="mb-8 inline-flex items-center gap-1 text-sm text-ink-muted transition hover:text-brand-400"
        >
          <span aria-hidden="true">←</span> All posts
        </Link>

        {isHidden && (
          <div className="mb-6">
            <Alert type="info">
              This post is hidden. Only {isOwner ? "you" : "its author"} and admins can see it.
            </Alert>
          </div>
        )}

        <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-balance text-ink sm:text-5xl sm:leading-[1.1]">
          {post.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <Link
            to={`/users/${post.author.id}`}
            className="group flex items-center gap-3"
          >
            <Avatar user={post.author} />
            <div className="text-sm">
              <p className="font-semibold text-ink group-hover:text-brand-400">
                {post.author.username}
              </p>
              <p className="text-ink-subtle">
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
                {" · "}
                {readingTime(post.content)} min read
                {wasEdited && " · edited"}
              </p>
            </div>
          </Link>

          {(isOwner || canDelete) && (
            <div className="flex gap-2">
              {isOwner && (
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
                >
                  Edit
                </Link>
              )}
              {canDelete && (
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Cover image: wider than the text, always the same wide shape (2:1, 16:9 on phones),
          so every post looks consistent whatever size the uploaded photo was.
          srcSet lets the browser download the smallest version that is still sharp. */}
      {post.imageUrl && (
        <figure className="mx-auto mt-10 max-w-4xl">
          <img
            src={sizedImage(post.imageUrl, 1600)}
            srcSet={[800, 1200, 1600, 2000].map((w) => `${sizedImage(post.imageUrl, w)} ${w}w`).join(", ")}
            sizes="(min-width: 928px) 896px, calc(100vw - 2rem)"
            alt=""
            className="aspect-video w-full rounded-2xl border border-line bg-surface-overlay object-cover sm:aspect-[2/1]"
          />
        </figure>
      )}

      <div className="mt-12">
        <PostContent content={post.content} />
      </div>

      <footer className="mx-auto mt-16 max-w-2xl space-y-8">
        <div className="text-center text-ink-subtle" aria-hidden="true">
          • • •
        </div>
        <AuthorBox author={post.author} />
        <div className="text-center">
          <Link to="/posts" className="text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </footer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      >
        {isOwner
          ? "It will be gone for good, including its image. This can't be undone."
          : `You are deleting ${post.author.username}'s post as an admin. This can't be undone.`}
      </ConfirmDialog>
    </article>
  );
}

function PostNotFound() {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-ink">Post not found</h1>
      <p className="mt-2 text-ink-muted">
        It may have been deleted or hidden by its author.
      </p>
      <Link
        to="/posts"
        className="mt-4 inline-block text-brand-400 hover:text-brand-300 hover:underline"
      >
        Back to all posts
      </Link>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl animate-pulse space-y-6 px-4 py-10"
      aria-busy="true"
      aria-label="Loading post"
    >
      <div className="h-4 w-20 rounded bg-surface-overlay" />
      <div className="h-10 w-4/5 rounded bg-surface-overlay" />
      <div className="flex items-center gap-3 border-y border-line py-4">
        <div className="h-10 w-10 rounded-full bg-surface-overlay" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-surface-overlay" />
          <div className="h-3 w-40 rounded bg-surface-overlay" />
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full rounded bg-surface-overlay" />
        <div className="h-4 w-full rounded bg-surface-overlay" />
        <div className="h-4 w-2/3 rounded bg-surface-overlay" />
      </div>
    </div>
  );
}
