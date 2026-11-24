import { Link } from "react-router";
import { readingTime, timeAgo, toPlainText } from "../utils/format";
import Avatar from "./ui/Avatar";

// One post in a list: author, title, a short preview and the image (if any).
// The whole card opens the post; the author's name opens their profile.
export default function PostCard({ post }) {
  const preview = toPlainText(post.content);

  return (
    <article className="group relative flex gap-5 rounded-2xl border border-line bg-surface-raised p-5 transition hover:border-line-strong sm:p-6">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="relative z-10 flex items-center gap-2 text-sm">
          <Link
            to={`/users/${post.author.id}`}
            className="flex items-center gap-2 rounded font-medium text-ink hover:text-brand-400"
          >
            <Avatar user={post.author} size="sm" />
            {post.author.username}
          </Link>
          <span className="text-ink-subtle" aria-hidden="true">
            ·
          </span>
          <time dateTime={post.createdAt} className="text-ink-subtle">
            {timeAgo(post.createdAt)}
          </time>
        </div>

        <h2 className="text-lg font-bold leading-snug text-ink transition group-hover:text-brand-400 sm:text-xl">
          {/* The ::after makes the whole card clickable without nesting links */}
          <Link
            to={`/posts/${post.id}`}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand-500"
          >
            {post.title}
          </Link>
        </h2>

        {preview && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted sm:line-clamp-3">
            {preview}
          </p>
        )}

        <p className="text-xs text-ink-subtle">
          {readingTime(post.content)} min read
        </p>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          className="h-20 w-20 shrink-0 self-center rounded-xl object-cover sm:h-28 sm:w-36"
        />
      )}
    </article>
  );
}

// Grey placeholder shown while the posts are loading
export function PostCardSkeleton() {
  return (
    <div
      className="animate-pulse space-y-3 rounded-2xl border border-line bg-surface-raised p-6"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-surface-overlay" />
        <div className="h-3 w-28 rounded bg-surface-overlay" />
      </div>
      <div className="h-5 w-3/4 rounded bg-surface-overlay" />
      <div className="h-3 w-full rounded bg-surface-overlay" />
      <div className="h-3 w-2/3 rounded bg-surface-overlay" />
    </div>
  );
}
