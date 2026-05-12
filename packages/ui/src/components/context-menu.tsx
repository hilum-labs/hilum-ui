"use client";

import * as React from "react";
import { ContextMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";

const ContextMenuRoot = ContextMenu.Root;
const ContextMenuTrigger = ContextMenu.Trigger;
const ContextMenuGroup = ContextMenu.Group;
const ContextMenuPortal = ContextMenu.Portal;
const ContextMenuSub = ContextMenu.Sub;
const ContextMenuRadioGroup = ContextMenu.RadioGroup;

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.Content>
>(({ className, ...props }, ref) => (
  <ContextMenu.Portal>
    <ContextMenu.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] bg-white rounded-xl shadow-natural p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        className
      )}
      {...props}
    />
  </ContextMenu.Portal>
));
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <ContextMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5",
      "body outline-none transition-colors",
      destructive
        ? "text-red-600 focus:bg-red-50 focus:text-red-700"
        : "text-taupe-700 focus:bg-taupe-50 focus:text-taupe-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md pl-8 pr-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenu.ItemIndicator>
        <Check size={13} className="text-taupe-900" />
      </ContextMenu.ItemIndicator>
    </span>
    {children}
  </ContextMenu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md pl-8 pr-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenu.ItemIndicator>
        <Circle size={8} className="fill-taupe-900 text-taupe-900" />
      </ContextMenu.ItemIndicator>
    </span>
    {children}
  </ContextMenu.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenu.Label
    ref={ref}
    className={cn(
      "px-2.5 py-1 label text-taupe-400",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenu.Separator
    ref={ref}
    className={cn("mx-1 my-1 h-px bg-taupe-100", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenu.SubTrigger
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900 data-[state=open]:bg-taupe-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight size={14} className="ml-auto text-taupe-400" />
  </ContextMenu.SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenu.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] bg-white rounded-xl border border-taupe-100 shadow-natural p-1",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
      className
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

function ContextMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto caption text-taupe-400", className)}
      {...props}
    />
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenuRoot as ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
};
