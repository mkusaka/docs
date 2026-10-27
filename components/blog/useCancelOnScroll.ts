import { useEffect } from "react";

// Cancels in-flight AI generation once the user scrolls, to save Workers AI quota.
// ponytail: wheel/touch only (scroll events also fire on scroll restoration); keyboard scrolling is not caught.
export function useCancelOnScroll(active: boolean, cancel: () => void) {
  useEffect(() => {
    if (!active) return;
    const options = { once: true, passive: true };
    window.addEventListener("wheel", cancel, options);
    window.addEventListener("touchmove", cancel, options);
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
    };
  }, [active, cancel]);
}
