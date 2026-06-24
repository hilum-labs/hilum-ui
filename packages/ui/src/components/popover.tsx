"use client";

import * as React from "react";
import { Popover } from "radix-ui";
import { cn } from "../lib/utils";
import { mobilePopperSheetStyle } from "../lib/mobile-popper-sheet";

const PopoverRoot = Popover.Root;
const PopoverTrigger = Popover.Trigger;
const PopoverClose = Popover.Close;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, align = "center", sideOffset = 6, ...props }, ref) => (
  <>
    <style>{mobilePopperSheetStyle}</style>
    <Popover.Portal>
      <Popover.Content
        ref={ref}
        data-hilum-mobile-sheet="true"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 w-72 rounded-xl bg-card p-4 shadow-natural outline-none",
          "max-sm:max-h-[min(70dvh,28rem)] max-sm:overflow-y-auto max-sm:rounded-2xl max-sm:border max-sm:border-border max-sm:px-4 max-sm:pb-4 max-sm:pt-6 max-sm:shadow-elevated",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </Popover.Portal>
  </>
));
PopoverContent.displayName = "PopoverContent";

export { PopoverRoot as Popover, PopoverTrigger, PopoverContent, PopoverClose };
