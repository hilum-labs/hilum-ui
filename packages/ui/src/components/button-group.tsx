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
        "inline-flex items-center gap-0.5 rounded-2xl bg-muted p-1",
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
        "relative inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 body font-medium",
        "transition-[background-color,box-shadow,color,opacity,scale] active:scale-[0.96]",
        "focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        active
          ? "bg-card text-foreground shadow-natural"
          : "text-muted-foreground hover:text-foreground",
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
