"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { FieldContext, type FieldContextValue } from "../lib/field-context";
import { Label } from "./label";

interface FieldProps {
  label: string;
  /**
   * id of the control the label targets. Optional: when omitted, Field
   * generates one and hands it to the control through context (Input,
   * Textarea, Select, NativeSelect, InputNumber pick it up automatically). If
   * the control has its own `id`, the label follows it.
   */
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Disables the wrapped control (via context) unless it sets `disabled` itself. */
  disabled?: boolean;
  cornerHint?: string;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  disabled,
  cornerHint,
  className,
  children,
  ref,
}: FieldProps) {
  const generatedId = React.useId();
  const baseId = htmlFor ?? `field-${generatedId.replace(/:/g, "")}`;
  const [registeredId, setRegisteredId] = React.useState<string | null>(null);
  const claimRef = React.useRef<string | null>(null);

  // Label target: explicit htmlFor > a control's own id > generated id.
  const controlId = htmlFor ?? registeredId ?? baseId;
  // The hint/error paragraph keeps its predictable `${htmlFor}-description`
  // id (only one of them renders at a time), so consumers that wired
  // aria-describedby by hand keep working alongside the auto-wiring.
  const messageId = `${baseId}-description`;
  const descriptionId = hint && !error ? messageId : undefined;
  const errorId = error ? messageId : undefined;

  const context = React.useMemo<FieldContextValue>(
    () => ({
      controlId,
      descriptionId,
      errorId,
      invalid: !!error,
      required: !!required,
      disabled: !!disabled,
      claimRef,
      registerControlId: setRegisteredId,
    }),
    [controlId, descriptionId, errorId, error, required, disabled],
  );

  return (
    <FieldContext.Provider value={context}>
      <div
        ref={ref}
        data-slot="field"
        className={cn("flex flex-col gap-1.5", className)}
        data-invalid={error ? "" : undefined}
      >
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={controlId}>
            {label}
            {required && (
              <span className="ms-0.5 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </Label>
          {cornerHint && <span className="caption text-muted-foreground">{cornerHint}</span>}
        </div>
        {children}
        {error ? (
          <p id={errorId} role="alert" className="caption text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={descriptionId} className="caption text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
Field.displayName = "Field";

export { Field };
export type { FieldProps };
export { useFieldControl, useFieldContext } from "../lib/field-context";
export type {
  FieldControlProps,
  FieldControlResult,
  FieldContextValue,
} from "../lib/field-context";
