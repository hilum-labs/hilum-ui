import * as React from "react";
import { cn } from "../lib/utils";

interface StackedListProps {
  children: React.ReactNode;
  divided?: boolean;
  bordered?: boolean;
  className?: string;
}

function StackedList({
  children,
  divided = true,
  bordered = true,
  className,
}: StackedListProps) {
  return (
    <ul
      role="list"
      className={cn(
        "overflow-hidden rounded-xl bg-white",
        bordered && "border border-taupe-100 shadow-natural",
        divided && "divide-y divide-taupe-100",
        className
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
  const inner = (
    <div className={cn("px-4 py-3.5", className)}>{children}</div>
  );

  if (href) {
    return (
      <li>
        <a href={href} className="block hover:bg-taupe-50 transition-colors">
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
          className="w-full text-left hover:bg-taupe-50 transition-colors"
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
