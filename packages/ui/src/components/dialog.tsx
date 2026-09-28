"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { motion } from "../lib/motion";
import { cn } from "../lib/utils";
import { useIcon } from "../lib/icon-context";
import { spring } from "../lib/springs";
import { useShape } from "../lib/shape-context";
import { SurfaceProvider, useSurface } from "../lib/surface-context";
import { surfaceClasses } from "../lib/surface-classes";
import {
  desktopDialogContentClassName,
  dialogSheetMotionClassName,
  mobileDialogSheetStyle,
  mobileDialogSheetContentClassName,
} from "../lib/mobile-popper-sheet";
import { Button } from "./button";

const DIALOG_OFFSET = 4;

const DialogOpenContext = createContext(false);

function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  ...props
}: DialogPrimitive.DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const handleOpenChange = onOpenChange ?? setUncontrolledOpen;

  return (
    <DialogOpenContext.Provider value={open}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DialogOpenContext.Provider>
  );
}

const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  size?: "sm" | "lg";
  /** Portal target. When set, the overlay and panel render inside this element
   *  (positioned `absolute`) instead of covering the viewport (`fixed`). Pair
   *  with a `position: relative; overflow: hidden` container — and usually
   *  `<Dialog modal={false}>` — to scope a dialog to a bounded region, e.g. a
   *  docs preview. Defaults to the document body / full-viewport behaviour. */
  container?: HTMLElement | null;
  /** Screen-reader label of the close button. Default: "Close". */
  closeLabel?: string;
}

function DialogContent({
  ref,
  className,
  children,
  size = "sm",
  container,
  closeLabel = "Close",
  ...props
}: DialogContentProps) {
  const XIcon = useIcon("x");
  const open = useContext(DialogOpenContext);
  const shape = useShape();
  const substrate = useSurface();
  const dialogLevel = Math.min(substrate + DIALOG_OFFSET, 8);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const handleExitComplete = () => {
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  const sizeClassName =
    size === "sm" ? (container ? "max-w-100" : "max-w-100") : container ? "max-w-135" : "max-w-135";

  return (
    <DialogPrimitive.Portal forceMount container={container ?? undefined}>
      {!container && <style>{mobileDialogSheetStyle}</style>}
      <DialogPrimitive.Overlay asChild forceMount>
        <motion.div
          className={cn(
            container ? "absolute" : "fixed",
            "inset-0 z-50 bg-black/40 dark:bg-black/80",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={open ? spring.slow : spring.slow.exit}
        />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content ref={ref} data-slot="dialog-content" asChild forceMount {...props}>
        <motion.div
          data-hilum-dialog-sheet={container ? undefined : "true"}
          className={cn(
            container
              ? "absolute left-1/2 top-1/2 z-50 w-[calc(100%-2rem)]"
              : [
                  mobileDialogSheetContentClassName,
                  desktopDialogContentClassName,
                  dialogSheetMotionClassName,
                ],
            surfaceClasses(dialogLevel),
            "p-6 focus:outline-none",
            sizeClassName,
            shape.container,
            "rounded-t-2xl",
            className,
          )}
          initial={container ? { opacity: 0, scale: 0.97, x: "-50%", y: "-50%" } : { opacity: 0 }}
          animate={
            container
              ? {
                  opacity: open ? 1 : 0,
                  scale: open ? 1 : 0.97,
                  x: "-50%",
                  y: "-50%",
                }
              : { opacity: open ? 1 : 0 }
          }
          transition={open ? spring.slow : spring.slow.exit}
          onAnimationComplete={handleExitComplete}
        >
          <SurfaceProvider value={dialogLevel}>
            {children}
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon-sm" className="absolute end-3 top-3">
                {createElement(XIcon)}
                <span className="sr-only">{closeLabel}</span>
              </Button>
            </DialogPrimitive.Close>
          </SurfaceProvider>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 mb-4", className)}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-6 flex justify-end gap-2",
        "max-sm:flex-col-reverse max-sm:[&>*]:w-full",
        className,
      )}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

function DialogTitle({ ref, className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-base text-foreground leading-tight", className)}
      style={{ fontVariationSettings: "'wght' 700" }}
      {...props}
    />
  );
}
DialogTitle.displayName = "DialogTitle";

function DialogDescription({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn("text-[13px] text-muted-foreground", className)}
      {...props}
    />
  );
}
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
