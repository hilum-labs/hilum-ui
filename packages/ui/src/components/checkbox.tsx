"use client";

import * as React from "react";
import { Checkbox } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { focusRingClasses, motionClasses, pressClasses } from "../lib/interaction";

const CheckboxRoot = React.forwardRef<
  React.ComponentRef<typeof Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof Checkbox.Root>
>(({ className, ...props }, ref) => (
  <Checkbox.Root
    ref={ref}
    className={cn(
      "peer relative size-4 shrink-0 rounded border border-border bg-card",
      motionClasses,
      pressClasses,
      "after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2",
      focusRingClasses,
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary",
      "data-[state=indeterminate]:bg-brand-primary data-[state=indeterminate]:border-brand-primary",
      className,
    )}
    {...props}
  >
    <Checkbox.Indicator className="flex items-center justify-center text-background data-[state=checked]:animate-in data-[state=checked]:zoom-in-75">
      {props.checked === "indeterminate" ? (
        <Minus size={11} strokeWidth={3} />
      ) : (
        <Check size={11} strokeWidth={3} />
      )}
    </Checkbox.Indicator>
  </Checkbox.Root>
));
CheckboxRoot.displayName = "Checkbox";

export { CheckboxRoot as Checkbox };
