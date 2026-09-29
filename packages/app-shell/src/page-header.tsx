import type { ReactNode } from "react";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useLink,
} from "@hilum/ui";
import { ArrowLeft, ChevronLeft, MoreHorizontal } from "lucide-react";

/** A page-level action (Polaris `Page` parity). Provide `href` or `onAction`. */
interface PageHeaderAction {
  label: ReactNode;
  /** Accessible name when `label` isn't plain text (or for icon-only rendering). */
  accessibilityLabel?: string;
  href?: string;
  onAction?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
}

interface PageHeaderBackAction {
  /** Accessible label, e.g. "Orders". Rendered as "Back to {label}" for screen readers. */
  label: string;
  href?: string;
  onAction?: () => void;
}

interface PageHeaderProps {
  /** Page title — typically rendered as h1. */
  title: ReactNode;
  /** Short prose under the title. */
  description?: ReactNode;
  /** Free-form buttons or controls at the end. Rendered after `secondaryActions`/`primaryAction`. */
  actions?: ReactNode;
  /** Main call to action, rendered as a primary button. */
  primaryAction?: PageHeaderAction;
  /**
   * Secondary actions, rendered as outline buttons. A single secondary action
   * always stays inline. With two or more, a narrow header (container query)
   * collapses them into a "More actions" menu, and a wide one shows up to
   * `maxVisibleSecondaryActions` and overflows the rest.
   */
  secondaryActions?: PageHeaderAction[];
  /** Secondary actions shown inline on wide headers before overflowing. Default: 3. */
  maxVisibleSecondaryActions?: number;
  /** Label for the overflow menu trigger. Default: "More actions". */
  moreActionsLabel?: string;
  /** Optional leading icon rendered inside the title. */
  icon?: ReactNode;
  /** Optional eyebrow above the title (e.g. category, breadcrumb summary). */
  eyebrow?: ReactNode;
  /**
   * Let long titles wrap instead of truncating when an `icon` is present
   * (recommended on mobile). Default: false.
   */
  wrapTitle?: boolean;
  /** Heading level (default: 1). */
  level?: 1 | 2 | 3;
  /**
   * Back link for detail pages ("‹ Orders"). Renders through the app's
   * injected link component. Prefer this over page-level breadcrumbs when the
   * AppHeader already shows the breadcrumb trail — never render both.
   */
  back?: { href: string; label: string };
  /** Icon-only back button beside the title (Polaris `backAction`). */
  backAction?: PageHeaderBackAction;
  /** Inline badges next to the title (e.g. `<StatusBadge status="paid" />`). */
  badges?: ReactNode;
  /** Polaris-style alias for `badges`: metadata rendered inline after the title. */
  titleMetadata?: ReactNode;
  /** Secondary metadata row under the title/description ("Created Sep 26, 2026 · Online Store"). */
  meta?: ReactNode;
  actionsClassName?: string;
  className?: string;
}

interface PageHeaderActionsProps {
  children: ReactNode;
  className?: string;
}

/**
 * Responsive action row. Stacked full-width (first child spans the row) while
 * the enclosing `@container/page-header` is narrow, inline from `@xl` (36rem).
 * `<PageHeader>` provides the container; when used standalone, wrap it in an
 * element with the `@container/page-header` class. Give a child
 * `data-span="full"` to keep it full-width in the stacked layout.
 */
function PageHeaderActions({ children, className }: PageHeaderActionsProps) {
  return (
    <div
      className={cn(
        "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2",
        "@xl/page-header:flex @xl/page-header:w-auto @xl/page-header:max-w-[65%] @xl/page-header:flex-wrap @xl/page-header:items-center @xl/page-header:justify-end",
        "[&>*:first-child]:col-span-2 [&>*:first-child]:w-full @xl/page-header:[&>*:first-child]:w-auto",
        "[&>[data-span=full]]:col-span-2",
        className,
      )}
      data-slot="page-header-actions"
    >
      {children}
    </div>
  );
}

