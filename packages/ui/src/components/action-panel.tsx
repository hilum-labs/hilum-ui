import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface ActionPanelAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost";
}

interface ActionPanelLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ActionPanelProps {
  title: string;
  description?: string;
  action?: ActionPanelAction;
  actions?: ActionPanelAction[];
  link?: ActionPanelLink;
  variant?: "default" | "muted";
  layout?: "stacked" | "inline";
  children?: React.ReactNode;
  className?: string;
}

function ActionPanel({
  title,
  description,
  action,
  actions,
  link,
  variant = "default",
  layout = "stacked",
  children,
  className,
}: ActionPanelProps) {
  const allActions = actions ?? (action ? [action] : []);

  const renderActions = () => {
    if (allActions.length === 0 && !link) return null;
    return (
      <div className="flex items-center gap-2">
        {link &&
          (link.href ? (
            <a
              href={link.href}
              className="inline-flex min-h-10 items-center gap-1 body font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label} <span aria-hidden>→</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={link.onClick}
              className="inline-flex min-h-10 items-center gap-1 body font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label} <span aria-hidden>→</span>
            </button>
          ))}
        {allActions.map((a, i) =>
          a.href ? (
            <Button key={i} size="sm" variant={a.variant ?? "default"} asChild>
              <a href={a.href}>{a.label}</a>
            </Button>
          ) : (
            <Button key={i} size="sm" variant={a.variant ?? "default"} onClick={a.onClick}>
              {a.label}
            </Button>
          ),
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-5",
        variant === "muted" ? "border-border bg-muted" : "border-border bg-card shadow-natural",
        layout === "inline" && "flex items-center justify-between gap-6",
        className,
      )}
    >
      <div className={cn("min-w-0", layout === "inline" ? "flex-1" : "")}>
        <p className="body font-semibold text-foreground text-balance">{title}</p>
        {description && (
          <p
            className={cn(
              "body text-muted-foreground text-pretty",
              layout === "stacked" ? "mt-1" : "",
            )}
          >
            {description}
          </p>
        )}
        {children && layout === "stacked" && <div className="mt-4">{children}</div>}
      </div>

      {layout === "stacked" ? (
        (allActions.length > 0 || link) && <div className="mt-4">{renderActions()}</div>
      ) : (
        <div className="shrink-0 flex items-center gap-3">
          {children}
          {renderActions()}
        </div>
      )}
    </div>
  );
}

ActionPanel.displayName = "ActionPanel";

export { ActionPanel };
