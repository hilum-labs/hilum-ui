"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { ColorPicker } from "./color-picker";

interface ColorInputProps {
  value: string;
  onChange: (next: string) => void;
  /** Show an opacity slider (0–100). Pass `opacity` and `onOpacityChange`. */
  opacity?: number;
  onOpacityChange?: (next: number) => void;
  className?: string;
  disabled?: boolean;
  presets?: string[];
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
  disabled,
  presets,
}: ColorInputProps) {
  const [hex, setHex] = React.useState(value);

  React.useEffect(() => {
    setHex(value);
  }, [value]);

  const commitHex = (next: string) => {
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(next)) onChange(next);
    else setHex(value);
  };

  return (
    <div
      className={cn(
        "inline-flex h-8 items-stretch gap-0 rounded-md border border-border bg-card overflow-hidden",
        "focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <ColorPicker
        value={value}
        onChange={onChange}
        {...(presets !== undefined && { presets })}
        {...(disabled !== undefined && { disabled })}
        className="h-full w-8 border-0 rounded-none focus-visible:ring-0"
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
        className="w-[5.5rem] caption text-foreground px-2 bg-transparent border-l border-border focus:outline-none uppercase"
      />
      {typeof opacity === "number" && onOpacityChange && (
        <div className="relative flex items-center border-l border-border">
          <input
            type="number"
            min={0}
            max={100}
            value={Math.round(opacity)}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-12 caption text-foreground px-2 bg-transparent focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span aria-hidden className="caption-xs text-muted-foreground pr-2">
            %
          </span>
        </div>
      )}
    </div>
  );
}

ColorInput.displayName = "ColorInput";

export { ColorInput };
export type { ColorInputProps };
