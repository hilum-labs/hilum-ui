"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface PropertyRowProps extends React.ComponentProps<"div"> {
  /** Optional label rendered on the left. Pass a string or any React node (icon + label, etc.). */
  label?: React.ReactNode;
  /** Width of the label column. Default: 96px. */
  labelWidth?: number | string;
  /** Aligns label vertically with controls. Default: "center". */
  labelAlign?: "start" | "center";
}

/**
 * Horizontal property row used inside designer inspector panels:
 * left-aligned label, right-aligned controls, single visual row.
 * Different from <Field>, which is a vertical form field with hint/error.
 *
 * <PropertyRow label="Opacity">
 *   <Slider />
 *   <InputNumber />
 * </PropertyRow>
 */
function PropertyRow({
  label,
  labelWidth = 96,
  labelAlign = "center",
  className,
  children,
  ...rest
}: PropertyRowProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-1",
        labelAlign === "center" ? "items-center" : "items-start",
        className,
      )}
      {...rest}
    >
      {label !== undefined && (
        <div
          className="caption text-ground-500 shrink-0 select-none"
          style={{ width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }}
        >
          {label}
        </div>
      )}
      <div className="flex flex-1 items-center gap-2 min-w-0">{children}</div>
    </div>
  );
}

PropertyRow.displayName = "PropertyRow";

export { PropertyRow };
export type { PropertyRowProps };
