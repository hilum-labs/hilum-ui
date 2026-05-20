"use client";

import * as React from "react";
import { NavigationMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const NavigationMenuRoot = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenu.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
  </NavigationMenu.Root>
));
NavigationMenuRoot.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.List>
>(({ className, ...props }, ref) => (
  <NavigationMenu.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = NavigationMenu.Item;

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenu.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 py-2",
      "body font-medium text-ground-700",
      "hover:bg-ground-100 hover:text-ground-900",
      "data-[active]:bg-ground-100 data-[state=open]:bg-ground-100",
      "outline-none transition-colors",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown
      size={12}
      className="transition-transform duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenu.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      "md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Link
    ref={ref}
    className={cn(
      "block select-none rounded-md px-3 py-2 body text-ground-700",
      "hover:bg-ground-50 hover:text-ground-900",
      "outline-none transition-colors",
      className,
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = "NavigationMenuLink";

const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenu.Viewport
      ref={ref}
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border border-ground-100 bg-white shadow-elevated",
        "md:w-[var(--radix-navigation-menu-viewport-width)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
        className,
      )}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenu.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-ground-100 shadow-elevated" />
  </NavigationMenu.Indicator>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

function navigationMenuTriggerStyle() {
  return cn(
    "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 py-2",
    "body font-medium text-ground-700",
    "hover:bg-ground-100 hover:text-ground-900",
    "data-[active]:bg-ground-100 data-[state=open]:bg-ground-100",
    "outline-none transition-colors",
  );
}

export {
  NavigationMenuRoot as NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
};
