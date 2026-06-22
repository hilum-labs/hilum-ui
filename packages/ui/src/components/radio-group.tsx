"use client";

import * as React from "react";
import { RadioGroup } from "radix-ui";
import { cn } from "../lib/utils";

const RadioGroupRoot = React.forwardRef<
  React.ComponentRef<typeof RadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Root>
>(({ className, ...props }, ref) => (
  <RadioGroup.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
));
RadioGroupRoot.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
>(({ className, ...props }, ref) => (
  <RadioGroup.Item
    ref={ref}
    className={cn(
      "relative aspect-square size-4 rounded-full border border-border text-foreground",
      "after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2",
      "shadow-none transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-foreground data-[state=checked]:border-foreground",
      className,
    )}
    {...props}
  >
    <RadioGroup.Indicator className="flex items-center justify-center">
      <div className="size-2 rounded-full bg-card" />
    </RadioGroup.Indicator>
  </RadioGroup.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupRoot as RadioGroup, RadioGroupItem };
