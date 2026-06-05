import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeadingAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  primary?: boolean;
}

interface PageHeadingMeta {
  icon?: React.ReactNode;
  text: string;
}

interface PageHeadingProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageHeadingAction[];
  meta?: PageHeadingMeta[];
  badge?: string | { label: string; variant?: "default" | "secondary" | "outline" | "destructive" };
  className?: string;
}

function PageHeading({
  title,
  description,
  breadcrumbs,
  actions,
  meta,
  badge,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("border-b border-border pb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1.5" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={12} className="text-muted-foreground shrink-0" />}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="caption text-muted-foreground hover:text-muted-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="caption font-semibold text-muted-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="display text-foreground truncate">{title}</h1>
            {badge &&
              (typeof badge === "string" ? (
                <Badge variant="secondary">{badge}</Badge>
              ) : (
                <Badge variant={badge.variant ?? "secondary"}>{badge.label}</Badge>
              ))}
          </div>
          {description && <p className="mt-1.5 body text-muted-foreground max-w-2xl">{description}</p>}

          {/* Meta */}
          {meta && meta.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {meta.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 caption text-muted-foreground">
                  {m.icon && <span className="text-muted-foreground">{m.icon}</span>}
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            {actions.map((action, i) =>
              action.href ? (
                <Button
                  key={i}
                  size="sm"
                  variant={action.primary ? "default" : (action.variant ?? "outline")}
                  asChild
                >
                  <a href={action.href}>{action.label}</a>
                </Button>
              ) : (
                <Button
                  key={i}
                  size="sm"
                  variant={action.primary ? "default" : (action.variant ?? "outline")}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { PageHeading };
