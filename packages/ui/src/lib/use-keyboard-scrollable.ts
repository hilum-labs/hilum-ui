"use client";

import * as React from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Keyboard access for a scroll container (WCAG 2.1.1, axe's
 * scrollable-region-focusable): while `ref`'s content overflows and has
 * nothing focusable to scroll it into view, the container itself joins the tab
 * order so arrow keys and Page Up/Down scroll it. Spread the result on the
 * scrolling element; pair it with a visible focus style.
 */
function useKeyboardScrollable(ref: React.RefObject<HTMLElement | null>): {
  tabIndex?: 0;
} {
  const [focusable, setFocusable] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const overflows =
        el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      setFocusable(overflows && !el.querySelector(FOCUSABLE));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(el);
    for (const child of Array.from(el.children)) resize.observe(child);
    const mutation = new MutationObserver(schedule);
    mutation.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "tabindex", "href"],
    });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
    };
  }, [ref]);

  return focusable ? { tabIndex: 0 } : {};
}

export { useKeyboardScrollable };
