"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useLink, type LinkComponent } from "../lib/link-context";
import { Button } from "./button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Optional leading icon. */
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /**
   * Primary call to action — every first-run empty state should have one
   * ("Add product", "Create discount"). `href` actions render through the
   * `LinkProvider` link component; pass an element for full control.
   */
  action?: EmptyStateAction | React.ReactElement;
  /** Secondary, lower-emphasis action (e.g. "Import CSV", "Learn more"). */
  secondaryAction?: EmptyStateAction | React.ReactElement;
  /**
   * `plain` (default) — sits inside an existing card/table.
   * `card` — standalone bordered surface for a whole page section.
   */
  variant?: "plain" | "card";
  /** `sm` for inline table/list bodies, `md` (default) for page sections. */
  size?: "sm" | "md";
  /**
   * Heading level for the title. Leave unset inside a page that already has
   * headings; use `1` when the empty state is the whole page (a 404, say).
   */
  headingLevel?: 1 | 2 | 3 | 4;
  /** Extra content below the actions (e.g. a help link or illustration). */
  children?: React.ReactNode;
  className?: string;
}

function renderAction(
  action: EmptyStateAction | React.ReactElement,
  variant: "primary" | "outline",
  Link: LinkComponent,
) {
  if (React.isValidElement(action)) return action;
  const { label, href, onClick, icon } = action as EmptyStateAction;
  const content = (
    <>
      {icon && (
        <span className="inline-flex shrink-0 [&_svg]:size-3.5" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </>
  );
  return href ? (
    <Button size="sm" variant={variant} asChild>
      <Link href={href}>{content}</Link>
    </Button>
  ) : (
    <Button size="sm" variant={variant} onClick={onClick}>
      {content}
    </Button>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "plain",
  size = "md",
  headingLevel,
  children,
  className,
}: EmptyStateProps) {
  const Link = useLink();
  const Title = headingLevel ? (`h${headingLevel}` as const) : "p";
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-4 text-center",
        size === "sm" ? "px-4 py-8" : "px-6 py-14",
        variant === "card" && "rounded-xl border border-dashed border-border bg-card",
        className,
      )}
    >
      {icon && (
        <div
          className="flex size-9 items-center justify-center rounded-md bg-brand-secondary/20 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Title className="body text-balance font-semibold text-foreground">{title}</Title>
        {description && (
          <p className="body max-w-sm text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action && renderAction(action, "primary", Link)}
          {secondaryAction && renderAction(secondaryAction, "outline", Link)}
        </div>
      )}
      {children}
    </div>
  );
}

EmptyState.displayName = "EmptyState";

export { EmptyState };
export type { EmptyStateProps, EmptyStateAction };
