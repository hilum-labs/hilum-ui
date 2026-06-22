import type { ReactNode } from "react";
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

  return (
    <div className={cn("flex flex-col gap-6 p-6 md:flex-row", className)}>
      <aside className="shrink-0 md:w-56">
        {title && <h1 className="heading text-balance text-foreground">{title}</h1>}
        {description && (
          <p className="caption mt-1.5 text-pretty text-muted-foreground">{description}</p>
        )}
        <nav className={cn("flex flex-col gap-0.5", (title || description) && "mt-4")}>
          {sections.map((section) => {
            const active = section.id === activeId;
            const props = {
              href: section.href ?? `#${section.id}`,
              className: cn(
                "flex min-h-10 flex-col justify-center rounded-lg px-3 py-2 transition-colors",
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
                      "caption-xs mt-0.5 text-pretty",
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
