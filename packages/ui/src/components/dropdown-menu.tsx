"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import { useDensityAttributes } from "../lib/density-context";
import {
  menuItemActiveClasses,
  menuItemClasses,
  motionClasses,
  pressClasses,
} from "../lib/interaction";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

const DropdownMenuRoot = DropdownMenu.Root;
const DropdownMenuTrigger = DropdownMenu.Trigger;
const DropdownMenuGroup = DropdownMenu.Group;
const DropdownMenuPortal = DropdownMenu.Portal;
const DropdownMenuSub = DropdownMenu.Sub;
const DropdownMenuRadioGroup = DropdownMenu.RadioGroup;

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Content>) {
  const densityAttributes = useDensityAttributes();
  return (
    <>
      <style>{mobilePopperSheetStyle}</style>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          {...densityAttributes}
          data-slot="dropdown-menu-content"
          data-hilum-mobile-sheet="true"
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[8rem] rounded-xl border border-border bg-card p-1 shadow-elevated",
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
      </DropdownMenu.Portal>
    </>
  );
}
DropdownMenuContent.displayName = "DropdownMenuContent";

function DropdownMenuItem({
  className,
  inset,
  destructive,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item> & {
  inset?: boolean;
  destructive?: boolean;
}) {
  return (
    <DropdownMenu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        menuItemClasses,
        motionClasses,
        pressClasses,
        destructive
          ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
          : "text-foreground focus:bg-active",
        !destructive && menuItemActiveClasses,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    />
  );
}
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.CheckboxItem>) {
  return (
    <DropdownMenu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        menuItemClasses,
        menuItemActiveClasses,
        "py-2 ps-8 pe-2.5 text-foreground compact:ps-7 compact:pe-2",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-3.5 items-center justify-center">
        <DropdownMenu.ItemIndicator>
          <Check size={13} className="text-foreground" />
        </DropdownMenu.ItemIndicator>
      </span>
      {children}
    </DropdownMenu.CheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.RadioItem>) {
  return (
    <DropdownMenu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        menuItemClasses,
        menuItemActiveClasses,
        "py-2 ps-8 pe-2.5 text-foreground compact:ps-7 compact:pe-2",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex size-3.5 items-center justify-center">
        <DropdownMenu.ItemIndicator>
          <Circle size={8} className="fill-foreground text-foreground" />
        </DropdownMenu.ItemIndicator>
      </span>
      {children}
    </DropdownMenu.RadioItem>
  );
}
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenu.Label
      data-slot="dropdown-menu-label"
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
DropdownMenuLabel.displayName = "DropdownMenuLabel";

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Separator>) {
  return (
    <DropdownMenu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenu.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        menuItemClasses,
        menuItemActiveClasses,
        "text-foreground data-[state=open]:bg-active",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight size={14} className="ms-auto text-muted-foreground rtl:-scale-x-100" />
    </DropdownMenu.SubTrigger>
  );
}
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubContent>) {
  const densityAttributes = useDensityAttributes();
  return (
    <>
      <style>{mobilePopperSheetStyle}</style>
      <DropdownMenu.SubContent
        {...densityAttributes}
        data-slot="dropdown-menu-sub-content"
        data-hilum-mobile-sheet="true"
        className={cn(
          "z-50 min-w-[8rem] rounded-xl border border-border bg-card p-1 shadow-elevated",
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
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ms-auto caption text-muted-foreground", className)}
      {...props}
    />
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
};
