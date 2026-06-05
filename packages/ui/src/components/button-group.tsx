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
        "inline-flex divide-x divide-ground-200 overflow-hidden rounded-lg border border-ground-200 bg-white shadow-natural",
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
        "relative inline-flex items-center gap-1.5 px-3.5 py-2 body font-medium transition-colors",
        "focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ground-400/40 focus-visible:ring-inset",
        active
          ? "bg-ground-900 text-white"
          : "text-ground-600 hover:bg-ground-50 hover:text-ground-900",
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
