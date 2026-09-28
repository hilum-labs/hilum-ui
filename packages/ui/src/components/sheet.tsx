"use client";

import * as React from "react";
import { Dialog, Direction } from "radix-ui";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { focusRingClasses, motionClasses, pressClasses } from "../lib/interaction";

const SheetRoot = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
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

type SheetPhysicalSide = NonNullable<VariantProps<typeof sheetContentVariants>["side"]>;
/**
 * Edge the sheet slides in from. `"left"`/`"right"` are physical; `"start"`/`"end"`
 * are logical and flip in right-to-left layouts (resolved from `dir`, then a Radix
 * `DirectionProvider`, then `<html dir>`).
 */
type SheetSide = SheetPhysicalSide | "start" | "end";

interface SheetContentProps
  extends
    React.ComponentProps<typeof Dialog.Content>,
    Omit<VariantProps<typeof sheetContentVariants>, "side"> {
  side?: SheetSide | null;
  /** Reading direction (`"ltr"` / `"rtl"`); also used to resolve `side="start" | "end"`. */
  dir?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
}

const subscribeToDocumentDir = (onChange: () => void) => {
  if (typeof MutationObserver === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
  return () => observer.disconnect();
};
const getDocumentDir = () => (document.documentElement.dir === "rtl" ? "rtl" : "ltr");
const getServerDocumentDir = () => "ltr" as const;

function useResolvedSheetSide(side: SheetSide, dir: string | undefined): SheetPhysicalSide {
  // Radix returns "ltr" when there is no DirectionProvider, so an "rtl" from it is explicit.
  const contextDir = Direction.useDirection();
  const documentDir = React.useSyncExternalStore(
    subscribeToDocumentDir,
    getDocumentDir,
    getServerDocumentDir,
  );
  if (side !== "start" && side !== "end") return side;
  const resolvedDir =
    dir === "ltr" || dir === "rtl" ? dir : contextDir === "rtl" ? "rtl" : documentDir;
  const isRtl = resolvedDir === "rtl";
  if (side === "start") return isRtl ? "right" : "left";
  return isRtl ? "left" : "right";
}

function SheetContent({
  className,
  children,
  side = "right",
  dir,
  closeLabel = "Close",
  ...props
}: SheetContentProps) {
  const resolvedSide = useResolvedSheetSide(side ?? "right", dir);
  return (
    <Dialog.Portal>
      <SheetOverlay />
      <Dialog.Content
        data-slot="sheet-content"
        data-side={resolvedSide}
        dir={dir}
        className={cn(sheetContentVariants({ side: resolvedSide }), className)}
        {...props}
      >
        {children}
        <Dialog.Close
          className={cn(
            "absolute end-3 top-3 flex size-9 items-center justify-center rounded-md text-muted-foreground opacity-70 hover:bg-muted hover:text-foreground hover:opacity-100",
            motionClasses,
            pressClasses,
            focusRingClasses,
          )}
        >
          <X size={16} />
          <span className="sr-only">{closeLabel}</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 mb-4", className)}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex items-center justify-end gap-2 mt-6", className)}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn("body-lg font-semibold text-balance text-foreground", className)}
      {...props}
    />
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn("body text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}
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
export type { SheetContentProps, SheetSide };
