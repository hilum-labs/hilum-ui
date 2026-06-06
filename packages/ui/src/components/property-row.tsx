"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface PropertyRowProps extends React.ComponentProps<"div"> {
  /** Optional label rendered on the left. Pass a string or any React node (icon + label, etc.). */
  label?: React.ReactNode;
  /** Label layout. Default: "stacked". */
  layout?: "stacked" | "inline";
  /** Width of the label column when layout="inline". Default: 96px. */
  labelWidth?: number | string;
  /** Aligns label vertically with controls when layout="inline". Default: "center". */
  labelAlign?: "start" | "center";
}

/**
 * Property row used inside designer inspector panels:
 * label above controls by default, with an inline option for dense rows.
 * Different from <Field>, which is a vertical form field with hint/error.
 *
 * <PropertyRow label="Opacity">
 *   <Slider />
 *   <InputNumber />
 * </PropertyRow>
 */
function PropertyRow({
  label,
  layout = "stacked",
  labelWidth = 96,
  labelAlign = "center",
  className,
  children,
  ...rest
}: PropertyRowProps) {
  const inline = layout === "inline";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 py-1",
        inline
          ? cn("gap-3", labelAlign === "center" ? "items-center" : "items-start")
          : "flex-col items-stretch gap-1.5",
        className,
      )}
      {...rest}
    >
      {label !== undefined && (
        <div
          className={cn(
            "caption select-none text-muted-foreground",
            inline ? "shrink-0" : "w-full",
          )}
          style={
            inline
              ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
              : undefined
          }
        >
          {label}
        </div>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  );
}

PropertyRow.displayName = "PropertyRow";

export { PropertyRow };
export type { PropertyRowProps };
