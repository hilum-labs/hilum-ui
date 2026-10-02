// Shared types for @hilum/app-shell.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  /** Optional shorter label used by compact/mobile navigation. */
  mobileLabel?: ReactNode;
  href: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  /** Caller-computed active state (D13). Use your router's pathname to decide. */
  active?: boolean;
  /** Render in a "coming soon" / disabled style. */
  disabled?: boolean;
  /** Optional callback (e.g. to close a mobile drawer). */
  onClick?: (event: unknown) => void;
  /**
   * Nested sub-items. The sidebar and drawer navigation render them as a
   * collapsible group under this item; it auto-expands while any descendant
   * is `active`.
   */
  children?: NavItem[];
  /** Initial expanded state for an item with `children` (default: expanded only when a descendant is active). */
  defaultExpanded?: boolean;
}

export interface NavSection {
  /** Section heading. Optional. */
  label?: string;
  items: NavItem[];
}

/**
 * Look of navigation section headings: `eyebrow` is the tracked uppercase
 * marker (default), `plain` a sentence-case caption.
 */
export type SectionLabelVariant = "eyebrow" | "plain";

export interface Crumb {
  label: string;
  href?: string;
}

export interface User {
  name: string;
  email?: string;
  avatarUrl?: string;
  /** 1–2 letter fallback (e.g. "TC") if no avatarUrl. */
  initials?: string;
}

/**
 * Component used to render anchors. Apps inject their router's link via
 * `<AppShell linkComponent={Link}>` (or `@hilum/ui`'s `<LinkProvider>`) — see
 * D13 in PLATFORM_PLAN.md. The context lives in `@hilum/ui`, so a single
 * provider drives links in both `@hilum/ui` and `@hilum/app-shell`.
 *
 * `react-router-dom` users pass a small adapter:
 *   `linkComponent={({ href, ...rest }) => <Link to={href} {...rest} />}`
 */
export type { LinkComponent, LinkComponentProps } from "@hilum/ui";
