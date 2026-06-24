"use client";

import * as React from "react";
import { ContextMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

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
  <>
    <style>{mobilePopperSheetStyle}</style>
    <ContextMenu.Portal>
      <ContextMenu.Content
        ref={ref}
        data-hilum-mobile-sheet="true"
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-card-foreground shadow-elevated outline-none",
          mobilePopperSheetPositionClassName,
          mobilePopperSheetSurfaceClassName,
          "max-sm:overflow-y-auto max-sm:px-2 max-sm:pb-2 max-sm:pt-5",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          mobilePopperSheetMotionClassName,
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </ContextMenu.Portal>
  </>
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
      "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2",
      "body outline-none transition-colors",
      destructive
        ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
        : "text-muted-foreground focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5",
      "body text-muted-foreground outline-none transition-colors",
      "focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenu.ItemIndicator>
        <Check size={13} className="text-foreground" />
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
      "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5",
      "body text-muted-foreground outline-none transition-colors",
      "focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenu.ItemIndicator>
        <Circle size={8} className="fill-foreground text-foreground" />
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
    className={cn("px-2.5 py-1 label text-muted-foreground", inset && "pl-8", className)}
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
    className={cn("mx-1 my-1 h-px bg-muted", className)}
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
      "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2",
      "body text-muted-foreground outline-none transition-colors",
      "focus:bg-muted focus:text-foreground data-[state=open]:bg-muted",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight size={14} className="ml-auto text-muted-foreground" />
  </ContextMenu.SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenu.SubContent>
>(({ className, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <ContextMenu.SubContent
      ref={ref}
      data-hilum-mobile-sheet="true"
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-card-foreground shadow-elevated outline-none",
        mobilePopperSheetPositionClassName,
        mobilePopperSheetSurfaceClassName,
        "max-sm:overflow-y-auto max-sm:px-2 max-sm:pb-2 max-sm:pt-5",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        mobilePopperSheetMotionClassName,
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        className,
      )}
      {...props}
    />
  </>
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

function ContextMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto caption text-muted-foreground", className)} {...props} />;
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
