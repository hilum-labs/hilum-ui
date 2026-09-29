"use client";

import * as React from "react";
import { Menubar } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import { useDensityAttributes } from "../lib/density-context";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

function MenubarRoot({ className, ...props }: React.ComponentProps<typeof Menubar.Root>) {
  return (
    <Menubar.Root
      data-slot="menubar"
      className={cn(
        "flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card px-1",
        className,
      )}
      {...props}
    />
  );
}
MenubarRoot.displayName = "Menubar";

const MenubarMenu = Menubar.Menu;

function MenubarGroup(props: React.ComponentProps<typeof Menubar.Group>) {
  return <Menubar.Group data-slot="menubar-group" {...props} />;
}
MenubarGroup.displayName = "MenubarGroup";

const MenubarSub = Menubar.Sub;

function MenubarRadioGroup(props: React.ComponentProps<typeof Menubar.RadioGroup>) {
  return <Menubar.RadioGroup data-slot="menubar-radio-group" {...props} />;
}
MenubarRadioGroup.displayName = "MenubarRadioGroup";

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof Menubar.Trigger>) {
  return (
    <Menubar.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex min-h-8 cursor-default items-center rounded-md px-3 py-1 body font-medium text-muted-foreground select-none outline-none",
        "hover:bg-muted",
        "data-[state=open]:bg-active data-[state=open]:text-foreground",
        "focus:bg-active",
        className,
      )}
      {...props}
    />
  );
}
MenubarTrigger.displayName = "MenubarTrigger";

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof Menubar.Content>) {
  const densityAttributes = useDensityAttributes();
  return (
    <>
      <style>{mobilePopperSheetStyle}</style>
      <Menubar.Portal>
        <Menubar.Content
          {...densityAttributes}
          data-slot="menubar-content"
          data-hilum-mobile-sheet="true"
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[12rem] bg-card rounded-xl shadow-natural p-1",
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
      </Menubar.Portal>
    </>
  );
}
MenubarContent.displayName = "MenubarContent";

function MenubarItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Menubar.Item> & {
  inset?: boolean;
}) {
  return (
    <Menubar.Item
      data-slot="menubar-item"
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 compact:min-h-7 compact:px-2 compact:py-1 compact:text-[13px] compact:rounded-[4px]",
        "body text-foreground outline-none transition-colors",
        "focus:bg-active focus:text-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "ps-8 compact:ps-7",
        className,
      )}
      {...props}
    />
  );
}
MenubarItem.displayName = "MenubarItem";

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menubar.CheckboxItem>) {
  return (
    <Menubar.CheckboxItem
      data-slot="menubar-checkbox-item"
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
        <Menubar.ItemIndicator>
          <Check size={13} className="text-foreground" />
        </Menubar.ItemIndicator>
      </span>
      {children}
    </Menubar.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menubar.RadioItem>) {
  return (
    <Menubar.RadioItem
      data-slot="menubar-radio-item"
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
        <Menubar.ItemIndicator>
          <Circle size={8} className="fill-foreground text-foreground" />
        </Menubar.ItemIndicator>
      </span>
      {children}
    </Menubar.RadioItem>
  );
}
MenubarRadioItem.displayName = "MenubarRadioItem";

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Menubar.Label> & {
  inset?: boolean;
}) {
  return (
    <Menubar.Label
      data-slot="menubar-label"
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
MenubarLabel.displayName = "MenubarLabel";

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof Menubar.Separator>) {
  return (
    <Menubar.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
MenubarSeparator.displayName = "MenubarSeparator";

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof Menubar.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <Menubar.SubTrigger
      data-slot="menubar-sub-trigger"
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
    </Menubar.SubTrigger>
  );
}
MenubarSubTrigger.displayName = "MenubarSubTrigger";

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof Menubar.SubContent>) {
  const densityAttributes = useDensityAttributes();
  return (
    <>
      <style>{mobilePopperSheetStyle}</style>
      <Menubar.SubContent
        {...densityAttributes}
        data-slot="menubar-sub-content"
        data-hilum-mobile-sheet="true"
        className={cn(
          "z-50 min-w-[8rem] bg-card rounded-xl border border-border shadow-natural p-1",
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
MenubarSubContent.displayName = "MenubarSubContent";

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("ms-auto caption text-muted-foreground", className)}
      {...props}
    />
  );
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
