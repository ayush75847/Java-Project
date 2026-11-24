import { useEffect, useState } from "react";
import { Link } from "react-router";
import PostTile, { PostTileSkeleton } from "../components/PostTile";
import { useAuth } from "../hooks/useAuth";
import { postService } from "../services/postService";

// The landing page: tells visitors what Inkly is and pulls them in.
// The full list of posts lives on /posts (AllPosts.jsx).
export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState(null); // null = loading; [] also when the backend is down

  useEffect(() => {
    let ignore = false;
    postService
      .getFeed()
      .then((data) => !ignore && setPosts(data))
      .catch(() => !ignore && setPosts([])); // the landing page still works without data
    return () => {
      ignore = true;
    };
  }, []);

  const latest = posts?.slice(0, 3);
  const writerCount = posts ? new Set(posts.map((p) => p.author.id)).size : 0;

  // Logged in: go write. Visitor: create an account.
  const primaryCta = isLoggedIn
    ? { to: "/write", label: "Write a story" }
    : { to: "/register", label: "Start writing, it's free" };

  return (
    <div className="overflow-hidden">
      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          <p className="fade-up inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
            {isLoggedIn ? `Welcome back, ${user.username}` : "A home for writers and readers"}
          </p>

          <h1 className="fade-up mx-auto mt-6 max-w-3xl text-5xl leading-[1.05] font-black tracking-tight text-ink [animation-delay:80ms] sm:text-7xl">
            Where ideas find their{" "}
            <span className="bg-linear-to-r from-brand-300 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              ink
            </span>
            .
          </h1>

          <p className="fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
            Write stories, share what you know and read what others are thinking. A clean, distraction-free
            place built for words.
          </p>

          <div className="fade-up mt-10 flex flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Link
              to={primaryCta.to}
              className="w-full rounded-xl bg-brand-500 px-7 py-3.5 text-base font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400 sm:w-auto"
            >
              {primaryCta.label}
            </Link>
            <Link
              to="/posts"
              className="w-full rounded-xl border border-line-strong bg-surface-raised/80 px-7 py-3.5 text-base font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-400 sm:w-auto"
            >
              Explore posts →
            </Link>
          </div>

          {/* Real numbers from the feed (only once there is something to show) */}
          {posts?.length > 0 && (
            <dl className="fade-up mx-auto mt-14 flex max-w-md justify-center divide-x divide-line rounded-2xl border border-line bg-surface-raised/70 py-4 backdrop-blur [animation-delay:320ms]">
              <Stat value={posts.length} label={posts.length === 1 ? "story" : "stories"} />
              <Stat value={writerCount} label={writerCount === 1 ? "writer" : "writers"} />
              <Stat value="Free" label="forever" />
            </dl>
          )}
        </div>
      </section>

      {/* ---------- Latest stories ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand-400 uppercase">Fresh from the community</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Latest stories</h2>
          </div>
          <Link to="/posts" className="shrink-0 text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">
            See all →
          </Link>
        </div>

        {posts === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PostTileSkeleton />
            <PostTileSkeleton />
            <PostTileSkeleton />
          </div>
        ) : latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
            <p className="text-lg font-semibold text-ink">The first story is still unwritten</p>
            <p className="mt-1 text-sm text-ink-muted">It could be yours.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <PostTile key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Why Inkly ---------- */}
      <section className="border-y border-line bg-surface-raised/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-semibold tracking-wide text-brand-400 uppercase">Why Inkly</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Everything you need to write. Nothing you don't.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-surface-raised p-6 transition hover:border-brand-500/40"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-linear-to-br from-brand-500/20 via-surface-raised to-surface-raised px-6 py-14 text-center sm:px-12">
          <div className="absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {isLoggedIn ? "Got an idea? Write it down." : "Your story deserves to be read."}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-ink-muted">
            {isLoggedIn
              ? "Open the editor and start typing. Keep it hidden until it's ready, publish when you are."
              : "Join in seconds with your email or Google, and publish your first post today."}
          </p>
          <Link
            to={primaryCta.to}
            className="relative mt-8 inline-block rounded-xl bg-brand-500 px-7 py-3.5 font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400"
          >
            {isLoggedIn ? "Open the editor" : "Create your free account"}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex-1 px-4">
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-extrabold text-ink">{value}</dd>
      <dd className="text-xs text-ink-subtle">{label}</dd>
    </div>
  );
}

const ICON = "h-5 w-5";
const FEATURES = [
  {
    title: "A beautiful editor",
    text: "Headings, lists, quotes, code blocks and links, plus a cover image for every story. What you see is what readers get.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    title: "Publish on your terms",
    text: "Keep drafts hidden while you work on them. Publish with one click when they're ready, and hide them again anytime.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Your own profile",
    text: "A personal page with your bio and all your stories, so readers can find everything you've written.",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];
