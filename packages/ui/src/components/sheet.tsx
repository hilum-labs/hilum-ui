"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { focusRingClasses, motionClasses, pressClasses } from "../lib/interaction";

const SheetRoot = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:duration-100 data-[state=open]:duration-150",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetContentVariants = cva(
  [
    "fixed z-50 border-border bg-card p-6 shadow-elevated",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "transition-transform ease-in-out duration-300",
  ],
  {
    variants: {
      side: {
        right:
          "right-0 top-0 h-full w-full max-w-sm border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left: "left-0 top-0 h-full w-full max-w-sm border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        top: "top-0 inset-x-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "bottom-0 inset-x-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof sheetContentVariants> {}

const SheetContent = React.forwardRef<React.ComponentRef<typeof Dialog.Content>, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => (
    <Dialog.Portal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        <Dialog.Close
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-md text-muted-foreground opacity-70 hover:bg-muted hover:text-foreground hover:opacity-100",
            motionClasses,
            pressClasses,
            focusRingClasses,
          )}
        >
          <X size={16} />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  ),
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 mb-4", className)} {...props} />;
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-end gap-2 mt-6", className)} {...props} />;
}
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("body-lg font-semibold text-balance text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("body text-pretty text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  SheetRoot as Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
