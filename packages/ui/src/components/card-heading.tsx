import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface CardHeadingAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

interface CardHeadingProps {
  title: string;
  description?: string;
  actions?: CardHeadingAction[];
  children?: React.ReactNode; // e.g. avatar or icon on the left
  className?: string;
}

function CardHeading({ title, description, actions, children, className }: CardHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border px-5 py-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {children}
        <div className="min-w-0">
          <p className="body font-semibold text-foreground truncate">{title}</p>
          {description && <p className="caption text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-2">
          {actions.map((action, i) =>
            action.href ? (
              <Button key={i} size="sm" variant={action.variant ?? "default"} asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button
                key={i}
                size="sm"
                variant={action.variant ?? "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export { CardHeading };
