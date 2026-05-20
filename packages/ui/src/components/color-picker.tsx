"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Popover } from "radix-ui";

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
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-ground-200 bg-white",
            "transition-colors hover:border-ground-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span
            aria-hidden
            className="h-5 w-5 rounded-sm border border-black/5"
            style={{ backgroundColor: value }}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-56 rounded-xl bg-white p-3 shadow-natural outline-none"
        >
          <input
            type="color"
            value={isValidHex(hex) ? hex : "#000000"}
            onChange={(e) => {
              setHex(e.target.value);
              onChange(e.target.value);
            }}
            className="h-10 w-full cursor-pointer rounded-md border border-ground-200 bg-white p-0.5"
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="caption text-ground-500">Hex</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
              }}
              className="flex-1 h-7 rounded-md border border-ground-200 bg-white px-2 caption text-ground-900 focus:outline-none focus:border-brand-primary"
            />
          </div>
          {presets && presets.length > 0 && (
            <div className="mt-3 grid grid-cols-8 gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange(p)}
                  aria-label={p}
                  className="h-5 w-5 rounded-sm border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
                  style={{ backgroundColor: p }}
                />
              ))}
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { ColorPicker };
export type { ColorPickerProps };
