import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, LoaderCircle, X } from "lucide-react";
import { Button, cn, useLink } from "@hilum/ui";

type AppStatusBannerTone = "neutral" | "info" | "success" | "warning" | "danger";

interface AppStatusBannerAction {
  label: ReactNode;
  loadingLabel?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface AppStatusBannerProps {
  title: ReactNode;
  description?: ReactNode;
  tone?: AppStatusBannerTone;
  icon?: ReactNode;
  primaryAction?: AppStatusBannerAction;
  secondaryAction?: AppStatusBannerAction;
  onDismiss?: () => void;
  dismissLabel?: string;
  sticky?: boolean;
  className?: string;
}

// Semantic token surfaces only (no raw palette colours), so every tone keeps
// its contrast in light, mid and dark: `warning` is the token warning surface
// (butter in light, deep amber in dark) with its paired foreground; `success`
// is a lime tint under the regular foreground, with a solid lime icon chip.
const toneClassName: Record<AppStatusBannerTone, string> = {
  neutral: "border-border bg-card text-foreground",
  info: "border-brand-primary/25 bg-brand-secondary/25 text-foreground",
  success: "border-success/40 bg-success/15 text-foreground",
  warning: "border-warning-foreground/15 bg-warning text-warning-foreground",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
};

const iconClassName: Record<AppStatusBannerTone, string> = {
  neutral: "bg-background/70 text-muted-foreground",
  info: "bg-background/70 text-brand-primary",
  success: "bg-success text-success-foreground",
  warning: "bg-background/70 text-warning-foreground",
  danger: "bg-background/70 text-destructive",
};

const defaultIcon: Record<AppStatusBannerTone, ReactNode> = {
  neutral: <Info className="size-4" aria-hidden="true" />,
  info: <Info className="size-4" aria-hidden="true" />,
  success: <CheckCircle2 className="size-4" aria-hidden="true" />,
  warning: <AlertTriangle className="size-4" aria-hidden="true" />,
  danger: <AlertTriangle className="size-4" aria-hidden="true" />,
};

function AppStatusBannerActionButton({ action }: { action: AppStatusBannerAction }) {
  const Link = useLink();
  const variant = action.variant ?? "outline";
  const content = (
    <>
      {action.loading && <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />}
      {action.loading ? (action.loadingLabel ?? action.label) : action.label}
    </>
  );

  if (action.href) {
    return (
      <Button
        variant={variant}
        size="sm"
        className={cn("h-9 shrink-0 gap-1.5", action.className)}
        disabled={action.disabled || action.loading}
        asChild
      >
        <Link href={action.href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="sm"
      className={cn("h-9 shrink-0 gap-1.5", action.className)}
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
      type="button"
    >
      {content}
    </Button>
  );
}

function AppStatusBanner({
  title,
  description,
  tone = "neutral",
  icon,
  primaryAction,
  secondaryAction,
  onDismiss,
  dismissLabel = "Dismiss",
  sticky = false,
  className,
}: AppStatusBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 border-b px-3 py-2 shadow-natural sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-4",
        sticky && "sticky top-0 z-50",
        toneClassName[tone],
        className,
      )}
      data-slot="app-status-banner"
      data-tone={tone}
    >
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg sm:mt-0",
          iconClassName[tone],
        )}
        aria-hidden="true"
      >
        {icon ?? defaultIcon[tone]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="body-sm min-w-0 font-semibold text-balance">{title}</p>
        {description && <p className="caption mt-0.5 text-pretty opacity-80">{description}</p>}
      </div>
      {(secondaryAction || primaryAction || onDismiss) && (
        <div className="col-start-2 row-start-2 flex min-w-0 flex-wrap items-center justify-start gap-2 sm:col-start-3 sm:row-start-1 sm:shrink-0 sm:justify-end">
          {secondaryAction && <AppStatusBannerActionButton action={secondaryAction} />}
          {primaryAction && <AppStatusBannerActionButton action={primaryAction} />}
          {onDismiss && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0"
              onClick={onDismiss}
              aria-label={dismissLabel}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

AppStatusBanner.displayName = "AppStatusBanner";

export { AppStatusBanner };
export type { AppStatusBannerAction, AppStatusBannerProps, AppStatusBannerTone };
