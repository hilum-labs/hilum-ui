import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-14 text-center", className)}>
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-xl bg-brand-secondary/20 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="body text-balance font-semibold text-foreground">{title}</p>
        {description && (
          <p className="body max-w-xs text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {action &&
        (action.href ? (
          <Button size="sm" asChild>
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  );
}

EmptyState.displayName = "EmptyState";

export { EmptyState };
