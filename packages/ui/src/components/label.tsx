"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../lib/utils";
import { useFieldContext } from "../lib/field-context";

function Label({ className, htmlFor, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  // Inside a <Field>, a bare <Label> targets the field's control.
  const field = useFieldContext();
  const target = htmlFor ?? field?.labelFor;
  return (
    <LabelPrimitive.Root
      data-slot="label"
      {...(target != null ? { htmlFor: target } : {})}
      className={cn(
        "body font-medium leading-none text-muted-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "compact:text-[11px] compact:leading-4",
        className,
      )}
      {...props}
    />
  );
}
Label.displayName = "Label";

export { Label };