function PageHeaderActionButton({
  action,
  variant,
  className,
}: {
  action: PageHeaderAction;
  variant: "primary" | "outline" | "destructive";
  className?: string;
}) {
  const Link = useLink();
  const disabled = action.disabled || action.loading;
  const aria = action.accessibilityLabel ? { "aria-label": action.accessibilityLabel } : {};
  const content = (
    <>
      {action.icon}
      {action.label}
    </>
  );

  if (action.href && !disabled) {
    return (
      <Button variant={variant} size="lg" className={cn("gap-1.5", className)} asChild>
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
      size="lg"
      className={cn("gap-1.5", className)}
      disabled={Boolean(action.disabled)}
      loading={Boolean(action.loading)}
      {...(action.onAction && { onClick: action.onAction })}
      {...aria}
    >
      {content}
    </Button>
  );
}

function PageHeaderMoreActions({
  actions,
  label,
  className,
}: {
  actions: PageHeaderAction[];
  label: string;
  className?: string;
}) {
  const Link = useLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn("gap-1.5", className)}
          data-slot="page-header-more-actions"
        >
          {label}
          <MoreHorizontal className="size-4" aria-hidden="true" />
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

function PageHeaderBackButton({ backAction }: { backAction: PageHeaderBackAction }) {
  const Link = useLink();
  const className =
    "flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const icon = <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />;
  const ariaLabel = `Back to ${backAction.label}`;

  if (backAction.href) {
    return (
      <Link
        href={backAction.href}
        aria-label={ariaLabel}
        className={className}
        data-slot="page-header-back"
        {...(backAction.onAction && { onClick: backAction.onAction })}
      >
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={backAction.onAction}
      data-slot="page-header-back"
    >
      {icon}
    </button>
  );
}

function PageHeader({
  title,
  description,
  actions,
  primaryAction,
  secondaryActions = [],
  maxVisibleSecondaryActions = 3,
  moreActionsLabel = "More actions",
  icon,
  eyebrow,
  level = 1,
  back,
  backAction,
  badges,
  titleMetadata,
  meta,
  wrapTitle = false,
  actionsClassName,
  className,
}: PageHeaderProps) {
  const Link = useLink();
  const Tag = `h${level}` as const;
  const metadata =
    badges || titleMetadata ? (
      <>
        {badges}
        {titleMetadata}
      </>
    ) : null;
  const headingTitle = icon ? (
    <span className={cn("flex min-w-0 gap-3", wrapTitle ? "items-start" : "items-center")}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/30 text-foreground ring-1 ring-border [&_svg]:size-5">
        {icon}
      </span>
      <span className={cn("min-w-0", wrapTitle ? "break-words" : "truncate")}>{title}</span>
    </span>
  ) : (
    title
  );

  // A lone secondary action is always inline: a menu holding one item only
  // hides it. With two or more, wide headers show up to
  // `maxVisibleSecondaryActions` inline and overflow the rest, and narrow
  // headers put every secondary action in the menu.
  const single = secondaryActions.length === 1 && maxVisibleSecondaryActions > 0;
  const inlineSecondary = secondaryActions.slice(0, maxVisibleSecondaryActions);
  const overflowSecondary = secondaryActions.slice(maxVisibleSecondaryActions);
  const hasStructuredActions = Boolean(primaryAction) || secondaryActions.length > 0;

  const structuredActions = hasStructuredActions && (
    <>
      {primaryAction && (
        <PageHeaderActionButton
          action={primaryAction}
          variant={primaryAction.destructive ? "destructive" : "primary"}
          className="@xl/page-header:order-last"
        />
      )}
      {inlineSecondary.map((action, index) => (
        <PageHeaderActionButton
          key={index}
          action={action}
          variant={action.destructive ? "destructive" : "outline"}
          {...(single ? {} : { className: "hidden @3xl/page-header:inline-flex" })}
        />
      ))}
      {secondaryActions.length > 0 && !single && (
        <PageHeaderMoreActions
          actions={secondaryActions}
          label={moreActionsLabel}
          className="@3xl/page-header:hidden"
        />
      )}
      {overflowSecondary.length > 0 && (
        <PageHeaderMoreActions
          actions={overflowSecondary}
          label={moreActionsLabel}
          className="hidden @3xl/page-header:inline-flex"
        />
      )}
    </>
  );

  const allActions =
    actions || hasStructuredActions ? (
      <>
        {structuredActions}
        {actions}
      </>
    ) : null;

  return (
    <div
      className={cn("@container/page-header min-w-0 border-b border-border pb-6", className)}
      data-slot="page-header"
    >
      <div className="flex min-w-0 flex-col gap-4 @xl/page-header:flex-row @xl/page-header:items-start @xl/page-header:justify-between">
        <div className="flex min-w-0 items-start gap-2">
          {backAction && <PageHeaderBackButton backAction={backAction} />}
          <div className="min-w-0">
            {back && (
              <Link
                href={back.href}
                className="caption -ms-1 mb-2 inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                {back.label}
              </Link>
            )}
            {eyebrow && (
              <div className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                {eyebrow}
              </div>
            )}
            <div
              className={cn(metadata && "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5")}
            >
              <Tag
                className={cn(
                  "min-w-0 text-balance",
                  level === 1
                    ? "heading-xl text-foreground"
                    : level === 2
                      ? "heading text-foreground"
                      : "subheading text-foreground",
                )}
              >
                {headingTitle}
              </Tag>
              {metadata && (
                <div
                  className="flex shrink-0 flex-wrap items-center gap-1.5"
                  data-slot="page-header-badges"
                >
                  {metadata}
                </div>
              )}
            </div>
            {description && (
              <p className="body mt-2 max-w-2xl text-pretty text-muted-foreground">{description}</p>
            )}
            {meta && (
              <div
                className="caption mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground"
                data-slot="page-header-meta"
              >
                {meta}
              </div>
            )}
          </div>
        </div>
        {allActions &&
          (actionsClassName ? (
            <PageHeaderActions className={actionsClassName}>{allActions}</PageHeaderActions>
          ) : (
            <PageHeaderActions>{allActions}</PageHeaderActions>
          ))}
      </div>
    </div>
  );
}

export { PageHeader, PageHeaderActions };
export type { PageHeaderAction, PageHeaderActionsProps, PageHeaderBackAction, PageHeaderProps };
