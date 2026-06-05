"use client";

import * as React from "react";
import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const AccordionRoot = React.forwardRef<
  React.ComponentRef<typeof Accordion.Root>,
  React.ComponentPropsWithoutRef<typeof Accordion.Root>
>(({ className, ...props }, ref) => (
  <Accordion.Root ref={ref} className={cn("divide-y divide-border", className)} {...props} />
));
AccordionRoot.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof Accordion.Item>,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ className, ...props }, ref) => (
  <Accordion.Item ref={ref} className={cn("", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between py-4",
        "body font-medium text-foreground transition-colors hover:text-muted-foreground",
        "[&[data-state=open]>svg]:rotate-180",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        size={16}
        className="text-muted-foreground transition-transform duration-200 shrink-0"
      />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className={cn(
      "overflow-hidden body text-muted-foreground",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-4">{children}</div>
  </Accordion.Content>
));
AccordionContent.displayName = "AccordionContent";

export { AccordionRoot as Accordion, AccordionItem, AccordionTrigger, AccordionContent };
