// Shared types for @hilum/app-shell.
import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  /** Caller-computed active state (D13). Use your router's pathname to decide. */
  active?: boolean;
  /** Render in a "coming soon" / disabled style. */
  disabled?: boolean;
  /** Optional callback (e.g. to close a mobile drawer). */
  onClick?: (event: unknown) => void;
}

export interface NavSection {
  /** Section heading. Optional. */
  label?: string;
  items: NavItem[];
}

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
 * `<AppShell linkComponent={Link}>` — see D13 in PLATFORM_PLAN.md.
 *
 * The injected component must accept at minimum:
 *   - `href: string` (the URL)
 *   - `children: ReactNode`
 *   - `className?: string`
 *   - `onClick?: ...`
 *
 * `react-router-dom` users pass a small adapter:
 *   `linkComponent={({ href, ...rest }) => <Link to={href} {...rest} />}`
 */
export type LinkComponentProps = {
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: (event: unknown) => void;
  [key: string]: unknown;
};
export type LinkComponent = ComponentType<LinkComponentProps>;
