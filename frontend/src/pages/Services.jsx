import { Link } from "react-router";
import LineIcon from "../components/ui/LineIcon";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// /services: everything Inkly does, grouped by who it's for
export default function Services() {
  const { isLoggedIn } = useAuth();

  useDocumentTitle("Services");

  return (
    <div className="overflow-hidden">
      {/* ---------- Intro ---------- */}
      <section className="relative">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-14 text-center sm:pt-24">
          <p className="fade-up text-sm font-semibold tracking-wide text-brand-400 uppercase">Services</p>
          <h1 className="fade-up mt-3 text-4xl leading-tight font-black tracking-tight text-balance text-ink [animation-delay:80ms] sm:text-6xl">
            Everything Inkly <span className="text-brand-500">does for you.</span>
          </h1>
          <p className="fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
            Tools for writers to create and publish, a clean experience for readers, and moderation that keeps the
            community healthy. All of it free.
          </p>
        </div>
      </section>

      {/* ---------- Who it's for ---------- */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div
              key={a.title}
              className={`flex flex-col rounded-2xl border p-7 ${
                a.highlight
                  ? "border-brand-500/40 bg-linear-to-b from-brand-500/10 to-surface-raised"
                  : "border-line bg-surface-raised"
              }`}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30">
                <LineIcon className="h-6 w-6">{a.icon}</LineIcon>
              </div>
              <h2 className="text-xl font-extrabold text-ink">{a.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.text}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-ink">
                    <Check />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- All features ---------- */}
      <section className="border-y border-line bg-surface-raised/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <SectionTitle eyebrow="In detail" title="The features behind it" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-surface-raised p-6 transition hover:-translate-y-0.5 hover:border-brand-500/40"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/30">
                  <LineIcon>{f.icon}</LineIcon>
                </div>
                <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Plan ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <SectionTitle eyebrow="Pricing" title="One plan. Everything included." />
        <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-brand-500/40 bg-linear-to-br from-brand-500/15 via-surface-raised to-surface-raised p-8 sm:p-10">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-sm font-semibold tracking-wide text-brand-300 uppercase">Inkly Free</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-black text-ink">₹0</span>
              <span className="text-ink-muted">forever</span>
            </p>
            <p className="mt-3 text-sm text-ink-muted">No trial, no credit card, no hidden limits.</p>
            <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
              {PLAN.map((p) => (
                <li key={p} className="flex gap-2.5 text-ink">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              to={isLoggedIn ? "/write" : "/register"}
              className="mt-8 block rounded-xl bg-brand-500 px-6 py-3.5 text-center font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-400"
            >
              {isLoggedIn ? "Write a post" : "Get started free"}
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ink-subtle">
          Questions?{" "}
          <Link to="/about" className="text-brand-400 hover:text-brand-300 hover:underline">
            Read the FAQ on the About page
          </Link>
        </p>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center">
      <p className="text-sm font-semibold tracking-wide text-brand-400 uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{title}</h2>
    </div>
  );
}

function Check() {
  return (
    <LineIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400">
      <path d="M20 6 9 17l-5-5" />
    </LineIcon>
  );
}

const AUDIENCES = [
  {
    title: "For writers",
    highlight: true,
    text: "Write, polish and publish your stories in a focused editor, on your own schedule.",
    points: [
      "Rich text editor",
      "Cover image for every post",
      "Hidden drafts, publish anytime",
      "Edit or delete whenever you want",
      "A public profile with your bio",
    ],
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  },
  {
    title: "For readers",
    text: "A clean, fast place to discover stories, with nothing between you and the words.",
    points: [
      "Every published story in one feed",
      "Search by title, author or text",
      "Comfortable, book-like reading",
      "Author pages with all their posts",
      "Fast on phones and desktops",
    ],
    icon: (
      <>
        <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" />
        <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" />
      </>
    ),
  },
  {
    title: "For the community",
    text: "Verified accounts and active moderation keep Inkly a good place to be.",
    points: [
      "Email-verified accounts",
      "Google sign-in",
      "Admins can remove harmful posts",
      "Role management for admins",
      "Secure, hashed passwords",
    ],
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
];

const FEATURES = [
  {
    title: "Rich text editor",
    text: "Headings, lists, quotes, code blocks and links. What you see while writing is what readers get.",
    icon: (
      <>
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </>
    ),
  },
  {
    title: "Cloud image hosting",
    text: "Cover images are stored in the cloud and resized for each device, so pages load fast even on slow networks.",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
  },
  {
    title: "Drafts & visibility",
    text: "Keep posts hidden while you work on them. Publish with one click, hide again whenever you like.",
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Search",
    text: "Find any published story instantly by its title, its author, or any word inside it.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    title: "Instant notifications",
    text: "Every action gets clear feedback: published, saved, deleted, or exactly what went wrong.",
    icon: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  {
    title: "Secure accounts",
    text: "Email verification with a 6-digit code, Google sign-in, hashed passwords and token-based sessions.",
    icon: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
  },
];

const PLAN = [
  "Unlimited posts",
  "Rich text editor",
  "Cover images",
  "Hidden drafts",
  "Public profile",
  "Google sign-in",
];
