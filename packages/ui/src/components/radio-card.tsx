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

interface RadioCardsProps {
  options: RadioCardOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

function RadioCards({ options, value, onValueChange, columns = 3, className }: RadioCardsProps) {
  const colMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3", colMap[columns], className)}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => !option.disabled && onValueChange?.(option.value)}
            className={cn(
              "relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-left transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isSelected
                ? "border-brand-primary bg-white shadow-natural"
                : "border-ground-200 bg-white hover:border-ground-400",
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
                {option.icon && <div className="mb-2 text-ground-500">{option.icon}</div>}
                <p
                  className={cn(
                    "body font-semibold",
                    isSelected ? "text-ground-900" : "text-ground-800",
                  )}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="mt-0.5 caption text-ground-400">{option.description}</p>
                )}
              </div>
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-brand-primary bg-brand-primary"
                    : "border-ground-300 bg-white",
                )}
              >
                {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
            </div>

            {option.meta && (
              <p
                className={cn(
                  "caption font-semibold mt-2",
                  isSelected ? "text-ground-900" : "text-ground-400",
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
