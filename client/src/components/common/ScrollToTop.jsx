import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every navigation transition starts at the top of the viewport (top: 0, left: 0).
 * Prevents landing midway or at the bottom of pages after navigating from long feeds.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // Fallback for non-window environments
    }
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
