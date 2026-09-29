"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { FieldContext, useFieldRegistry, type FieldContextValue } from "../lib/field-context";
import { Label } from "./label";

interface FieldProps {
  label: string;
  /**
   * id of the control the label targets. Optional: when omitted, Field
   * generates one and hands it to the control through context. Input,
   * InputGroup, Textarea, SelectTrigger, NativeSelect, InputNumber, Combobox,
   * MultiCombobox, TagInput, Switch, Checkbox, DatePicker, DateRangePicker,
   * DateTimePicker, TimePicker, ColorInput and InputOTP pick up the id, label,
   * hint / error (`aria-describedby`), `aria-invalid`, `aria-required` and
   * `disabled` automatically. If the control has its own `id`, the label
   * follows it, so `htmlFor` is only needed for controls outside this list.
   */
  htmlFor?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  /** Disables the wrapped control (via context) unless it sets `disabled` itself. */
  disabled?: boolean | undefined;
  cornerHint?: string | undefined;
  className?: string | undefined;
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
  const labelId = `${baseId}-label`;
  const { claimRef, owner, registerControl, unregisterControl } = useFieldRegistry();

  // Label target: explicit htmlFor > the owning control's own id > generated id.
  const controlId = htmlFor ?? owner?.id ?? baseId;
  // Groups (TimePicker, DateTimePicker, ColorInput) aren't labelable elements:
  // they reference the label with aria-labelledby and the label drops `for`.
  const labelFor = htmlFor ?? (owner && !owner.labelable ? undefined : controlId);
  // The hint/error paragraph keeps its predictable `${htmlFor}-description`
  // id (only one of them renders at a time), so consumers that wired
  // aria-describedby by hand keep working alongside the auto-wiring.
  const messageId = `${baseId}-description`;
  const descriptionId = hint && !error ? messageId : undefined;
  const errorId = error ? messageId : undefined;

  const context = React.useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelFor,
      labelId,
      descriptionId,
      errorId,
      invalid: !!error,
      required: !!required,
      disabled: !!disabled,
      ownerToken: owner?.token ?? null,
      claimRef,
      registerControl,
      unregisterControl,
    }),
    [
      controlId,
      labelFor,
      labelId,
      descriptionId,
      errorId,
      error,
      required,
      disabled,
      owner,
      claimRef,
      registerControl,
      unregisterControl,
    ],
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
          <Label id={labelId}>
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
