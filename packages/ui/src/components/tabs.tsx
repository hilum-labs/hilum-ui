"use client";

import * as React from "react";
import { Tabs } from "radix-ui";
import { cn } from "../lib/utils";

const TabsRoot = React.forwardRef<
  React.ComponentRef<typeof Tabs.Root>,
  React.ComponentPropsWithoutRef<typeof Tabs.Root>
>(({ className, ...props }, ref) => (
  <Tabs.Root ref={ref} className={cn("w-full", className)} {...props} />
));
TabsRoot.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ComponentRef<typeof Tabs.List>,
  React.ComponentPropsWithoutRef<typeof Tabs.List>
>(({ className, ...props }, ref) => (
  <Tabs.List
    ref={ref}
    className={cn("inline-flex items-center gap-1 border-b border-ground-100 w-full", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tabs.Trigger>
>(({ className, ...props }, ref) => (
  <Tabs.Trigger
    ref={ref}
    className={cn(
      "px-0 pb-2.5 body font-medium text-ground-400",
      "border-b-2 border-transparent -mb-px",
      "transition-colors cursor-pointer",
      "data-[state=active]:text-brand-primary data-[state=active]:border-brand-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof Tabs.Content>
>(({ className, ...props }, ref) => (
  <Tabs.Content ref={ref} className={cn("mt-4", className)} {...props} />
));
TabsContent.displayName = "TabsContent";

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent };
