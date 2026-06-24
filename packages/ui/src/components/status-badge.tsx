"use client";

import * as React from "react";
import { Badge } from "./badge";
import { cn } from "../lib/utils";

type StatusBadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>;

interface StatusBadgeProps extends Omit<
  React.ComponentProps<typeof Badge>,
  "children" | "variant"
> {
  status?: string | null;
  label?: React.ReactNode;
  variant?: StatusBadgeVariant;
  variantMap?: Record<string, StatusBadgeVariant>;
  labelMap?: Record<string, React.ReactNode>;
  showDot?: boolean;
  dotClassName?: string;
}

const DEFAULT_STATUS_VARIANT: Record<string, StatusBadgeVariant> = {
  active: "success",
  approved: "success",
  complete: "success",
  completed: "success",
  confirmed: "success",
  delivered: "success",
  enabled: "success",
  healthy: "success",
  optimized: "success",
  paid: "success",
  published: "success",
  resolved: "success",
  translated: "success",
  verified: "success",

  degraded: "warning",
  flagged: "warning",
  held_for_review: "warning",
  pending: "warning",
  processing: "warning",
  retrying: "warning",
  scheduled: "warning",
  trial: "warning",
  warning: "warning",

  archived: "secondary",
  disabled: "secondary",
  draft: "secondary",
  inactive: "secondary",
  missing: "secondary",
  neutral: "secondary",
  skipped: "secondary",

  blocked: "destructive",
  cancelled: "destructive",
  critical: "destructive",
  dead_letter: "destructive",
  deleted: "destructive",
  error: "destructive",
  failed: "destructive",
  rejected: "destructive",
  suspended: "destructive",
  unpaid: "destructive",
  outdated: "destructive",
};

const DEFAULT_DOT_CLASS: Record<StatusBadgeVariant, string> = {
  default: "bg-background",
  secondary: "bg-muted-foreground",
  outline: "bg-muted-foreground",
  brand: "bg-background",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
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
  variant,
  variantMap,
  labelMap,
  showDot = false,
  dotClassName,
  className,
  ...props
}: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const resolvedVariant = variant ?? statusBadgeVariantFor(normalized, variantMap);
  const resolvedLabel = label ?? labelMap?.[normalized] ?? statusLabel(normalized);

  return (
    <Badge
      variant={resolvedVariant}
      className={cn("max-w-full whitespace-nowrap", showDot && "pl-2", className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            DEFAULT_DOT_CLASS[resolvedVariant],
            dotClassName,
          )}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 truncate">{resolvedLabel}</span>
    </Badge>
  );
}

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariantFor, statusLabel };
export type { StatusBadgeProps, StatusBadgeVariant };
