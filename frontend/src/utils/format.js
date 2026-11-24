// Small helpers for showing data nicely. No React in here.

export function timeAgo(isoDate) {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(isoDate);
}

// "12 Mar 2026"
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Post content can contain HTML. For previews we only want the plain text.
// DOMParser builds the HTML without running scripts or loading images, so this is safe.
export function toPlainText(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");
  // Put a space after every block (paragraph, heading, list item...) so
  // "<p>One.</p><p>Two</p>" becomes "One. Two", not "One.Two"
  doc.body
    .querySelectorAll("p, div, li, br, h1, h2, h3, h4, h5, h6, blockquote, pre")
    .forEach((el) => el.after(" "));
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

// About 200 words per minute, never less than 1 minute
export function readingTime(html) {
  const words = toPlainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
