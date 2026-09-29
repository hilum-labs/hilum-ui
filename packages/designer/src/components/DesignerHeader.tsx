import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
  useLink,
} from "@hilum/ui";

/** An action button in the header (Publish, Preview, Share, Export, …). */
interface DesignerHeaderAction {
  label: ReactNode;
  onAction?: () => void;
  /** Renders a link (through `LinkProvider`) instead of a button. */
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  /** Accessible name when `label` isn't plain text. */
  accessibilityLabel?: string;
}

/** Localizable strings. Every entry has an English default. */
interface DesignerHeaderLabels {
  /** Overflow menu trigger. */
  moreActions: string;
}

const DESIGNER_HEADER_DEFAULT_LABELS: DesignerHeaderLabels = {
  moreActions: "More actions",
};

interface DesignerHeaderProps extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  /** Left-aligned content — file name, breadcrumbs, project switcher. */
  left?: ReactNode;
  /** Center content — typically the active document title. */
  center?: ReactNode;
  /**
   * Right-aligned free-form content — presence, zoom, account. Rendered before
   * the structured actions and clipped first when space runs out.
   */
  right?: ReactNode;
  /** Main call to action (e.g. Publish). Always visible, at the inline end. */
  primaryAction?: DesignerHeaderAction;
  /**
   * Secondary actions, rendered as outline buttons on wide headers (container
   * query) up to `maxVisibleSecondaryActions`; the rest, and all of them on
   * narrow headers, collapse into a "More actions" menu.
   */
  secondaryActions?: DesignerHeaderAction[];
  /** Secondary actions shown inline on wide headers before overflowing. Default: 2. */
  maxVisibleSecondaryActions?: number;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<DesignerHeaderLabels>;
  className?: string;
  children?: ReactNode;
}

function DesignerHeaderActionButton({
  action,
  variant,
  className,
}: {
  action: DesignerHeaderAction;
  variant: "primary" | "outline" | "destructive";
  className?: string;
}) {
  const Link = useLink();
  const disabled = Boolean(action.disabled || action.loading);
  const aria = action.accessibilityLabel ? { "aria-label": action.accessibilityLabel } : {};
  const content = (
    <>
      {action.icon}
      {action.label}
    </>
  );
  if (action.href && !disabled) {
    return (
      <Button variant={variant} size="sm" className={cn("shrink-0 gap-1.5", className)} asChild>
        <Link href={action.href} {...aria}>
          {content}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className={cn("shrink-0 gap-1.5", className)}
      disabled={Boolean(action.disabled)}
      loading={Boolean(action.loading)}
      {...(action.onAction && { onClick: action.onAction })}
      {...aria}
    >
      {content}
    </Button>
  );
}

function DesignerHeaderMoreActions({
  actions,
  label,
  className,
}: {
  actions: DesignerHeaderAction[];
  label: string;
  className?: string;
}) {
  const Link = useLink();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          title={label}
          className={cn("shrink-0", className)}
          data-slot="designer-header-more-actions"
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {actions.map((action, index) => {
          const disabled = Boolean(action.disabled || action.loading);
          const content = (
            <>
              {action.icon && (
                <span className="me-2 flex size-4 items-center justify-center" aria-hidden="true">
                  {action.icon}
                </span>
              )}
              {action.label}
            </>
          );
          return (
            <DropdownMenuItem
              key={index}
              disabled={disabled}
              {...(action.destructive && { destructive: true })}
              {...(action.onAction && { onSelect: action.onAction })}
              {...(action.accessibilityLabel && { "aria-label": action.accessibilityLabel })}
              asChild={Boolean(action.href) && !disabled}
            >
              {action.href && !disabled ? <Link href={action.href}>{content}</Link> : content}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Top bar of an editor app. Slot-driven — the chrome doesn't know what
 * goes in each region. Use <DesignerHeader left={...} center={...} right={...} />.
 *
 * Pass `primaryAction` / `secondaryActions` for the action cluster: the primary
 * (Publish) is never cut off, and secondary actions collapse into a
 * "More actions" menu when the header is narrow or there are many of them.
 */
function DesignerHeader({
  left,
  center,
  right,
  primaryAction,
  secondaryActions = [],
  maxVisibleSecondaryActions = 2,
  labels: labelsProp,
  className,
  children,
  ...props
}: DesignerHeaderProps) {
  const labels = { ...DESIGNER_HEADER_DEFAULT_LABELS, ...labelsProp };
  const inlineSecondary = secondaryActions.slice(0, maxVisibleSecondaryActions);
  const overflowSecondary = secondaryActions.slice(maxVisibleSecondaryActions);
  const hasActions = Boolean(primaryAction) || secondaryActions.length > 0;

  return (
    <header
      data-designer-header
      className={cn(
        "@container/designer-header grid h-12 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 bg-card px-3",
        className,
      )}
      {...props}
    >
      <div
        data-designer-header-slot="left"
        className="flex min-w-0 items-center gap-2 justify-self-start"
      >
        {left}
      </div>
      <div
        data-designer-header-slot="center"
        className="flex min-w-0 items-center gap-2 justify-self-center"
      >
        {center}
      </div>
      {/* justify-end: if the slot overflows, it overflows at the start, so the
          free-form content is clipped before the actions at the end. */}
      <div
        data-designer-header-slot="right"
        className="flex w-full min-w-0 items-center justify-end gap-2 justify-self-end"
      >
        {right !== undefined && (
          <div className="flex min-w-0 shrink items-center justify-end gap-2 overflow-hidden">
            {right}
          </div>
        )}
        {hasActions && (
          <div data-designer-header-actions="" className="flex shrink-0 items-center gap-2">
            {inlineSecondary.map((action, index) => (
              <DesignerHeaderActionButton
                key={index}
                action={action}
                variant={action.destructive ? "destructive" : "outline"}
                className="hidden @4xl/designer-header:inline-flex"
              />
            ))}
            {secondaryActions.length > 0 && (
              <DesignerHeaderMoreActions
                actions={secondaryActions}
                label={labels.moreActions}
                className="@4xl/designer-header:hidden"
              />
            )}
            {overflowSecondary.length > 0 && (
              <DesignerHeaderMoreActions
                actions={overflowSecondary}
                label={labels.moreActions}
                className="hidden @4xl/designer-header:inline-flex"
              />
            )}
            {primaryAction && (
              <DesignerHeaderActionButton
                action={primaryAction}
                variant={primaryAction.destructive ? "destructive" : "primary"}
              />
            )}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}

export { DesignerHeader, DESIGNER_HEADER_DEFAULT_LABELS };
export type { DesignerHeaderAction, DesignerHeaderLabels, DesignerHeaderProps };
