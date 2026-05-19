"use client";

import * as React from "react";
import { Menubar } from "radix-ui";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";

const MenubarRoot = React.forwardRef<
  React.ComponentRef<typeof Menubar.Root>,
  React.ComponentPropsWithoutRef<typeof Menubar.Root>
>(({ className, ...props }, ref) => (
  <Menubar.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center gap-0.5 rounded-lg border border-taupe-100 bg-white px-1",
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
      "flex cursor-default items-center rounded-md px-3 py-1 body font-medium text-taupe-700 select-none outline-none",
      "hover:bg-taupe-50",
      "data-[state=open]:bg-taupe-100 data-[state=open]:text-taupe-900",
      "focus:bg-taupe-50",
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
  <Menubar.Portal>
    <Menubar.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] bg-white rounded-xl shadow-natural p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        className,
      )}
      {...props}
    />
  </Menubar.Portal>
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
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900",
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
      "relative flex cursor-default select-none items-center gap-2 rounded-md pl-8 pr-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <Menubar.ItemIndicator>
        <Check size={13} className="text-taupe-900" />
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
      "relative flex cursor-default select-none items-center gap-2 rounded-md pl-8 pr-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <Menubar.ItemIndicator>
        <Circle size={8} className="fill-taupe-900 text-taupe-900" />
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
    className={cn("px-2.5 py-1 label text-taupe-400", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = "MenubarLabel";

const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof Menubar.Separator>,
  React.ComponentPropsWithoutRef<typeof Menubar.Separator>
>(({ className, ...props }, ref) => (
  <Menubar.Separator
    ref={ref}
    className={cn("mx-1 my-1 h-px bg-taupe-100", className)}
    {...props}
  />
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
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5",
      "body text-taupe-700 outline-none transition-colors",
      "focus:bg-taupe-50 focus:text-taupe-900 data-[state=open]:bg-taupe-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight size={14} className="ml-auto text-taupe-400" />
  </Menubar.SubTrigger>
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof Menubar.SubContent>,
  React.ComponentPropsWithoutRef<typeof Menubar.SubContent>
>(({ className, ...props }, ref) => (
  <Menubar.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] bg-white rounded-xl border border-taupe-100 shadow-natural p-1",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = "MenubarSubContent";

function MenubarShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto caption text-taupe-400", className)} {...props} />;
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
