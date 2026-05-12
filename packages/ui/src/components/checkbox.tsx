"use client";

import * as React from "react";
import { Checkbox } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/utils";

const CheckboxRoot = React.forwardRef<
  React.ComponentRef<typeof Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof Checkbox.Root>
>(({ className, ...props }, ref) => (
  <Checkbox.Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded border border-taupe-300 bg-white transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary",
      "data-[state=indeterminate]:bg-brand-primary data-[state=indeterminate]:border-brand-primary",
      className,
    )}
    {...props}
  >
    <Checkbox.Indicator className="flex items-center justify-center text-white">
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
