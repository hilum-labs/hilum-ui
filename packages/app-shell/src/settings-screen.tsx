import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@hilum/ui";
import { useLink } from "./link-context";

interface SettingsSection {
  /** Section anchor / id. Used for active-state matching. */
  id: string;
  label: string;
  description?: string;
  href?: string;
}

interface SettingsScreenProps {
  /** Sections shown in the left rail. */
  sections: SettingsSection[];
  /** Active section id — caller supplies based on route. */
  activeId?: string;
  /** Section content keyed by id. Render whatever you want for each. */
  children: ReactNode;
  /** Title at the top of the screen. */
  title?: ReactNode;
  /** Description under the title. */
  description?: ReactNode;
  className?: string;
}

/**
 * Settings layout — left-rail section nav + scrollable content. Designed
 * for product settings pages (account, billing, integrations, etc.).
 */
function SettingsScreen({
  sections,
  activeId,
  children,
  title,
  description,
  className,
}: SettingsScreenProps) {
  const Link = useLink();
  const navRef = useRef<HTMLElement>(null);

  // Below `md` the rail becomes a horizontal scroller — keep the active
  // section in view instead of clipping it off-screen.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = Math.max(0, active.offsetLeft - 16);
  }, [activeId]);

  return (
    <div className={cn("flex flex-col gap-6 p-4 sm:p-6 md:flex-row", className)}>
      <aside className="min-w-0 shrink-0 md:w-56">
        {title && <h1 className="heading text-balance text-foreground">{title}</h1>}
        {description && (
          <p className="caption mt-1.5 text-pretty text-muted-foreground">{description}</p>
        )}
        <nav
          ref={navRef}
          aria-label="Settings sections"
          className={cn(
            "-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden",
            "md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:px-0",
            (title || description) && "mt-4",
          )}
        >
          {sections.map((section) => {
            const active = section.id === activeId;
            const props = {
              href: section.href ?? `#${section.id}`,
              "aria-current": active ? ("page" as const) : undefined,
              className: cn(
                "flex min-h-10 shrink-0 flex-col justify-center rounded-lg px-3 py-2 whitespace-nowrap transition-colors md:whitespace-normal",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ),
            };
            return (
              <Link key={section.id} {...props}>
                <span className="caption font-medium">{section.label}</span>
                {section.description && (
                  <span
                    className={cn(
                      "caption-xs mt-0.5 hidden text-pretty md:block",
                      active ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {section.description}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export { SettingsScreen };
export type { SettingsScreenProps, SettingsSection };
