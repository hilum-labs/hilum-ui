"use client";

import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
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

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
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
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      menuItemClasses,
      motionClasses,
      pressClasses,
      destructive
        ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
        : "text-muted-foreground focus:bg-muted focus:text-foreground",
      !destructive && menuItemActiveClasses,
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.CheckboxItem
    ref={ref}
    className={cn(
      menuItemClasses,
      menuItemActiveClasses,
      "py-2 pl-8 pr-2.5 text-muted-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <Check size={13} className="text-foreground" />
      </DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.RadioItem
    ref={ref}
    className={cn(
      menuItemClasses,
      menuItemActiveClasses,
      "py-2 pl-8 pr-2.5 text-muted-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <Circle size={8} className="fill-foreground text-foreground" />
      </DropdownMenu.ItemIndicator>
    </span>
    {children}
  </DropdownMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenu.Label
    ref={ref}
    className={cn("px-2.5 py-1 label text-muted-foreground", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenu.Separator
    ref={ref}
    className={cn("mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenu.SubTrigger
    ref={ref}
    className={cn(
      menuItemClasses,
      menuItemActiveClasses,
      "text-muted-foreground data-[state=open]:bg-muted",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight size={14} className="ml-auto text-muted-foreground" />
  </DropdownMenu.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <DropdownMenu.SubContent
      ref={ref}
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
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto caption text-muted-foreground", className)} {...props} />;
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
