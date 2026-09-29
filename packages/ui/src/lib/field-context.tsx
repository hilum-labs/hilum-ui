"use client";

import * as React from "react";

/**
 * Shared wiring between <Field> and the form control rendered inside it.
 *
 * Field publishes the ids of its label, hint and error; controls (Input,
 * Textarea, Select, NativeSelect, InputNumber, Combobox, Switch, Checkbox, the
 * date and time pickers, ColorInput, InputOTP, TagInput, MultiCombobox, …)
 * consume them through `useFieldControl()` so a bare
 * `<Field label="Email" error="…"><Input /></Field>` is correctly labelled,
 * described and marked invalid without manual ids.
 */
interface FieldContextValue {
  /** id the label's htmlFor points at (explicit htmlFor, a control's own id, or generated). */
  controlId: string;
  /**
   * What the field's `<label for>` points at: `controlId`, or `undefined`
   * when the owning control is a group named with `aria-labelledby`.
   */
  labelFor: string | undefined;
  /** id of the field's visible label, for controls that are named with `aria-labelledby`. */
  labelId: string | undefined;
  /** id of the hint paragraph, when a hint is rendered. */
  descriptionId: string | undefined;
  /** id of the error paragraph, when an error is rendered. */
  errorId: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  /**
   * Token of the control that owns the label (the first one mounted), or
   * `null` before any control has mounted.
   */
  ownerToken: string | null;
  /**
   * Render-time claim, so the first control rendered takes the field id on
   * its very first render (before it has registered). Providers create it
   * with `useRef<string | null>(null)`.
   */
  claimRef: React.MutableRefObject<string | null>;
  /** Called by controls when they mount, and again when their id changes. */
  registerControl: (token: string, registration: FieldControlRegistration) => void;
  /** Called by controls when they unmount. */
  unregisterControl: (token: string) => void;
  /**
   * Name every unnamed control with the label (`aria-labelledby`), not just
   * the one the `<label for>` targets. Set by PropertyRow, whose rows pair
   * controls (a Slider and an InputNumber) under one label.
   */
  labelEveryControl?: boolean;
}

interface FieldControlRegistration {
  /** The control's own `id`, when it sets one. The label follows it. */
  id?: string | undefined;
  /**
   * Whether a `<label for>` can name the control (input, textarea, select,
   * button). Groups (TimePicker, DateTimePicker, ColorInput) are named with
   * `aria-labelledby` instead, and the label drops its `for`.
   */
  labelable?: boolean | undefined;
}

