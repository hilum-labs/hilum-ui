import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingButton?: React.ReactNode;
  error?: boolean;
  pill?: boolean;
  wrapperClassName?: string;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      leadingAddon,
      trailingAddon,
      leadingIcon,
      trailingIcon,
      trailingButton,
      error,
      pill,
      className,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const radius = pill ? "rounded-full" : "rounded-lg";
    const hasLeading = leadingAddon || leadingIcon;
    const hasTrailing = trailingAddon || trailingIcon || trailingButton || error;

    const baseInput = cn(
      "flex h-9 w-full border bg-white body text-ground-900 placeholder:text-ground-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:disabled:cursor-not-allowed disabled:opacity-50",
      error
        ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500"
        : "border-ground-200 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary",
    );

    if (!hasLeading && !hasTrailing) {
      return <input ref={ref} className={cn(baseInput, radius, "px-3", className)} {...props} />;
    }

    return (
      <div className={cn("flex", wrapperClassName)}>
        {/* Leading addon (text) */}
        {leadingAddon && (
          <span
            className={cn(
              "inline-flex items-center border border-r-0 bg-ground-50 px-3 body text-ground-500 select-none",
              error ? "border-red-400" : "border-ground-200",
              pill ? "rounded-l-full" : "rounded-l-lg",
            )}
          >
            {leadingAddon}
          </span>
        )}

        {/* Relative wrapper for icon-only inputs */}
        <div className="relative flex-1">
          {leadingIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ground-400">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseInput,
              // Border radius
              leadingAddon
                ? trailingAddon || trailingButton
                  ? "rounded-none px-3"
                  : pill
                    ? "rounded-none rounded-r-full px-3"
                    : "rounded-none rounded-r-lg px-3"
                : leadingIcon
                  ? trailingAddon
                    ? pill
                      ? "rounded-l-full rounded-r-none pl-9 pr-3"
                      : "rounded-l-lg rounded-r-none pl-9 pr-3"
                    : trailingIcon || error
                      ? cn(radius, "pl-9 pr-9")
                      : cn(radius, "pl-9 pr-3")
                  : trailingAddon
                    ? pill
                      ? "rounded-l-full rounded-r-none px-3"
                      : "rounded-l-lg rounded-r-none px-3"
                    : trailingIcon || error || trailingButton
                      ? cn(radius, "pl-3 pr-9")
                      : cn(radius, "px-3"),
              className,
            )}
            {...props}
          />

          {(trailingIcon || error) && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {error ? (
                <AlertCircle size={15} className="text-red-500" />
              ) : (
                <span className="text-ground-400">{trailingIcon}</span>
              )}
            </div>
          )}
        </div>

        {/* Trailing addon (text) */}
        {trailingAddon && (
          <span
            className={cn(
              "inline-flex items-center border border-l-0 bg-ground-50 px-3 body text-ground-500 select-none",
              error ? "border-red-400" : "border-ground-200",
              pill ? "rounded-r-full" : "rounded-r-lg",
            )}
          >
            {trailingAddon}
          </span>
        )}

        {/* Trailing button */}
        {trailingButton && <div className="flex">{trailingButton}</div>}
      </div>
    );
  },
);
InputGroup.displayName = "InputGroup";

export { InputGroup };
