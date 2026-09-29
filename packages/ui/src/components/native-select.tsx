"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { compactFieldFocusClasses, compactFieldSurfaceClasses } from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { useFieldControl } from "../lib/field-context";

function NativeSelect({
  className,
  children,
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: React.ComponentProps<"select">) {
  const shape = useShape();
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  });

  return (
    <div data-slot="native-select-wrapper" className="relative">
      <select
        data-slot="native-select"
        {...fieldProps}
        className={cn(
          "peer h-10 w-full appearance-none border border-border bg-background ps-3 pe-8",
          shape.input,
          "body text-foreground",
          "focus:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/20",
          // Editor-chrome density: the same 24px filled field as Input.
          "compact:h-6 compact:py-0 compact:ps-2 compact:pe-6 compact:rounded-[5px] compact:text-[12px]",
          compactFieldSurfaceClasses,
          compactFieldFocusClasses,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50 compact:end-1.5 compact:size-3"
      />
    </div>
  );
}
NativeSelect.displayName = "NativeSelect";

function NativeSelectOption(props: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}
NativeSelectOption.displayName = "NativeSelectOption";

function NativeSelectOptGroup(props: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" {...props} />;
}
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
