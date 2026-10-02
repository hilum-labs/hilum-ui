"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import {
  controlHeightClass,
  controlInvalidWithinClasses,
  controlSurfaceClasses,
  controlTextClass,
  inputFocusWithinClasses,
  motionClasses,
} from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { isAriaInvalid, useFieldControl } from "../lib/field-context";
import { ColorPickerPopover } from "./color-picker";
import type { ControlMobileSurface } from "./input";

interface ColorInputLabels {
  /** Accessible name of the hex text field. */
  hex: string;
  /** Accessible name of the opacity field. */
  opacity: string;
  /** Accessible name of the swatch button that opens the colour picker. */
  picker: string;
}

const DEFAULT_LABELS: ColorInputLabels = {
  hex: "Hex colour",
  opacity: "Opacity",
  picker: "Open colour picker",
};

interface ColorInputProps {
  value: string;
  onChange: (next: string) => void;
  /** Show an opacity slider (0–100). Pass `opacity` and `onOpacityChange`. */
  opacity?: number;
  onOpacityChange?: (next: number) => void;
  className?: string;
  disabled?: boolean;
  presets?: string[];
  mobileSurface?: ControlMobileSurface;
  /** Override the English UI strings (i18n). */
  labels?: Partial<ColorInputLabels>;
  /**
   * id of the group. Inside a `<Field>` the group is named by the field's
   * label (`aria-labelledby`) and the hex field takes its hint / error,
   * invalid, required and disabled state.
   */
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

/**
 * Compact, inline color input designed for designer property panels.
 * Combines a swatch trigger (ColorPicker), a hex input, and an optional opacity field.
 */
function ColorInput({
  value,
  onChange,
  opacity,
  onOpacityChange,
  className,
  disabled: disabledProp,
  presets,
  mobileSurface = "default",
  labels: labelsProp,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
}: ColorInputProps) {
  const shape = useShape();
  const fieldProps = useFieldControl(
    {
      id,
      disabled: disabledProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
    },
    { labelable: false },
  );
  const disabled = fieldProps.disabled;
  const invalid = isAriaInvalid(fieldProps["aria-invalid"]);
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [hex, setHex] = React.useState(value);

  React.useEffect(() => {
    setHex(value);
  }, [value]);

  const commitHex = (next: string) => {
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(next)) onChange(next);
    else setHex(value);
  };

  const mobileSurfaceClass =
    mobileSurface === "flush"
      ? "max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:bg-transparent max-sm:px-0 max-sm:shadow-none max-sm:focus-within:ring-0"
      : "";

  return (
    <div
      data-slot="color-input"
      {...(fieldProps.id || ariaLabel || fieldProps["aria-labelledby"]
        ? {
            role: "group",
            id: fieldProps.id,
            "aria-label": ariaLabel,
            "aria-labelledby": fieldProps["aria-labelledby"],
          }
        : {})}
      data-invalid={invalid ? "" : undefined}
      className={cn(
        "inline-flex items-stretch gap-0 overflow-hidden",
        controlHeightClass,
        controlSurfaceClasses,
        shape.input,
        // Compact: span the row like Figma's fill rows; the hex field takes the slack.
        "compact:flex compact:h-6 compact:w-full compact:min-w-0 compact:rounded-[5px]",
        inputFocusWithinClasses,
        controlInvalidWithinClasses,
        motionClasses,
        mobileSurfaceClass,
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <ColorPickerPopover
        value={value}
        onChange={onChange}
        {...(presets !== undefined && { presets })}
        {...(disabled !== undefined && { disabled })}
        triggerShowValue={false}
        triggerAriaLabel={labels.picker}
        hideEyedropper
        triggerClassName="h-full w-8 border-0 rounded-none bg-transparent px-1 hover:bg-hover focus-visible:ring-0 compact:h-full compact:w-6 compact:px-0 compact:justify-center compact:rounded-none compact:[&>span]:!size-4"
      />
      <input
        type="text"
        value={hex.replace(/^#/, "")}
        onChange={(e) => setHex("#" + e.target.value.replace(/^#/, ""))}
        onBlur={(e) => commitHex("#" + e.target.value.replace(/^#/, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            commitHex("#" + (e.target as HTMLInputElement).value.replace(/^#/, ""));
        }}
        spellCheck={false}
        aria-label={labels.hex}
        aria-describedby={fieldProps["aria-describedby"]}
        aria-invalid={invalid || undefined}
        aria-required={fieldProps["aria-required"]}
        disabled={disabled}
        className={cn(
          "w-[5.5rem] tabular-nums text-foreground px-2 bg-transparent border-s border-border focus:outline-none uppercase",
          controlTextClass,
          "compact:w-[4.5rem] compact:min-w-0 compact:flex-1 compact:border-foreground/[0.07] compact:px-1.5 compact:text-[12px]",
        )}
      />
      {typeof opacity === "number" && onOpacityChange && (
        <div className="relative flex items-center border-s border-border compact:border-foreground/[0.07]">
          <input
            type="number"
            min={0}
            max={100}
            value={Math.round(opacity)}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            aria-label={labels.opacity}
            className="w-12 text-sm tabular-nums text-foreground px-2 bg-transparent focus:outline-none text-end compact:w-10 compact:px-1.5 compact:text-[12px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span aria-hidden className="caption-xs text-muted-foreground pe-2 compact:text-[11px]">
            %
          </span>
        </div>
      )}
    </div>
  );
}

ColorInput.displayName = "ColorInput";

export { ColorInput, DEFAULT_LABELS as COLOR_INPUT_DEFAULT_LABELS };
export type { ColorInputProps, ColorInputLabels };
