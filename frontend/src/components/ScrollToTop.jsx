import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";

// React Router keeps the old scroll position when you open a new page, so clicking a post
// at the bottom of the feed would open it half-way down. This jumps to the top instead.
// Browser Back/Forward ("POP") is left alone, so going back returns you to where you were.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}
