"use client";

import * as React from "react";
import { Badge, STATUS_TONE_BADGE, type StatusTone } from "./badge";
import { cn } from "../lib/utils";

type StatusBadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;
type StatusBadgeIcon = React.ComponentType<{ className?: string }>;

const DEFAULT_STATUS_TONE: Record<string, StatusTone> = {
  // success
  active: "success",
  approved: "success",
  authorized: "success",
  captured: "success",
  complete: "success",
  completed: "success",
  confirmed: "success",
  connected: "success",
  delivered: "success",
  enabled: "success",
  fulfilled: "success",
  healthy: "success",
  live: "success",
  optimized: "success",
  paid: "success",
  published: "success",
  resolved: "success",
  succeeded: "success",
  success: "success",
  translated: "success",
  verified: "success",
  // info
  in_progress: "info",
  in_transit: "info",
  info: "info",
  invited: "info",
  new: "info",
  open: "info",
  out_for_delivery: "info",
  processing: "info",
  scheduled: "info",
  shipped: "info",
  trial: "info",
  trialing: "info",
  // attention
  action_required: "attention",
  attention: "attention",
  flagged: "attention",
  held_for_review: "attention",
  on_hold: "attention",
  partially_fulfilled: "attention",
  partially_paid: "attention",
  requires_action: "attention",
  return_requested: "attention",
  unfulfilled: "attention",
  // warning
  degraded: "warning",
  expiring: "warning",
  overdue: "warning",
  past_due: "warning",
  pending: "warning",
  retrying: "warning",
  warning: "warning",
  // critical
  blocked: "critical",
  canceled: "critical",
  cancelled: "critical",
  chargeback: "critical",
  critical: "critical",
  dead_letter: "critical",
  declined: "critical",
  deleted: "critical",
  disputed: "critical",
  error: "critical",
  expired: "critical",
  failed: "critical",
  outdated: "critical",
  rejected: "critical",
  suspended: "critical",
  unpaid: "critical",
  voided: "critical",
  // neutral
  archived: "neutral",
  closed: "neutral",
  disabled: "neutral",
  draft: "neutral",
  inactive: "neutral",
  missing: "neutral",
  neutral: "neutral",
  partially_refunded: "neutral",
  refunded: "neutral",
  restocked: "neutral",
  returned: "neutral",
  skipped: "neutral",
  unknown: "neutral",
};

interface StatusBadgeProps extends Omit<
  React.ComponentProps<typeof Badge>,
  "children" | "variant"
> {
  status?: string | null;
  label?: React.ReactNode;
  /**
   * Semantic tone. Wins over `variant` and the built-in status map. Prefer
   * `tone` / `toneMap` over raw `variant` so colours stay consistent.
   */
  tone?: StatusTone;
  /** Per-app status → tone overrides, merged over the built-in convention. */
  toneMap?: Record<string, StatusTone>;
  variant?: StatusBadgeVariant;
  variantMap?: Record<string, StatusBadgeVariant>;
  labelMap?: Record<string, React.ReactNode>;
  icon?: StatusBadgeIcon;
  iconMap?: Record<string, StatusBadgeIcon>;
  iconClassName?: string;
  showDot?: boolean;
  dotClassName?: string;
}

const DEFAULT_STATUS_VARIANT: Record<string, StatusBadgeVariant> = Object.fromEntries(
  Object.entries(DEFAULT_STATUS_TONE).map(([status, tone]) => [
    status,
    STATUS_TONE_BADGE[tone].variant,
  ]),
);

const DEFAULT_DOT_CLASS: Record<StatusBadgeVariant, string> = {
  default: "bg-background",
  solid: "bg-background",
  dot: "bg-muted-foreground",
  secondary: "bg-muted-foreground",
  outline: "bg-muted-foreground",
  brand: "bg-background",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
};

const TONE_DOT_CLASS: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  info: "bg-blue-500",
  attention: "bg-orange-500",
  warning: "bg-amber-500",
  critical: "bg-destructive",
  neutral: "bg-muted-foreground",
};

function normalizeStatus(status?: string | null) {
  return String(status ?? "unknown")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function statusLabel(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (normalized === "unknown") return "Unknown";

  return normalized
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Resolve a status string to its semantic tone. Unknown statuses resolve to
 * `neutral`. Status strings are normalised ("Partially Fulfilled",
 * "partially-fulfilled" and "PARTIALLY_FULFILLED" are equivalent).
 */
function statusToneFor(status?: string | null, toneMap?: Record<string, StatusTone>): StatusTone {
  const normalized = normalizeStatus(status);
  return toneMap?.[normalized] ?? DEFAULT_STATUS_TONE[normalized] ?? "neutral";
}

function statusBadgeVariantFor(
  status?: string | null,
  variantMap?: Record<string, StatusBadgeVariant>,
) {
  const normalized = normalizeStatus(status);
  return variantMap?.[normalized] ?? DEFAULT_STATUS_VARIANT[normalized] ?? "outline";
}

function StatusBadge({
  status,
  label,
  tone,
  toneMap,
  variant,
  variantMap,
  labelMap,
  icon,
  iconMap,
  iconClassName,
  showDot = false,
  dotClassName,
  className,
  ...props
}: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  // Precedence: tone > toneMap > variant > variantMap > built-in tone map.
  const resolvedTone: StatusTone | undefined =
    tone ??
    toneMap?.[normalized] ??
    (variant === undefined && variantMap?.[normalized] === undefined
      ? DEFAULT_STATUS_TONE[normalized]
      : undefined);
  const toneBadge = resolvedTone ? STATUS_TONE_BADGE[resolvedTone] : undefined;
  const resolvedVariant =
    toneBadge?.variant ?? variant ?? statusBadgeVariantFor(normalized, variantMap);
  const resolvedColor = toneBadge?.color ?? props.color;
  const resolvedLabel = label ?? labelMap?.[normalized] ?? statusLabel(normalized);
  const Icon = icon ?? iconMap?.[normalized];

  return (
    <Badge
      data-slot="status-badge"
      variant={resolvedVariant}
      {...(resolvedColor ? { color: resolvedColor } : {})}
      data-tone={resolvedTone}
      className={cn("max-w-full whitespace-nowrap", (showDot || Icon) && "ps-2", className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            resolvedTone ? TONE_DOT_CLASS[resolvedTone] : DEFAULT_DOT_CLASS[resolvedVariant],
            dotClassName,
          )}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon className={cn("size-3 shrink-0", iconClassName)} aria-hidden="true" />}
      <span className="min-w-0 truncate">{resolvedLabel}</span>
    </Badge>
  );
}

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariantFor, statusLabel, statusToneFor, DEFAULT_STATUS_TONE };
export type { StatusBadgeProps, StatusBadgeVariant };
