"use client";

import * as React from "react";
import { Tooltip } from "radix-ui";
import { cn } from "../lib/utils";

function TooltipProvider({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Tooltip.Provider>) {
  return (
    <Tooltip.Provider delayDuration={300} {...props}>
      {children}
    </Tooltip.Provider>
  );
}

const TooltipRoot = Tooltip.Root;
const TooltipTrigger = Tooltip.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof Tooltip.Content>,
  React.ComponentPropsWithoutRef<typeof Tooltip.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Tooltip.Portal>
    <Tooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-lg bg-ground-900 px-2.5 py-1.5 caption text-white",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
        "data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
        className,
      )}
      {...props}
    />
  </Tooltip.Portal>
));
TooltipContent.displayName = "TooltipContent";

export { TooltipProvider, TooltipRoot as Tooltip, TooltipTrigger, TooltipContent };
