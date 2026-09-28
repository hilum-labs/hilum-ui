"use client";

import * as React from "react";
import { NavigationMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

function NavigationMenuRoot({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Root>) {
  return (
    <NavigationMenu.Root
      data-slot="navigation-menu"
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
    </NavigationMenu.Root>
  );
}
NavigationMenuRoot.displayName = "NavigationMenu";

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenu.List>) {
  return (
    <NavigationMenu.List
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
}
NavigationMenuList.displayName = "NavigationMenuList";

function NavigationMenuItem(props: React.ComponentProps<typeof NavigationMenu.Item>) {
  return <NavigationMenu.Item data-slot="navigation-menu-item" {...props} />;
}
NavigationMenuItem.displayName = "NavigationMenuItem";

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Trigger>) {
  return (
    <NavigationMenu.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group inline-flex h-10 w-max items-center justify-center gap-1 rounded-md px-3 py-2",
        "body font-medium text-muted-foreground",
        "hover:bg-muted hover:text-foreground",
        "data-[active]:bg-active data-[state=open]:bg-active",
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
  );
}
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Content>) {
  return (
    <NavigationMenu.Content
      data-slot="navigation-menu-content"
      className={cn(
        "start-0 top-0 w-full",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
        "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        "md:absolute md:w-auto",
        className,
      )}
      {...props}
    />
  );
}
NavigationMenuContent.displayName = "NavigationMenuContent";

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Link>) {
  return (
    <NavigationMenu.Link
      data-slot="navigation-menu-link"
      className={cn(
        "block min-h-10 select-none rounded-md px-3 py-2 body text-muted-foreground",
        "hover:bg-muted hover:text-foreground",
        "outline-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}
NavigationMenuLink.displayName = "NavigationMenuLink";

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Viewport>) {
  return (
    <div
      data-slot="navigation-menu-viewport-wrapper"
      className="absolute start-0 top-full flex justify-center"
    >
      <NavigationMenu.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border border-border bg-card shadow-elevated",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
          className,
        )}
        {...props}
      />
    </div>
  );
}
NavigationMenuViewport.displayName = "NavigationMenuViewport";

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenu.Indicator>) {
  return (
    <NavigationMenu.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
        "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      {/* Rotated diamond: the physical top-left corner is its top tip, so it stays physical. */}
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-muted shadow-elevated" />
    </NavigationMenu.Indicator>
  );
}
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

function navigationMenuTriggerStyle() {
  return cn(
    "group inline-flex h-10 w-max items-center justify-center gap-1 rounded-md px-3 py-2",
    "body font-medium text-muted-foreground",
    "hover:bg-muted hover:text-foreground",
    "data-[active]:bg-active data-[state=open]:bg-active",
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
