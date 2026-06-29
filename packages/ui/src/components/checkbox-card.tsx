"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Checkbox } from "./checkbox";

interface CheckboxCardProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  checked?: boolean | "indeterminate";
  disabled?: boolean;
  label: React.ReactNode;
  description?: React.ReactNode;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
}

const CheckboxCard = React.forwardRef<HTMLLabelElement, CheckboxCardProps>(
  ({ checked, disabled, label, description, onCheckedChange, className, children, ...props }, ref) => {
    const checkboxProps = {
      ...(checked !== undefined ? { checked } : {}),
      ...(disabled !== undefined ? { disabled } : {}),
      ...(onCheckedChange ? { onCheckedChange } : {}),
    };

    return (
      <label
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(
          "group flex min-w-0 items-start gap-3 rounded-lg border border-border bg-card p-3",
          "text-sm text-foreground shadow-natural transition-[background-color,border-color,box-shadow,opacity,scale]",
          "hover:bg-muted/40 active:scale-[0.98]",
          "has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-[#6B97FF]",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <Checkbox {...checkboxProps} className="mt-0.5" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-medium leading-5 text-foreground">{label}</span>
          {description ? (
            <span className="text-[12px] leading-4 text-muted-foreground">{description}</span>
          ) : null}
          {children}
        </span>
      </label>
    );
  },
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
export type { CheckboxCardProps };
