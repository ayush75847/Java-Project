import { useEffect, useState } from "react";
import { Link } from "react-router";
import { userService } from "../services/userService";
import PostTile from "./PostTile";

const HOW_MANY = 3;

// "More from maya": up to 3 of the author's other published posts, under a post.
// Keeps readers on the site instead of leaving after one story.
// Shows nothing if the author has no other posts (or the request fails).
export default function MoreFromAuthor({ author, currentPostId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let ignore = false;
    userService
      .getUserPosts(author.id) // only PUBLISHED posts, newest first
      .then((all) => {
        if (ignore) return;
        setPosts(all.filter((p) => p.id !== currentPostId).slice(0, HOW_MANY));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [author.id, currentPostId]);

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-5xl border-t border-line pt-12" aria-labelledby="more-from-author">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id="more-from-author" className="text-2xl font-extrabold tracking-tight text-ink">
          More from <span className="text-brand-500">{author.username}</span>
        </h2>
        <Link
          to={`/users/${author.id}`}
          className="shrink-0 text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline"
        >
          View profile →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostTile key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
