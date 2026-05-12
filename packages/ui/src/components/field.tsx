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
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </Label>
        {cornerHint && <span className="caption text-taupe-400">{cornerHint}</span>}
      </div>
      {children}
      {error ? (
        <p className="caption text-red-600">{error}</p>
      ) : hint ? (
        <p className="caption text-taupe-400">{hint}</p>
      ) : null}
    </div>
  );
}

export { Field };
