import * as React from "react";
import { cn } from "../lib/utils";
import {
  focusRingClasses,
  iconStrokeClasses,
  pressClasses,
  springMotionClasses,
} from "../lib/interaction";

interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  trailing?: React.ReactNode;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ icon, active, trailing, className, children, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-10 items-center gap-2 rounded-xl px-3 body font-medium",
        active
          ? "bg-brand-secondary/35 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        springMotionClasses,
        pressClasses,
        focusRingClasses,
        iconStrokeClasses,
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing && <span className="shrink-0 text-muted-foreground">{trailing}</span>}
    </a>
  ),
);
NavItem.displayName = "NavItem";

export { NavItem };
export type { NavItemProps };
