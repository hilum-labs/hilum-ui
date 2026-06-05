import * as React from "react";
import { cn } from "../lib/utils";
import { Label } from "./label";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  cornerHint?: string;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  cornerHint,
  className,
  children,
  ref,
}: FieldProps) {
  // Predictable ID for the description/error paragraph so consumers can wire
  // aria-describedby on the child input: aria-describedby={`${id}-description`}
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor} aria-required={required}>
          {label}
          {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
        </Label>
        {cornerHint && <span className="caption text-muted-foreground">{cornerHint}</span>}
      </div>
      {children}
      {error ? (
        <p id={descriptionId} role="alert" className="caption text-destructive">{error}</p>
      ) : hint ? (
        <p id={descriptionId} className="caption text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
Field.displayName = "Field";

export { Field };
