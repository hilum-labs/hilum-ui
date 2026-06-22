"use client";

import * as React from "react";
import { Switch } from "radix-ui";
import { cn } from "../lib/utils";

const SwitchRoot = React.forwardRef<
  React.ComponentRef<typeof Switch.Root>,
  React.ComponentPropsWithoutRef<typeof Switch.Root>
>(({ className, ...props }, ref) => (
  <Switch.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
      "border-2 border-transparent transition-[background-color,border-color,box-shadow] duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=unchecked]:bg-muted data-[state=checked]:bg-brand-primary",
      className,
    )}
    {...props}
  >
    <Switch.Thumb
      className={cn(
        "pointer-events-none block size-5 rounded-full bg-card shadow-natural",
        "transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5",
      )}
    />
  </Switch.Root>
));
SwitchRoot.displayName = "Switch";

export { SwitchRoot as Switch };
