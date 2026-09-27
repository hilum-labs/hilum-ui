"use client";

import * as React from "react";
import { AlertDialog } from "radix-ui";
import { cn } from "../lib/utils";
import { focusRingClasses, motionClasses, pressClasses } from "../lib/interaction";
import {
  desktopDialogContentClassName,
  dialogSheetMotionClassName,
  mobileDialogSheetStyle,
  mobileDialogSheetContentClassName,
} from "../lib/mobile-popper-sheet";

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
      "data-[state=closed]:duration-100 data-[state=open]:duration-150",
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
    <style>{mobileDialogSheetStyle}</style>
    <AlertDialogOverlay />
    <AlertDialog.Content
      ref={ref}
      data-hilum-dialog-sheet="true"
      className={cn(
        mobileDialogSheetContentClassName,
        desktopDialogContentClassName,
        "border border-border shadow-elevated max-w-md",
        dialogSheetMotionClassName,
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
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
        "[&>*]:w-full sm:[&>*]:w-auto",
        className,
      )}
      {...props}
    />
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Title>
>(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("body-lg font-semibold text-balance text-foreground", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Description>
>(({ className, ...props }, ref) => (
  <AlertDialog.Description
    ref={ref}
    className={cn("body text-pretty text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialog.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Action>
>(({ className, ...props }, ref) => (
  <AlertDialog.Action
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md px-4",
      "body font-medium whitespace-nowrap",
      motionClasses,
      pressClasses,
      "bg-brand-primary text-background hover:bg-brand-primary/90 active:bg-brand-primary/80",
      focusRingClasses,
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
      "inline-flex h-10 items-center justify-center rounded-md px-4",
      "body font-medium whitespace-nowrap",
      motionClasses,
      pressClasses,
      "bg-card text-muted-foreground shadow-natural hover:bg-muted rounded-xl",
      focusRingClasses,
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

/* ─────────────────────── ConfirmDialog ─────────────────────── */

interface ConfirmDialogProps {
  /** Element that opens the dialog (e.g. a "Delete" Button). Optional when controlled. */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** Red confirm button for irreversible actions (delete, cancel order). */
  destructive?: boolean;
  /**
   * Runs on confirm. If it returns a promise the confirm button shows a
   * pending state and the dialog stays open until it resolves; a rejection
   * keeps the dialog open so the caller can surface the error (e.g. toast).
   */
  onConfirm: () => void | Promise<unknown>;
  /** Extra content between the description and the footer. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * One-call confirmation dialog — replaces hand-built "Delete X" dialogs.
 *
 *   <ConfirmDialog
 *     trigger={<Button variant="destructive">Delete</Button>}
 *     title="Delete product?"
 *     description="This can't be undone."
 *     confirmLabel="Delete product"
 *     destructive
 *     onConfirm={() => deleteProduct(id)}
 *   />
 */
function ConfirmDialog({
  trigger,
  open: openProp,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  children,
  className,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (pending && !next) return;
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    const result = onConfirm();
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setPending(true);
      try {
        await result;
        setPending(false);
        if (openProp === undefined) setUncontrolledOpen(false);
        onOpenChange?.(false);
      } catch {
        setPending(false);
      }
      return;
    }
    setOpen(false);
  };

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            aria-busy={pending || undefined}
            className={cn(
              destructive &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
ConfirmDialog.displayName = "ConfirmDialog";

export {
  ConfirmDialog,
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
export type { ConfirmDialogProps };
