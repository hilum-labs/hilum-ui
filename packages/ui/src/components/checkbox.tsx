"use client";

import * as React from "react";
import { Checkbox } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { focusRingClasses, motionClasses, pressClasses } from "../lib/interaction";
import { useFieldControl } from "../lib/field-context";

function CheckboxRoot({
  className,
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<typeof Checkbox.Root>) {
  // Inside a <Field>, the checkbox takes the field's label, hint / error,
  // invalid, required and disabled state (explicit props win).
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  });
  return (
    <Checkbox.Root
      data-slot="checkbox"
      {...fieldProps}
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      className={cn(
        "peer relative size-4 shrink-0 rounded border border-border bg-card",
        motionClasses,
        pressClasses,
        "after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2",
        focusRingClasses,
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary",
        "data-[state=indeterminate]:bg-brand-primary data-[state=indeterminate]:border-brand-primary",
        // Error state: destructive border (unchecked) and outline; focus keeps its ring.
        "aria-invalid:border-destructive-text aria-invalid:outline-solid aria-invalid:outline-1 aria-invalid:outline-offset-1 aria-invalid:outline-destructive-text",
        className,
      )}
      {...props}
    >
      <Checkbox.Indicator className="flex items-center justify-center text-primary-foreground data-[state=checked]:animate-in data-[state=checked]:zoom-in-75">
        {props.checked === "indeterminate" ? (
          <Minus size={11} strokeWidth={3} />
        ) : (
          <Check size={11} strokeWidth={3} />
        )}
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
CheckboxRoot.displayName = "Checkbox";

export { CheckboxRoot as Checkbox };
