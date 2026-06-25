"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ColorPickerProps {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  disabled?: boolean;
  /** Optional preset palette shown above the picker. */
  presets?: string[];
  /** Accessible label for the trigger. */
  ariaLabel?: string;
}

function isValidHex(s: string): boolean {
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(s);
}

function ColorPicker({
  value,
  onChange,
  className,
  disabled,
  presets,
  ariaLabel = "Color",
}: ColorPickerProps) {
  const [hex, setHex] = React.useState(value);

  React.useEffect(() => {
    setHex(value);
  }, [value]);

  const commit = (next: string) => {
    if (isValidHex(next)) onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md border border-border bg-card",
            "transition-colors hover:border-border",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span
            aria-hidden
            className="size-4 rounded-sm border border-black/5"
            style={{ backgroundColor: value }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-56 p-3 max-sm:px-3">
        <input
          type="color"
          value={isValidHex(hex) ? hex : "#000000"}
          onChange={(e) => {
            setHex(e.target.value);
            onChange(e.target.value);
          }}
          className="h-9 w-full cursor-pointer rounded-md border border-border bg-card p-0.5"
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="caption text-muted-foreground">Hex</span>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
            }}
            className="h-9 flex-1 rounded-md border border-border bg-card px-2 caption text-foreground focus:outline-none focus:border-brand-primary"
          />
        </div>
        {presets && presets.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-label={p}
                className="size-9 rounded-md border border-black/10 transition-transform hover:scale-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
                style={{ backgroundColor: p }}
              />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
export type { ColorPickerProps };
