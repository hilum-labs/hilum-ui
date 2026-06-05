import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface SectionHeadingAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface SectionHeadingProps {
  title: string;
  description?: string;
  actions?: SectionHeadingAction[];
  border?: boolean;
  className?: string;
}

function SectionHeading({
  title,
  description,
  actions,
  border = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 pb-4 sm:flex-row sm:items-start sm:justify-between",
        border && "border-b border-border",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h2 className="heading text-foreground truncate">{title}</h2>
        {description && <p className="mt-1 body text-muted-foreground">{description}</p>}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-2 pt-1">
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

export { SectionHeading };