interface FieldOwner {
  token: string;
  id: string | undefined;
  labelable: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Claim bookkeeping lives outside the hook so the (intentional, idempotent)
// ref write during render is explicit and isolated.
function claimControl(claimRef: React.MutableRefObject<string | null>, token: string): boolean {
  if (claimRef.current == null) claimRef.current = token;
  return claimRef.current === token;
}

/**
 * Registry of the controls mounted inside a Field (or a react-hook-form
 * FormItem). The first control mounted owns the label; when it unmounts, the
 * next one (or one mounted later) takes over, so conditional rendering
 * (`{editing ? <Select /> : <Input id="x" />}`) never leaves the label
 * pointing at a control that is gone.
 */
function useFieldRegistry() {
  const claimRef = React.useRef<string | null>(null);
  const registry = React.useRef(new Map<string, FieldControlRegistration>());
  const [owner, setOwner] = React.useState<FieldOwner | null>(null);

  const sync = React.useCallback(() => {
    const controls = registry.current;
    const claimed = claimRef.current;
    const token =
      claimed != null && controls.has(claimed)
        ? claimed
        : (controls.keys().next().value as string | undefined);
    claimRef.current = token ?? null;
    if (token == null) {
      setOwner(null);
      return;
    }
    const registration = controls.get(token);
    const next: FieldOwner = {
      token,
      id: registration?.id,
      labelable: registration?.labelable ?? true,
    };
    setOwner((prev) =>
      prev && prev.token === next.token && prev.id === next.id && prev.labelable === next.labelable
        ? prev
        : next,
    );
  }, []);

  const registerControl = React.useCallback(
    (token: string, registration: FieldControlRegistration) => {
      registry.current.set(token, registration);
      sync();
    },
    [sync],
  );

  const unregisterControl = React.useCallback(
    (token: string) => {
      registry.current.delete(token);
      sync();
    },
    [sync],
  );

  return { claimRef, owner, registerControl, unregisterControl };
}

function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

interface FieldControlProps {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"] | undefined;
  "aria-required"?: React.AriaAttributes["aria-required"] | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
  disabled?: boolean | undefined;
}

interface FieldControlOptions {
  /**
   * `false` for controls a `<label for>` can't name (a `role="group"`
   * wrapper): they get `aria-labelledby` pointing at the Field label instead.
   * Default `true`.
   */
  labelable?: boolean;
}

interface FieldControlResult {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
  /** Set for non-labelable controls without a name of their own, and when passed explicitly. */
  "aria-labelledby"?: string;
  disabled?: boolean;
}

/**
 * Resolve accessibility props for a form control, merging in the surrounding
 * <Field>'s ids. Explicit props always win over the context. Outside a Field
 * the explicit props are returned unchanged.
 *
 * Only the first control mounted inside a Field takes the field's id (so the
 * label targets it); additional controls still get aria-describedby /
 * aria-invalid but keep their own ids, avoiding duplicate ids. A control that
 * sets its own `id` keeps it, and the label follows that id.
 */
function useFieldControl(
  props: FieldControlProps = {},
  options: FieldControlOptions = {},
): FieldControlResult {
  const ctx = useFieldContext();
  const token = React.useId();
  const labelable = options.labelable ?? true;

  const isPrimary =
    ctx != null &&
    (ctx.ownerToken != null ? ctx.ownerToken === token : claimControl(ctx.claimRef, token));

  const explicitId = props.id;
  const registration = React.useRef<FieldControlRegistration>({ id: explicitId, labelable });

  const registerControl = ctx?.registerControl;
  const unregisterControl = ctx?.unregisterControl;
  // Keeps the registration current: id changes keep the control's place in
  // the registry (Map.set on an existing key preserves its order).
  useIsomorphicLayoutEffect(() => {
    const previous = registration.current;
    registration.current = { id: explicitId, labelable };
    if (previous.id !== explicitId || previous.labelable !== labelable) {
      registerControl?.(token, registration.current);
    }
  }, [registerControl, token, explicitId, labelable]);
  // Mount / unmount: joins the Field's registry in mount order.
  useIsomorphicLayoutEffect(() => {
    if (!registerControl || !unregisterControl) return;
    registerControl(token, registration.current);
    return () => unregisterControl(token);
  }, [registerControl, unregisterControl, token]);

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

  if (props["aria-labelledby"] != null) {
    result["aria-labelledby"] = props["aria-labelledby"];
  } else if (
    (!labelable || !isPrimary) &&
    (isPrimary || ctx?.labelEveryControl) &&
    props["aria-label"] == null &&
    ctx?.labelId
  ) {
    result["aria-labelledby"] = ctx.labelId;
  }

  const disabled = props.disabled ?? (ctx?.disabled ? true : undefined);
  if (disabled != null) result.disabled = disabled;

  return result;
}

/** Whether an `aria-invalid` value marks the control invalid. */
function isAriaInvalid(value: React.AriaAttributes["aria-invalid"] | undefined): boolean {
  return value != null && value !== false && value !== "false";
}

export { FieldContext, isAriaInvalid, useFieldContext, useFieldControl, useFieldRegistry };
export type {
  FieldContextValue,
  FieldControlProps,
  FieldControlOptions,
  FieldControlRegistration,
  FieldControlResult,
};
