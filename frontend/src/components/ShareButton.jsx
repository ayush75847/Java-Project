import { toast } from "sonner";

// Copies text to the clipboard. Returns true if it worked.
// The modern Clipboard API is blocked in some browsers and in-app browsers,
// so the older "select a hidden textarea and copy" trick is the backup.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
    }
  }
}

// "Share" for a post.
//  - Phones (and some desktop browsers): opens the device's own share menu (WhatsApp, Telegram, Mail...)
//  - Everywhere else: copies the link and says so with a toast
export default function ShareButton({ title, url = window.location.href }) {
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} · on Inkly`, url });
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // the user closed the share menu: nothing to do
        // any other problem: fall back to copying the link below
      }
    }

    if (await copyText(url)) {
      toast.success("Link copied", { description: "Paste it anywhere to share this post." });
    } else {
      // Last resort: show the link so it can be copied by hand
      toast.error("Couldn't copy the link", { description: url });
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-overlay px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      Share
    </button>
  );
}
