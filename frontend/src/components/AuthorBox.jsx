import { useEffect, useState } from "react";
import { Link } from "react-router";
import { userService } from "../services/userService";
import Avatar from "./ui/Avatar";

// "Written by ..." card at the end of a post, with the author's bio.
// A post only carries the author's id and name, so the bio is fetched here.
// If that request fails the card still shows, just without the bio.
export default function AuthorBox({ author }) {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    userService
      .getProfile(author.id)
      .then((profile) => !ignore && setBio(profile.bio))
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [author.id]);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-6 sm:flex-row sm:items-center">
      <Avatar user={author} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">Written by</p>
        <p className="mt-0.5 text-lg font-bold text-ink">{author.username}</p>
        {bio && <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-muted">{bio}</p>}
      </div>
      <Link
        to={`/users/${author.id}`}
        className="shrink-0 self-start rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400 sm:self-center"
      >
        More from {author.username}
      </Link>
    </aside>
  );
}
