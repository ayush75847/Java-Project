import { useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const GITHUB_USER = "ayush75847";
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const GITHUB_REPO = `${GITHUB_PROFILE}/Java-Project`;

// /about: what Inkly is, what it offers, how it works and how it's built
export default function About() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    document.title = "About · Inkly";
    return () => {
      document.title = "Inkly";
    };
  }, []);

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
          <p className="fade-up text-sm font-semibold tracking-wide text-brand-400 uppercase">About Inkly</p>
          <h1 className="fade-up mt-3 text-4xl leading-tight font-black tracking-tight text-balance text-ink [animation-delay:80ms] sm:text-6xl">
            A calm place to write, <span className="text-brand-500">and to be read.</span>
          </h1>
          <p className="fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
            Inkly is a blogging platform for people who just want to write. No algorithms deciding who sees your
            work, no clutter, no distractions: a clean editor, your own profile, and a feed where every published
            story gets its place.
          </p>
        </div>
      </section>

      {/* ---------- What we believe (the feature list lives on /services) ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <SectionTitle eyebrow="What we believe" title="Words first. Everything else second." />
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-surface-raised p-6">
              <h3 className="text-lg font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{v.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/services" className="text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">
            See everything Inkly offers →
          </Link>
        </p>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="border-y border-line bg-surface-raised/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <SectionTitle eyebrow="How it works" title="From idea to published in minutes" />
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl border border-line bg-surface-raised p-6">
                <span className="text-5xl font-black text-brand-500/25">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Built with ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <SectionTitle eyebrow="Under the hood" title="How Inkly is built" />
        <div className="grid gap-5 md:grid-cols-3">
          {STACK.map((group) => (
            <div key={group.title} className="rounded-2xl border border-line bg-surface-raised p-6">
              <h3 className="text-sm font-semibold tracking-wide text-ink-subtle uppercase">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line-strong bg-surface-overlay px-3 py-1 text-sm text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{group.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-y border-line bg-surface-raised/40">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <SectionTitle eyebrow="FAQ" title="Questions people ask" />
          <div className="space-y-3">
            {FAQ.map((item) => (
              // <details> opens and closes on its own: no JavaScript needed
              <details
                key={item.q}
                className="group rounded-xl border border-line bg-surface-raised px-5 py-4 open:border-brand-500/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    className="text-xl leading-none text-brand-400 transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Creator + CTA ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface-raised p-8">
            <div>
              <p className="text-sm font-semibold tracking-wide text-brand-400 uppercase">The creator</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">Built by @{GITHUB_USER}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Inkly is a full-stack project: a Spring Boot REST API with MongoDB on the back end and a React app on
                the front end. The whole source code is open on GitHub.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
              >
                <GitHubIcon /> GitHub profile
              </a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
              >
                <GitHubIcon /> Source code
              </a>
            </div>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-500/30 bg-linear-to-br from-brand-500/20 via-surface-raised to-surface-raised p-8">
            <div
              className="absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-2xl font-extrabold text-ink">
                {isLoggedIn ? "Your next story is waiting." : "Ready to start writing?"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {isLoggedIn
                  ? "Open the editor, write freely, and publish whenever you're ready."
                  : "Create a free account with your email or Google and publish your first post today."}
              </p>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <Link
                to={isLoggedIn ? "/write" : "/register"}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-bold text-ink-inverse shadow-lg shadow-brand-500/25 transition hover:bg-brand-400"
              >
                {isLoggedIn ? "Write a post" : "Create free account"}
              </Link>
              <Link
                to="/posts"
                className="rounded-lg border border-line-strong bg-surface-raised/80 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400"
              >
                Read posts
              </Link>
            </div>
          </div>
        </div>
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

function GitHubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const STEPS = [
  {
    title: "Create your account",
    text: "Sign up with your email and confirm it with the code we send you, or use your Google account in one click.",
  },
  {
    title: "Write your story",
    text: "Open the editor, add a title and a cover image, and write. Keep it hidden until it feels right.",
  },
  {
    title: "Publish & share",
    text: "Publish with one click. Your story appears in the feed and on your profile, ready to be read.",
  },
];

const STACK = [
  {
    title: "Back end",
    items: ["Java 21", "Spring Boot", "Spring Security", "JWT", "MongoDB"],
    text: "A REST API that handles accounts, posts and permissions. Every rule is checked on the server.",
  },
  {
    title: "Front end",
    items: ["React", "React Router", "Tailwind CSS", "Vite", "TinyMCE"],
    text: "A fast single-page app with a dark, distraction-free design that works on phones and desktops.",
  },
  {
    title: "Services",
    items: ["Cloudinary", "Google OAuth", "Gmail SMTP"],
    text: "Image hosting and resizing, Google sign-in, and email delivery for verification codes.",
  },
];

const FAQ = [
  {
    q: "Is Inkly free?",
    a: "Yes. Creating an account, writing and publishing are completely free.",
  },
  {
    q: "Who can see my hidden posts?",
    a: "Only you and the site's admins. Hidden posts never appear in the feed, on your profile or in search.",
  },
  {
    q: "Can I sign in with Google?",
    a: "Yes. Choose \"Continue with Google\" on the login or sign-up page. If you already have an account with the same email, Google signs you into that account.",
  },
  {
    q: "What images can I upload?",
    a: "JPG, PNG, WEBP or GIF, up to 5 MB, as the cover image of a post.",
  },
  {
    q: "Can I edit or delete a post after publishing?",
    a: "Yes. Open the post or go to My posts to edit it, hide it, or delete it for good.",
  },
  {
    q: "What do admins do?",
    a: "Admins keep the community healthy: they can remove posts that break the rules and manage other users' roles.",
  },
];

const VALUES = [
  {
    title: "Writing comes first",
    text: "A quiet editor and a reading page built around the text. No ads, no pop-ups, nothing competing for attention.",
  },
  {
    title: "Your work, your rules",
    text: "Keep a draft hidden as long as you like, publish when it's ready, and edit or remove it whenever you want.",
  },
  {
    title: "Simple and fast",
    text: "Pages load quickly on any device, images are resized automatically, and everything works the way you'd expect.",
  },
];
