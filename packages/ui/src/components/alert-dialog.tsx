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

function AlertDialogOverlay({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AlertDialog.Overlay>) {
  return (
    <AlertDialog.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:duration-100 data-[state=open]:duration-150",
        className,
      )}
      {...props}
    />
  );
}
AlertDialogOverlay.displayName = "AlertDialogOverlay";

function AlertDialogContent({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialog.Content>) {
  return (
    <AlertDialog.Portal>
      <style>{mobileDialogSheetStyle}</style>
      <AlertDialogOverlay />
      <AlertDialog.Content
        ref={ref}
        data-slot="alert-dialog-content"
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
  );
}
AlertDialogContent.displayName = "AlertDialogContent";

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1.5 mb-5", className)}
      {...props}
    />
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
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

function AlertDialogTitle({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AlertDialog.Title>) {
  return (
    <AlertDialog.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn("body-lg font-semibold text-balance text-foreground", className)}
      {...props}
    />
  );
}
AlertDialogTitle.displayName = "AlertDialogTitle";

function AlertDialogDescription({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AlertDialog.Description>) {
  return (
    <AlertDialog.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("body text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}
AlertDialogDescription.displayName = "AlertDialogDescription";

// With `asChild` the child (usually a `<Button>`) owns its look: merging the
// action's own fill into it would override the child's variant.
function AlertDialogAction({
  ref,
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof AlertDialog.Action>) {
  if (asChild) {
    return (
      <AlertDialog.Action
        ref={ref}
        data-slot="alert-dialog-action"
        asChild
        className={className}
        {...props}
      />
    );
  }
  return (
    <AlertDialog.Action
      ref={ref}
      data-slot="alert-dialog-action"
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
  );
}
AlertDialogAction.displayName = "AlertDialogAction";

function AlertDialogCancel({
  ref,
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof AlertDialog.Cancel>) {
  if (asChild) {
    return (
      <AlertDialog.Cancel
        ref={ref}
        data-slot="alert-dialog-cancel"
        asChild
        className={className}
        {...props}
      />
    );
  }
  return (
    <AlertDialog.Cancel
      ref={ref}
      data-slot="alert-dialog-cancel"
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
  );
}
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
   * pending state and the dialog stays open until it resolves. A rejection
   * (or a synchronous throw) keeps the dialog open, re-enables the buttons,
   * calls `onError` and renders `error` inside the dialog.
   */
  onConfirm: () => void | Promise<unknown>;
  /** Called with the rejection reason when `onConfirm` fails. */
  onError?: (error: unknown) => void;
  /**
   * Inline error shown (as `role="alert"`) after a failed confirm. A function
   * receives the rejection reason. Default: the error's `message`, if any.
   * Pass `false` to render nothing (e.g. when `onError` shows a toast).
   */
  error?: React.ReactNode | ((error: unknown) => React.ReactNode) | false;
  /** Extra content between the description and the footer. */
  children?: React.ReactNode;
  className?: string;
}

function defaultErrorMessage(error: unknown): React.ReactNode {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "Something went wrong. Try again.";
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
  onError,
  error: errorProp,
  children,
  className,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [failure, setFailure] = React.useState<{ error: unknown } | null>(null);
  const errorId = React.useId();
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (pending && !next) return;
    if (!next) setFailure(null);
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const fail = (error: unknown) => {
    setPending(false);
    setFailure({ error });
    onError?.(error);
  };

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault();
    setFailure(null);
    let result: void | Promise<unknown>;
    try {
      result = onConfirm();
    } catch (error) {
      fail(error);
      return;
    }
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setPending(true);
      try {
        await result;
      } catch (error) {
        fail(error);
        return;
      }
      setPending(false);
      if (openProp === undefined) setUncontrolledOpen(false);
      onOpenChange?.(false);
      return;
    }
    setOpen(false);
  };

  const errorContent =
    failure && errorProp !== false
      ? typeof errorProp === "function"
        ? errorProp(failure.error)
        : (errorProp ?? defaultErrorMessage(failure.error))
      : null;

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children}
        {errorContent && (
          <p
            id={errorId}
            role="alert"
            data-slot="confirm-dialog-error"
            className="body-sm mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive"
          >
            {errorContent}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            aria-busy={pending || undefined}
            {...(errorContent ? { "aria-describedby": errorId } : {})}
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
