import * as React from "react";
import { cn } from "../lib/utils";
import { useProximityIndex } from "../lib/interaction";
import { NavItem } from "./nav-item";

export interface NavMenuItem {
  href: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  trailing?: React.ReactNode;
}

interface NavMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: NavMenuItem[];
}

function NavMenu({ items, className, ...props }: NavMenuProps) {
  const { containerRef, handlers, registerItem, activeIndex } = useProximityIndex<HTMLElement>("y");

  return (
    <nav
      ref={containerRef}
      data-slot="nav-menu"
      className={cn("grid gap-1", className)}
      {...handlers}
      {...props}
    >
      {items.map((item, index) => (
        <NavItem
          key={item.href}
          ref={(node) => registerItem(index, node)}
          href={item.href}
          icon={item.icon}
          active={item.active || activeIndex === index}
          trailing={item.trailing}
        >
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
}

NavMenu.displayName = "NavMenu";

export { NavMenu };
export type { NavMenuProps };
