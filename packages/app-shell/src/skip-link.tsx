import type { MouseEvent, ReactNode } from "react";
import { cn } from "@hilum/ui";

const DEFAULT_MAIN_ID = "main-content";

interface SkipLinkProps {
  /** Id of the element to jump to (without `#`). Default: `main-content`. */
  targetId?: string;
  /** Link text. Default: "Skip to content". */
  children?: ReactNode;
  className?: string;
}

/**
 * Visually hidden "Skip to content" link that appears on keyboard focus.
 * Rendered automatically by `<AppShell>` / `<AppShellStacked>`; render it
 * yourself as the first focusable element when composing a custom frame.
 *
 * Focus is moved programmatically so the jump works even when a client-side
 * router intercepts hash changes. The target should have `tabIndex={-1}`.
 */
function SkipLink({
  targetId = DEFAULT_MAIN_ID,
  children = "Skip to content",
  className,
}: SkipLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = typeof document !== "undefined" ? document.getElementById(targetId) : null;
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView?.({ block: "start" });
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      data-slot="skip-link"
      className={cn(
        "sr-only",
        "focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2",
        "focus:caption focus:font-medium focus:text-foreground focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    >
      {children}
    </a>
  );
}

export { DEFAULT_MAIN_ID, SkipLink };
export type { SkipLinkProps };
