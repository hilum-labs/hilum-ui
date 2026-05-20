"use client";

import * as React from "react";
import { AlertDialog } from "radix-ui";
import { cn } from "../lib/utils";

const AlertDialogRoot = AlertDialog.Root;
const AlertDialogTrigger = AlertDialog.Trigger;
const AlertDialogPortal = AlertDialog.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Content>
>(({ className, children, ...props }, ref) => (
  <AlertDialog.Portal>
    <AlertDialogOverlay />
    <AlertDialog.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        "w-full max-w-md bg-white rounded-2xl shadow-elevated p-6",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}
    </AlertDialog.Content>
  </AlertDialog.Portal>
));
AlertDialogContent.displayName = "AlertDialogContent";

function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 mb-5", className)} {...props} />;
}
AlertDialogHeader.displayName = "AlertDialogHeader";

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-end gap-2 mt-6", className)} {...props} />;
}
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Title>
>(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("body-lg font-semibold text-ground-900", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Description>
>(({ className, ...props }, ref) => (
  <AlertDialog.Description ref={ref} className={cn("body text-ground-500", className)} {...props} />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Action>
>(({ className, ...props }, ref) => (
  <AlertDialog.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md px-4",
      "body font-medium whitespace-nowrap transition-all duration-150",
      "bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80",
      "focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1 outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialog.Cancel
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md px-4",
      "body font-medium whitespace-nowrap transition-all duration-150",
      "bg-white text-ground-700 shadow-natural hover:bg-ground-50 rounded-xl",
      "focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1 outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
