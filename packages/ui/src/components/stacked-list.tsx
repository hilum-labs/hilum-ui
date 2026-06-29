import * as React from "react";
import { cn } from "../lib/utils";

interface StackedListProps {
  children: React.ReactNode;
  divided?: boolean;
  bordered?: boolean;
  surface?: "card" | "responsive";
  className?: string;
}

function StackedList({
  children,
  divided = true,
  bordered = true,
  surface = "card",
  className,
}: StackedListProps) {
  return (
    <ul
      role="list"
      className={cn(
        "overflow-hidden rounded-xl bg-card",
        bordered && "border border-border shadow-natural",
        divided && "divide-y divide-border",
        surface === "responsive" &&
          "rounded-lg shadow-none max-sm:rounded-none max-sm:border-x-0 max-sm:bg-transparent",
        className,
      )}
    >
      {children}
    </ul>
  );
}

interface StackedListItemProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function StackedListItem({ children, href, onClick, className }: StackedListItemProps) {
  const inner = <div className={cn("px-4 py-3.5", className)}>{children}</div>;

  if (href) {
    return (
      <li>
        <a href={href} className="block hover:bg-muted transition-colors">
          {inner}
        </a>
      </li>
    );
  }

  if (onClick) {
    return (
      <li>
        <button
          type="button"
          className="w-full text-left hover:bg-muted transition-colors"
          onClick={onClick}
        >
          {inner}
        </button>
      </li>
    );
  }

  return <li>{inner}</li>;
}

export { StackedList, StackedListItem };
