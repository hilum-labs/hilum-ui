"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface RadioCardsProps extends Omit<React.ComponentProps<"div">, "onChange" | "children"> {
  options: RadioCardOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

function RadioCards({
  ref,
  options,
  value,
  onValueChange,
  columns = 3,
  className,
  onKeyDown,
  ...props
}: RadioCardsProps) {
  const selectedIndex = options.findIndex((o) => o.value === value && !o.disabled);
  // Roving tab stop: the selected card, else the first enabled one.
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : options.findIndex((o) => !o.disabled);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
    );
    const current = items.indexOf(e.target as HTMLButtonElement);
    if (current === -1) return;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? ["ArrowDown", "ArrowLeft"] : ["ArrowDown", "ArrowRight"];
    const backward = rtl ? ["ArrowUp", "ArrowRight"] : ["ArrowUp", "ArrowLeft"];
    let next: number | null = null;
    if (forward.includes(e.key)) next = (current + 1) % items.length;
    else if (backward.includes(e.key)) next = (current - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    items[next]?.focus();
    items[next]?.click();
  };

  const colMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabindex per WAI-ARIA APG: the radios are focusable, the radiogroup container is not
    <div
      ref={ref}
      role="radiogroup"
      data-slot="radio-cards"
      className={cn("grid gap-3", colMap[columns], className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={index === tabbableIndex ? 0 : -1}
            data-slot="radio-card"
            data-state={isSelected ? "checked" : "unchecked"}
            disabled={option.disabled}
            onClick={() => !option.disabled && onValueChange?.(option.value)}
            className={cn(
              "relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-start transition-[background-color,border-color,box-shadow,opacity,scale]",
              "active:scale-[0.96]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isSelected
                ? "border-brand-primary bg-card shadow-natural"
                : "border-border bg-card hover:border-border",
            )}
          >
            {/* Selected ring overlay */}
            {isSelected && (
              <span
                className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand-primary"
                aria-hidden="true"
              />
            )}

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {option.icon && <div className="mb-2 text-muted-foreground">{option.icon}</div>}
                <p
                  className={cn(
                    "body font-semibold text-pretty",
                    isSelected ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="mt-0.5 caption text-pretty text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-brand-primary bg-brand-primary" : "border-border bg-card",
                )}
              >
                {isSelected && <Check size={10} className="text-background" strokeWidth={3} />}
              </div>
            </div>

            {option.meta && (
              <p
                className={cn(
                  "caption font-semibold mt-2",
                  isSelected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {option.meta}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

RadioCards.displayName = "RadioCards";

export { RadioCards };
export type { RadioCardsProps };
