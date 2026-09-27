"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Input, type InputProps } from "./input";
import { Spinner } from "./spinner";

interface SearchInputProps extends Omit<InputProps, "type" | "onChange" | "value"> {
  value: string;
  /** Called with the new string (not the event) on every keystroke and on clear. */
  onValueChange: (value: string) => void;
  /** Show a spinner in place of the clear button (e.g. while results load). */
  loading?: boolean;
  /** Accessible name when there is no visible label. Default: placeholder or "Search". */
  "aria-label"?: string;
  /** Classes for the wrapper (width, margins). `className` targets the input. */
  containerClassName?: string;
}

/**
 * Search field with a leading magnifier, clear button and Escape-to-clear.
 * Replaces the hand-built "Input + absolutely positioned Search icon" pattern.
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onValueChange,
      loading = false,
      placeholder = "Search",
      className,
      containerClassName,
      onKeyDown,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    return (
      <div
        className={cn("relative w-full min-w-0", containerClassName)}
        data-slot="search-input"
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground compact:left-2 compact:size-3.5"
          aria-hidden="true"
        />
        <Input
          ref={innerRef}
          type="search"
          role="searchbox"
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value) {
              event.preventDefault();
              onValueChange("");
            }
            onKeyDown?.(event);
          }}
          className={cn(
            "pl-9 pr-9 compact:pl-7 compact:pr-7 [&::-webkit-search-cancel-button]:appearance-none",
            className,
          )}
          {...props}
        />
        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center">
          {loading ? (
            <Spinner size="sm" aria-label="Searching" />
          ) : value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onValueChange("");
                innerRef.current?.focus();
              }}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring compact:size-5"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
export type { SearchInputProps };
