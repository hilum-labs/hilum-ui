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
        "inline-flex divide-x divide-taupe-200 overflow-hidden rounded-lg border border-taupe-200 bg-white shadow-natural",
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
        "focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taupe-400/40 focus-visible:ring-inset",
        active
          ? "bg-taupe-900 text-white"
          : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ButtonGroup, ButtonGroupItem };
