import { useEffect, useRef } from "react";

// A thin orange bar under the navbar that fills up as you scroll through a post.
// It changes the bar's width directly (no React state), so scrolling never re-renders the page.
export default function ReadingProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    }
    // At most one update per screen refresh, however fast the scroll events come
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-10 h-0.5" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full origin-left bg-linear-to-r from-brand-600 to-brand-400"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
