"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useShape } from "../lib/shape-context";

// ---------------------------------------------------------------------------
// Portal container context
// ---------------------------------------------------------------------------

const TooltipPortalContainerContext = createContext<HTMLElement | null>(null);

function TooltipPortalContainer({
  value,
  children,
}: {
  value: HTMLElement | null;
  children: ReactNode;
}) {
  return (
    <TooltipPortalContainerContext.Provider value={value}>
      {children}
    </TooltipPortalContainerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TooltipSide = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content?: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  delayDuration?: number;
  className?: string;
  open?: boolean | undefined;
  /** When true, forces the tooltip open. When false, forces it closed. When undefined, uses default hover/focus behavior. */
  forceOpen?: boolean | undefined;
  /** Called when the tooltip's internal open state changes (before forceOpen is applied). */
  onOpenChange?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function getSlideOffset(side: TooltipSide) {
  switch (side) {
    case "top":
      return { y: 4 };
    case "bottom":
      return { y: -4 };
    case "left":
      return { x: 4 };
    case "right":
      return { x: -4 };
  }
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

function Tooltip({
  content,
  children,
  side = "top",
  sideOffset = 8,
  delayDuration = 200,
  className,
  open: openProp,
  forceOpen,
  onOpenChange: onOpenChangeProp,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  if (content === undefined) {
    return (
      <TooltipPrimitive.Root
        {...(openProp !== undefined ? { open: openProp } : {})}
        {...(onOpenChangeProp ? { onOpenChange: onOpenChangeProp } : {})}
      >
        {children}
      </TooltipPrimitive.Root>
    );
  }
  const open = forceOpen ?? openProp ?? internalOpen;
  const [mounted, setMounted] = useState(false);
  const shape = useShape();
  const portalContainer = useContext(TooltipPortalContainerContext);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const handleExitComplete = () => {
    if (!open) setMounted(false);
  };

  const slideOffset = getSlideOffset(side);

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={(v) => {
          setInternalOpen(v);
          onOpenChangeProp?.(v);
        }}
      >
        <TooltipPrimitive.Trigger asChild>
          {children as React.ReactElement}
        </TooltipPrimitive.Trigger>
        {mounted && (
          <TooltipPrimitive.Portal forceMount container={portalContainer ?? undefined}>
            <TooltipPrimitive.Content
              side={side}
              sideOffset={sideOffset}
              forceMount
              className="z-50"
            >
              <motion.div
                className={cn(
                  "bg-foreground text-background text-[12px] px-2 py-1",
                  shape.bg,
                  className,
                )}
                style={{ fontVariationSettings: fontWeights.medium }}
                initial={{ opacity: 0, ...slideOffset }}
                animate={{
                  opacity: open ? 1 : 0,
                  x: 0,
                  y: 0,
                }}
                transition={open ? spring.fast : spring.fast.exit}
                onAnimationComplete={handleExitComplete}
              >
                {content}
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = TooltipPrimitive.Content;

export {
  Tooltip,
  TooltipPortalContainer,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
};
export type { TooltipProps, TooltipSide };
