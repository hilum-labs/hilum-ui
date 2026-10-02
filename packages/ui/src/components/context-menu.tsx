"use client";

import * as React from "react";
import { ContextMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import { useDensityAttributes } from "../lib/density-context";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

const ContextMenuRoot = ContextMenu.Root;
const ContextMenuTrigger = ContextMenu.Trigger;
const ContextMenuGroup = ContextMenu.Group;
const ContextMenuPortal = ContextMenu.Portal;
const ContextMenuSub = ContextMenu.Sub;
const ContextMenuRadioGroup = ContextMenu.RadioGroup;

function ContextMenuContent({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenu.Content>) {
  return (
    <>
      <ContextMenu.Portal>
        <ContextMenu.Content
          {...useDensityAttributes()}
          ref={ref}
          data-slot="context-menu-content"
          data-hilum-mobile-sheet="true"
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-card-foreground shadow-elevated outline-none",
            mobilePopperSheetPositionClassName,
            mobilePopperSheetSurfaceClassName,
            "max-md:overflow-y-auto max-md:px-2 max-md:pb-2 max-md:pt-5",
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
  );
}
ContextMenuContent.displayName = "ContextMenuContent";

function ContextMenuItem({
  ref,
  className,
  inset,
  destructive,
  ...props
}: React.ComponentProps<typeof ContextMenu.Item> & {
  inset?: boolean;
  destructive?: boolean;
}) {
  return (
    <ContextMenu.Item
      ref={ref}
      data-slot="context-menu-item"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 compact:min-h-7 compact:px-2 compact:py-1 compact:text-[13px] compact:rounded-[4px]",
        "body outline-none transition-colors",
        destructive
          ? "text-destructive-text focus:bg-destructive/10 focus:text-destructive-text"
          : "text-foreground focus:bg-active",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuItem.displayName = "ContextMenuItem";

function ContextMenuCheckboxItem({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenu.CheckboxItem>) {
  return (
    <ContextMenu.CheckboxItem
      ref={ref}
      data-slot="context-menu-checkbox-item"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md py-2 ps-8 pe-2.5 compact:min-h-7 compact:py-1 compact:ps-7 compact:pe-2 compact:text-[13px] compact:rounded-[4px]",
        "body text-foreground outline-none transition-colors",
        "focus:bg-active focus:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-3.5 items-center justify-center">
        <ContextMenu.ItemIndicator>
          <Check size={13} className="text-foreground" />
        </ContextMenu.ItemIndicator>
      </span>
      {children}
    </ContextMenu.CheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

function ContextMenuRadioItem({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenu.RadioItem>) {
  return (
    <ContextMenu.RadioItem
      ref={ref}
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md py-2 ps-8 pe-2.5 compact:min-h-7 compact:py-1 compact:ps-7 compact:pe-2 compact:text-[13px] compact:rounded-[4px]",
        "body text-foreground outline-none transition-colors",
        "focus:bg-active focus:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-3.5 items-center justify-center">
        <ContextMenu.ItemIndicator>
          <Circle size={8} className="fill-foreground text-foreground" />
        </ContextMenu.ItemIndicator>
      </span>
      {children}
    </ContextMenu.RadioItem>
  );
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

function ContextMenuLabel({
  ref,
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenu.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenu.Label
      ref={ref}
      data-slot="context-menu-label"
      className={cn(
        "px-2.5 py-1 label text-muted-foreground compact:px-2 compact:text-[11px]",
        // A plain-text label is an eyebrow; rich content (an account header with
        // the user's name and email) renders as typed.
        "[&_*]:normal-case [&_*]:tracking-normal",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuLabel.displayName = "ContextMenuLabel";

function ContextMenuSeparator({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenu.Separator>) {
  return (
    <ContextMenu.Separator
      ref={ref}
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";

function ContextMenuSubTrigger({
  ref,
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenu.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenu.SubTrigger
      ref={ref}
      data-slot="context-menu-sub-trigger"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 compact:min-h-7 compact:px-2 compact:py-1 compact:text-[13px] compact:rounded-[4px]",
        "body text-foreground outline-none transition-colors",
        "focus:bg-active focus:text-foreground data-[state=open]:bg-active",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight size={14} className="ms-auto text-muted-foreground rtl:-scale-x-100" />
    </ContextMenu.SubTrigger>
  );
}
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

function ContextMenuSubContent({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenu.SubContent>) {
  return (
    <>
      <ContextMenu.SubContent
        {...useDensityAttributes()}
        ref={ref}
        data-slot="context-menu-sub-content"
        data-hilum-mobile-sheet="true"
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card p-1 text-card-foreground shadow-elevated outline-none",
          mobilePopperSheetPositionClassName,
          mobilePopperSheetSurfaceClassName,
          "max-md:overflow-y-auto max-md:px-2 max-md:pb-2 max-md:pt-5",
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
  );
}
ContextMenuSubContent.displayName = "ContextMenuSubContent";

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("ms-auto caption text-muted-foreground", className)}
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
