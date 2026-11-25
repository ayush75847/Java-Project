import { Link } from "react-router";
import { readingTime, timeAgo, toPlainText } from "../utils/format";
import { sizedImage } from "../utils/image";
import Avatar from "./ui/Avatar";

// A tall card with the picture on top, for grids (the home page "Latest stories").
// PostCard is the wide one used in lists.
export default function PostTile({ post }) {
  const preview = toPlainText(post.content);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised transition duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10">
      <div className="aspect-[16/9] overflow-hidden bg-surface-overlay">
        {post.imageUrl ? (
          <img
            src={sizedImage(post.imageUrl, 800)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          // No picture: a branded placeholder with the title's first letter
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-500/25 via-surface-overlay to-surface-raised">
            <span className="text-6xl font-black text-brand-500/40 uppercase">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-ink transition group-hover:text-brand-400">
          {/* ::after makes the whole card clickable */}
          <Link
            to={`/posts/${post.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-brand-500"
          >
            {post.title}
          </Link>
        </h3>
        {preview && <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{preview}</p>}

        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-ink-subtle">
          <Avatar user={post.author} size="sm" />
          <span className="font-medium text-ink-muted">{post.author.username}</span>
          <span aria-hidden="true">·</span>
          <span>{timeAgo(post.createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes ?? readingTime(post.content)} min</span>
        </div>
      </div>
    </article>
  );
}

export function PostTileSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface-raised" aria-hidden="true">
      <div className="aspect-[16/9] bg-surface-overlay" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-4/5 rounded bg-surface-overlay" />
        <div className="h-3 w-full rounded bg-surface-overlay" />
        <div className="h-3 w-1/2 rounded bg-surface-overlay" />
      </div>
    </div>
  );
}
