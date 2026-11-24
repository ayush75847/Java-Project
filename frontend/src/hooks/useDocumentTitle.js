import { useEffect } from "react";

// Sets the browser tab title while a page is open, e.g. "About · Inkly",
// and puts back the previous title when you leave the page.
// Pass null/undefined while there is nothing to show yet (e.g. a post still loading).
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} · Inkly`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
