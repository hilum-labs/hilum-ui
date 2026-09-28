"use client";

import * as React from "react";

/**
 * Shared wiring between <Field> and the form control rendered inside it.
 *
 * Field publishes the ids of its label target, hint and error; controls
 * (Input, Textarea, Select, NativeSelect, InputNumber, …) consume them through
 * `useFieldControl()` so a bare `<Field label="Email" error="…"><Input /></Field>`
 * is correctly labelled, described and marked invalid without manual ids.
 */
interface FieldContextValue {
  /** id the label's htmlFor points at (explicit htmlFor, a control's own id, or generated). */
  controlId: string;
  /** id of the hint paragraph, when a hint is rendered. */
  descriptionId: string | undefined;
  /** id of the error paragraph, when an error is rendered. */
  errorId: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  /**
   * Which control (by internal token) owns `controlId`; the first one rendered
   * wins. Providers create it with `useRef<string | null>(null)`.
   */
  claimRef: React.MutableRefObject<string | null>;
  /** A control that carries its own `id` reports it so the label can follow. */
  registerControlId: (id: string | null) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

// Claim bookkeeping lives outside the hook so the (intentional, idempotent)
// ref write during render is explicit and isolated.
function claimControl(claimRef: React.MutableRefObject<string | null>, token: string): boolean {
  if (claimRef.current == null) claimRef.current = token;
  return claimRef.current === token;
}

function releaseControl(claimRef: React.MutableRefObject<string | null>, token: string) {
  if (claimRef.current === token) claimRef.current = null;
}

function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

interface FieldControlProps {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"] | undefined;
  "aria-required"?: React.AriaAttributes["aria-required"] | undefined;
  disabled?: boolean | undefined;
}

interface FieldControlResult {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
  disabled?: boolean;
}

/**
 * Resolve accessibility props for a form control, merging in the surrounding
 * <Field>'s ids. Explicit props always win over the context. Outside a Field
 * the explicit props are returned unchanged.
 *
 * Only the first control rendered inside a Field takes the field's id (so the
 * label targets it); additional controls still get aria-describedby /
 * aria-invalid but keep their own ids, avoiding duplicate ids.
 */
function useFieldControl(props: FieldControlProps = {}): FieldControlResult {
  const ctx = useFieldContext();
  const token = React.useId();

  const claimRef = ctx?.claimRef;
  const isPrimary = claimRef != null && claimControl(claimRef, token);

  React.useEffect(() => {
    if (!claimRef) return;
    claimControl(claimRef, token);
    return () => releaseControl(claimRef, token);
  }, [claimRef, token]);

  const explicitId = props.id;
  const registerControlId = ctx?.registerControlId;
  React.useEffect(() => {
    if (!isPrimary || !registerControlId || explicitId == null) return;
    registerControlId(explicitId);
    return () => registerControlId(null);
  }, [isPrimary, registerControlId, explicitId]);

  const result: FieldControlResult = {};
  const id = explicitId ?? (isPrimary && ctx ? ctx.controlId : undefined);
  if (id != null) result.id = id;

  const describedBy =
    props["aria-describedby"] ??
    ([ctx?.descriptionId, ctx?.errorId].filter(Boolean).join(" ") || undefined);
  if (describedBy != null) result["aria-describedby"] = describedBy;

  const invalid = props["aria-invalid"] ?? (ctx?.invalid ? true : undefined);
  if (invalid != null) result["aria-invalid"] = invalid;

  const required = props["aria-required"] ?? (ctx?.required ? true : undefined);
  if (required != null) result["aria-required"] = required;

  const disabled = props.disabled ?? (ctx?.disabled ? true : undefined);
  if (disabled != null) result.disabled = disabled;

  return result;
}

export { FieldContext, useFieldContext, useFieldControl };
export type { FieldContextValue, FieldControlProps, FieldControlResult };
