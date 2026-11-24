import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";

// Same rules as the backend (ImageService + spring.servlet.multipart.max-file-size)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

// Cover image of a post: pick, preview, change or remove.
// It does NOT upload anything: the page uploads the file after the post is saved.
//   currentUrl: the image the post already has (edit mode), or null
//   file:       the newly picked File, or null
//   removed:    true when the user removed the current image
export default function ImagePicker({ currentUrl, file, removed, onPick, onRemove }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // A temporary blob: URL to show the picked file before it is uploaded.
  // Kept in a ref too, so we can free its memory when it's replaced or the page closes.
  const previewRef = useRef(null);
  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), []);

  function setPreview(picked) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(picked);
    setPreviewUrl(previewRef.current);
  }

  function handleChange(e) {
    const picked = e.target.files[0];
    e.target.value = ""; // so picking the same file again still fires onChange
    if (!picked) return;

    if (!ALLOWED_TYPES.includes(picked.type)) {
      return setError("Only JPG, PNG, WEBP or GIF images are allowed");
    }
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      return setError(`Image must be ${MAX_SIZE_MB} MB or smaller`);
    }
    setError("");
    setPreview(picked);
    onPick(picked);
  }

  // A new file wins; otherwise the post's current image, unless it was removed
  const shownUrl = file ? previewUrl : removed ? null : currentUrl;

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-ink">
        Cover image <span className="font-normal text-ink-subtle">(optional)</span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
        aria-label="Choose a cover image"
      />

      {shownUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          <img src={shownUrl} alt="Cover preview" className="max-h-72 w-full object-cover" />
          <div className="absolute right-3 bottom-3 flex gap-2">
            <Button type="button" variant="secondary" onClick={() => inputRef.current.click()}>
              Change
            </Button>
            <Button
              type="button"
              variant="danger"
              className="bg-surface-raised/90"
              onClick={() => {
                setError("");
                onRemove();
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong bg-surface-raised px-4 py-8 text-sm text-ink-muted transition hover:border-brand-500 hover:text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="font-semibold">Add a cover image</span>
          <span className="text-xs text-ink-subtle">JPG, PNG, WEBP or GIF, up to {MAX_SIZE_MB} MB</span>
        </button>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
