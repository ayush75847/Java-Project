import { Link } from "react-router";

const GITHUB_USER = "ayush75847";
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const GITHUB_REPO = `${GITHUB_PROFILE}/Java-Project`;

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/posts", label: "All posts" },
  { to: "/write", label: "Create post" },
];

// The bottom of every page: brand, links, and who built it
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-raised/40">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link to="/" className="text-lg font-extrabold tracking-tight">
              <span className="text-ink">Ink</span>
              <span className="text-brand-500">ly</span>
            </Link>
            <p className="mt-1 text-sm text-ink-subtle">Where ideas find their ink.</p>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="flex justify-center gap-6 text-sm">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-ink-muted transition hover:text-brand-400">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* GitHub */}
          <div className="flex justify-center">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Inkly source code on GitHub"
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-3 py-2 text-sm text-ink-muted transition hover:border-brand-500 hover:text-brand-400"
            >
              <GitHubIcon />
              Source code
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-line pt-5 text-xs text-ink-subtle sm:flex-row sm:justify-between">
          <p>© {year} Inkly. Built with Spring Boot, MongoDB and React.</p>
          <p>
            Made with <span className="text-brand-500" aria-label="love">♥</span> by{" "}
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink-muted transition hover:text-brand-400"
            >
              @{GITHUB_USER}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
