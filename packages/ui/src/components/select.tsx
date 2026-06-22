"use client";

import * as React from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

const SelectRoot = Select.Root;
const SelectGroup = Select.Group;
const SelectValue = Select.Value;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof Select.Trigger>,
  React.ComponentPropsWithoutRef<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-xl bg-card px-3 py-2",
      "body text-foreground shadow-natural",
      "focus:outline-none focus:ring-2 focus:ring-ring/20",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "data-[placeholder]:text-muted-foreground",
      "[&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <Select.Icon asChild>
      <ChevronDown size={15} className="text-muted-foreground shrink-0" />
    </Select.Icon>
  </Select.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof Select.Content>,
  React.ComponentPropsWithoutRef<typeof Select.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <Select.Portal>
    <Select.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "bg-card rounded-xl shadow-natural p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUp size={14} className="text-muted-foreground" />
      </Select.ScrollUpButton>
      <Select.Viewport
        className={cn(
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </Select.Viewport>
      <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDown size={14} className="text-muted-foreground" />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
  <Select.Item
    ref={ref}
    className={cn(
      "relative flex min-h-10 w-full cursor-default select-none items-center rounded-md px-2.5 py-2",
      "body text-muted-foreground outline-none",
      "focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <Select.ItemIndicator>
        <Check size={13} className="text-foreground" />
      </Select.ItemIndicator>
    </span>
    <Select.ItemText>{children}</Select.ItemText>
  </Select.Item>
));
SelectItem.displayName = "SelectItem";

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof Select.Label>,
  React.ComponentPropsWithoutRef<typeof Select.Label>
>(({ className, ...props }, ref) => (
  <Select.Label
    ref={ref}
    className={cn("px-2.5 py-1 label text-muted-foreground", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof Select.Separator>,
  React.ComponentPropsWithoutRef<typeof Select.Separator>
>(({ className, ...props }, ref) => (
  <Select.Separator ref={ref} className={cn("mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  SelectRoot as Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};
