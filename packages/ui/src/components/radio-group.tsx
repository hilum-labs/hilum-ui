"use client";

import * as React from "react";
import { RadioGroup } from "radix-ui";
import { cn } from "../lib/utils";

const RadioGroupRoot = React.forwardRef<
  React.ComponentRef<typeof RadioGroup.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Root>
>(({ className, ...props }, ref) => (
  <RadioGroup.Root
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroupRoot.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroup.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
>(({ className, ...props }, ref) => (
  <RadioGroup.Item
    ref={ref}
    className={cn(
      "aspect-square size-4 rounded-full border border-taupe-300 text-taupe-900",
      "shadow-none transition-colors",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe-900/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-taupe-900 data-[state=checked]:border-taupe-900",
      className
    )}
    {...props}
  >
    <RadioGroup.Indicator className="flex items-center justify-center">
      <div className="size-2 rounded-full bg-white" />
    </RadioGroup.Indicator>
  </RadioGroup.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupRoot as RadioGroup, RadioGroupItem };
