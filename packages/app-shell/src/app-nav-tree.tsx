import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn, useLink } from "@hilum/ui";
import { hasActiveDescendant, useExpandedState, wasDefaultPrevented } from "./nav-utils";
import type { NavItem, NavSection, SectionLabelVariant } from "./types";

interface AppNavTreeProps {
  sections: NavSection[];
  /** Accessible name for the `<nav>` landmark. Default: "Main". */
  label?: string;
  /** Called after a (non-prevented) navigation click — e.g. to close a drawer. */
  onNavigate?: () => void;
  getItemLabel?: (item: NavItem) => ReactNode;
  /** Section headings: tracked uppercase (`eyebrow`) or sentence case (`plain`). Default: `eyebrow`. */
  sectionLabelVariant?: SectionLabelVariant;
  className?: string;
}

/**
 * Full sectioned + nested navigation list for drawers and sheets. Used by the
 * `<AppMobileNav variant="drawer">` and `<Navbar>` mobile menus; also usable
 * inside any custom sheet.
 */
function AppNavTree({
  sections,
  label = "Main",
  onNavigate,
  getItemLabel,
  sectionLabelVariant = "eyebrow",
  className,
}: AppNavTreeProps) {
  return (
    <nav
      aria-label={label}
      className={cn("flex flex-col gap-4", className)}
      data-slot="app-nav-tree"
    >
      {sections.map((section, sectionIndex) => (
        <AppNavTreeSection
          key={section.label ?? sectionIndex}
          section={section}
          onNavigate={onNavigate}
          getItemLabel={getItemLabel}
          labelVariant={sectionLabelVariant}
        />
      ))}
    </nav>
  );
}

function AppNavTreeSection({
  section,
  onNavigate,
  getItemLabel,
  labelVariant,
}: {
  section: NavSection;
  onNavigate: (() => void) | undefined;
  getItemLabel: ((item: NavItem) => ReactNode) | undefined;
  labelVariant: SectionLabelVariant;
}) {
  const headingId = useId();
  return (
    <div className="flex flex-col gap-1">
      {section.label && (
        <p
          id={headingId}
          className={cn(
            "px-2 text-muted-foreground",
            labelVariant === "plain" ? "caption font-medium normal-case tracking-normal" : "label",
          )}
        >
          {section.label}
        </p>
      )}
      <ul
        className="flex flex-col gap-0.5"
        {...(section.label && { "aria-labelledby": headingId })}
      >
        {section.items.map((item, index) => (
          <AppNavTreeItem
            key={`${item.href}-${index}`}
            item={item}
            depth={0}
            onNavigate={onNavigate}
            getItemLabel={getItemLabel}
          />
        ))}
      </ul>
    </div>
  );
}

function AppNavTreeItem({
  item,
  depth,
  onNavigate,
  getItemLabel,
}: {
  item: NavItem;
  depth: number;
  onNavigate: (() => void) | undefined;
  getItemLabel: ((item: NavItem) => ReactNode) | undefined;
}) {
  const Link = useLink();
  const subListId = useId();
  const childActive = hasActiveDescendant(item);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const [expanded, setExpanded] = useExpandedState(
    item.defaultExpanded ?? childActive,
    childActive,
  );
  const Icon = item.icon;
  const itemLabel = getItemLabel ? getItemLabel(item) : item.label;

  const rowClass = cn(
    "flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-md px-2 body-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    depth > 0 && "ps-3",
  );
  const content = (
    <>
      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate">{itemLabel}</span>
      {item.badge != null && (
        <span className="caption shrink-0 rounded-full bg-muted px-1.5 font-medium text-muted-foreground">
          {item.badge}
        </span>
      )}
    </>
  );

  return (
    <li>
      <div className="flex min-w-0 items-center gap-1">
        {item.disabled ? (
          <span
            role="link"
            aria-disabled="true"
            className={cn(rowClass, "cursor-not-allowed text-muted-foreground/60")}
          >
            {content}
          </span>
        ) : (
          <Link
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            onClick={(event: unknown) => {
              item.onClick?.(event);
              if (!wasDefaultPrevented(event)) onNavigate?.();
            }}
            className={cn(
              rowClass,
              item.active
                ? "bg-brand-primary/10 font-medium text-brand-text"
                : childActive
                  ? "font-medium text-foreground hover:bg-muted"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {content}
          </Link>
        )}
        {hasChildren && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={subListId}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
            onClick={() => setExpanded(!expanded)}
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                expanded && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <ul
          id={subListId}
          hidden={!expanded}
          className="ms-4 mt-0.5 flex flex-col gap-0.5 border-s border-border ps-1"
        >
          {item.children!.map((child, index) => (
            <AppNavTreeItem
              key={`${child.href}-${index}`}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
              getItemLabel={getItemLabel}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export { AppNavTree };
export type { AppNavTreeProps };
