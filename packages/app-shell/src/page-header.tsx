import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface PageHeaderProps {
  /** Page title — typically rendered as h1. */
  title: ReactNode;
  /** Short prose under the title. */
  description?: ReactNode;
  /** Buttons or controls on the right. */
  actions?: ReactNode;
  /** Optional eyebrow above the title (e.g. category, breadcrumb summary). */
  eyebrow?: ReactNode;
  /** Heading level (default: 1). */
  level?: 1 | 2 | 3;
  className?: string;
}

function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  level = 1,
  className,
}: PageHeaderProps) {
  const Tag = `h${level}` as const;

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 pb-6 border-b border-border",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
            {eyebrow}
          </div>
        )}
        <Tag
          className={cn(
            level === 1
              ? "heading-xl text-foreground"
              : level === 2
                ? "heading text-foreground"
                : "subheading text-foreground",
          )}
        >
          {title}
        </Tag>
        {description && <p className="body text-muted-foreground mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
