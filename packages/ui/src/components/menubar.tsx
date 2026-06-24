"use client";

import * as React from "react";
import { Menubar } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

const MenubarRoot = React.forwardRef<
  React.ComponentRef<typeof Menubar.Root>,
  React.ComponentPropsWithoutRef<typeof Menubar.Root>
>(({ className, ...props }, ref) => (
  <Menubar.Root
    ref={ref}
    className={cn(
      "flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card px-1",
      className,
    )}
    {...props}
  />
));
MenubarRoot.displayName = "Menubar";

const MenubarMenu = Menubar.Menu;

const MenubarGroup = Menubar.Group;

const MenubarSub = Menubar.Sub;

const MenubarRadioGroup = Menubar.RadioGroup;

const MenubarTrigger = React.forwardRef<
  React.ComponentRef<typeof Menubar.Trigger>,
  React.ComponentPropsWithoutRef<typeof Menubar.Trigger>
>(({ className, ...props }, ref) => (
  <Menubar.Trigger
    ref={ref}
    className={cn(
      "flex min-h-8 cursor-default items-center rounded-md px-3 py-1 body font-medium text-muted-foreground select-none outline-none",
      "hover:bg-muted",
      "data-[state=open]:bg-muted data-[state=open]:text-foreground",
      "focus:bg-muted",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarContent = React.forwardRef<
  React.ComponentRef<typeof Menubar.Content>,
  React.ComponentPropsWithoutRef<typeof Menubar.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <Menubar.Portal>
      <Menubar.Content
        ref={ref}
        data-hilum-mobile-sheet="true"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] bg-card rounded-xl shadow-natural p-1",
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
    </Menubar.Portal>
  </>
));
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef<
  React.ComponentRef<typeof Menubar.Item>,
  React.ComponentPropsWithoutRef<typeof Menubar.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menubar.Item
    ref={ref}
    className={cn(
      "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2",
      "body text-muted-foreground outline-none transition-colors",
      "focus:bg-muted focus:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof Menubar.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Menubar.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <Menubar.CheckboxItem
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
      <Menubar.ItemIndicator>
        <Check size={13} className="text-foreground" />
      </Menubar.ItemIndicator>
    </span>
    {children}
  </Menubar.CheckboxItem>
));
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioItem = React.forwardRef<
  React.ComponentRef<typeof Menubar.RadioItem>,
  React.ComponentPropsWithoutRef<typeof Menubar.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Menubar.RadioItem
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
      <Menubar.ItemIndicator>
        <Circle size={8} className="fill-foreground text-foreground" />
      </Menubar.ItemIndicator>
    </span>
    {children}
  </Menubar.RadioItem>
));
MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarLabel = React.forwardRef<
  React.ComponentRef<typeof Menubar.Label>,
  React.ComponentPropsWithoutRef<typeof Menubar.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menubar.Label
    ref={ref}
    className={cn("px-2.5 py-1 label text-muted-foreground", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = "MenubarLabel";

const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof Menubar.Separator>,
  React.ComponentPropsWithoutRef<typeof Menubar.Separator>
>(({ className, ...props }, ref) => (
  <Menubar.Separator ref={ref} className={cn("mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = "MenubarSeparator";

const MenubarSubTrigger = React.forwardRef<
  React.ComponentRef<typeof Menubar.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof Menubar.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <Menubar.SubTrigger
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
  </Menubar.SubTrigger>
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof Menubar.SubContent>,
  React.ComponentPropsWithoutRef<typeof Menubar.SubContent>
>(({ className, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <Menubar.SubContent
      ref={ref}
      data-hilum-mobile-sheet="true"
      className={cn(
        "z-50 min-w-[8rem] bg-card rounded-xl border border-border shadow-natural p-1",
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
MenubarSubContent.displayName = "MenubarSubContent";

function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto caption text-muted-foreground", className)} {...props} />;
}
MenubarShortcut.displayName = "MenubarShortcut";

export {
  MenubarRoot as Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarShortcut,
  MenubarGroup,
};
