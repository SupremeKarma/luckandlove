
import { useEffect, useState } from "react";

/**
 * Generic media query hook (SSR-safe).
 * Returns false on the server, then updates on the client.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Set initial value
    setMatches(mql.matches);

    // Subscribe
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    // Cleanup
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}
