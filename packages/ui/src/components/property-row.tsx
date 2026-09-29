"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { FieldContext, useFieldRegistry, type FieldContextValue } from "../lib/field-context";

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
 *
 * The label names the controls inside: it's a `<label for>` the first Hilum
 * control, and the others (and a Slider) are labelled by it.
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
  const generatedId = React.useId();
  const baseId = `property-row-${generatedId.replace(/:/g, "")}`;
  const labelId = `${baseId}-label`;
  const { claimRef, owner, registerControl, unregisterControl } = useFieldRegistry();
  const controlId = owner?.id ?? baseId;
  const labelFor = owner && !owner.labelable ? undefined : owner ? controlId : undefined;
  const hasLabel = label !== undefined;

  const context = React.useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelFor,
      labelId,
      descriptionId: undefined,
      errorId: undefined,
      invalid: false,
      required: false,
      disabled: false,
      ownerToken: owner?.token ?? null,
      claimRef,
      registerControl,
      unregisterControl,
      labelEveryControl: true,
    }),
    [controlId, labelFor, labelId, owner, claimRef, registerControl, unregisterControl],
  );

  const row = (
    <div
      data-slot="property-row"
      className={cn(
        "flex w-full min-w-0 py-1 compact:py-0.5",
        inline
          ? cn(
              "gap-3 compact:min-h-7 compact:gap-2",
              labelAlign === "center" ? "items-center" : "items-start",
            )
          : "flex-col items-stretch gap-1.5 compact:gap-1",
        className,
      )}
      {...rest}
    >
      {hasLabel && (
        <label
          id={labelId}
          htmlFor={labelFor}
          className={cn(
            "caption select-none text-muted-foreground compact:text-[11px] compact:leading-4",
            inline ? "shrink-0" : "w-full",
          )}
          style={
            inline
              ? { width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth }
              : undefined
          }
        >
          {label}
        </label>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  );

  return hasLabel ? <FieldContext.Provider value={context}>{row}</FieldContext.Provider> : row;
}

PropertyRow.displayName = "PropertyRow";

export { PropertyRow };
export type { PropertyRowProps };
