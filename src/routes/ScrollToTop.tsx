import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to the top on every route change so navigation always lands on the hero,
 * not wherever the previous page was scrolled to. When the URL carries a hash (e.g. an
 * "Ishlab chiqarish" nav link pointing at #ishlab-chiqarish on the about-us page), scrolls
 * to that section instead, once the CMS content has had a chance to render.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    const id = hash.slice(1);
    const attempt = (retriesLeft: number) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (retriesLeft > 0) {
        setTimeout(() => attempt(retriesLeft - 1), 100);
      }
    };
    attempt(10);
  }, [pathname, hash]);

  return null;
}
