import * as React from "react";
import { cn } from "../lib/utils";

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex divide-x divide-border overflow-hidden rounded-lg border border-border bg-card shadow-natural",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function ButtonGroupItem({ active, className, children, ...props }: ButtonGroupItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex min-h-10 items-center gap-1.5 px-3.5 py-2 body font-medium transition-colors",
        "focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-inset",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

ButtonGroup.displayName = "ButtonGroup";
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem };
