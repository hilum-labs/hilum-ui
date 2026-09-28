"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { cn } from "../lib/utils";
import { useDensityAttributes } from "../lib/density-context";
import { motionClasses } from "../lib/interaction";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";

const PopoverRoot = Popover.Root;

function PopoverTrigger(props: React.ComponentProps<typeof Popover.Trigger>) {
  return <Popover.Trigger data-slot="popover-trigger" {...props} />;
}
PopoverTrigger.displayName = "PopoverTrigger";

function PopoverClose(props: React.ComponentProps<typeof Popover.Close>) {
  return <Popover.Close data-slot="popover-close" {...props} />;
}
PopoverClose.displayName = "PopoverClose";

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof Popover.Content>) {
  const densityAttributes = useDensityAttributes();
  return (
    <>
      <style>{mobilePopperSheetStyle}</style>
      <Popover.Portal>
        <Popover.Content
          {...densityAttributes}
          data-slot="popover-content"
          data-hilum-mobile-sheet="true"
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "relative z-50 w-72 rounded-xl border border-border bg-card p-4 shadow-elevated outline-none",
            motionClasses,
            mobilePopperSheetPositionClassName,
            mobilePopperSheetSurfaceClassName,
            "max-md:overflow-y-auto max-md:px-4 max-md:pb-4 max-md:pt-6",
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
      </Popover.Portal>
    </>
  );
}
PopoverContent.displayName = "PopoverContent";

export { PopoverRoot as Popover, PopoverTrigger, PopoverContent, PopoverClose };
