"use client";

// @hilum/ui/form — react-hook-form bindings for Hilum form controls.
//
// This is the ONLY module in @hilum/ui that imports react-hook-form, which is
// an optional peer dependency: apps that don't use it never pay for it.
//
//   const form = useForm<Values>({ defaultValues: { email: "" } })
//   <Form {...form}>
//     <form onSubmit={form.handleSubmit(onSubmit)}>
//       <FormField
//         control={form.control}
//         name="email"
//         rules={{ required: "Email is required" }}
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Email</FormLabel>
//             <FormControl><Input type="email" {...field} /></FormControl>
//             <FormDescription>We'll send the receipt here.</FormDescription>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </form>
//   </Form>

import * as React from "react";
import { Slot } from "radix-ui";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "./lib/utils";
import { FieldContext, useFieldRegistry, type FieldContextValue } from "./lib/field-context";
import { Label } from "./components/label";

/** `<Form {...useForm()}>` — react-hook-form's FormProvider. */
const Form = FormProvider;

/* ─────────────────────── FormField ─────────────────────── */

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/** A react-hook-form `Controller` that shares the field name with FormItem/FormLabel/FormMessage. */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  const value = React.useMemo(() => ({ name: props.name }), [props.name]);
  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}
FormField.displayName = "FormField";

/* ─────────────────────── FormItem ─────────────────────── */

interface FormItemContextValue {
  id: string;
  required: boolean;
  /** Whether a FormDescription is mounted (so aria-describedby never dangles). */
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/**
 * Ids and state for the current field: wire them manually when a control
 * can't sit directly inside `<FormControl>`.
 */
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  if (!fieldContext) throw new Error("useFormField must be used within <FormField>");
  if (!itemContext) throw new Error("useFormField must be used within <FormItem>");
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    required: itemContext.required,
    hasDescription: itemContext.hasDescription,
    ...fieldState,
  };
}

interface FormItemProps extends React.ComponentProps<"div"> {
  /** Marks the label with an asterisk and sets `aria-required` on the control. */
  required?: boolean;
}

/** Field wrapper — same spacing as `<Field>`; scopes ids for label/description/message. */
function FormItem({ className, required = false, ...props }: FormItemProps) {
  const id = React.useId().replace(/:/g, "");
  const [hasDescription, setHasDescription] = React.useState(false);
  const value = React.useMemo(
    () => ({ id, required, hasDescription, setHasDescription }),
    [id, required, hasDescription],
  );
  return (
    <FormItemContext.Provider value={value}>
      <FormItemFieldBridge>
        <div data-slot="form-item" className={cn("flex flex-col gap-1.5", className)} {...props} />
      </FormItemFieldBridge>
    </FormItemContext.Provider>
  );
}
FormItem.displayName = "FormItem";

/**
 * Publishes the form item's ids through Hilum's FieldContext so controls that
 * read it (Input, Textarea, Select, TimePicker, …) are labelled, described and
 * marked invalid even when they aren't wrapped in `<FormControl>`.
 */
function FormItemFieldBridge({ children }: { children: React.ReactNode }) {
  const fieldContext = React.useContext(FormFieldContext);
  // Outside a FormField (e.g. a static FormItem) there is nothing to bridge.
  if (!fieldContext) return <>{children}</>;
  return <FieldBridgeInner>{children}</FieldBridgeInner>;
}

function FieldBridgeInner({ children }: { children: React.ReactNode }) {
  const { formItemId, formDescriptionId, formMessageId, error, required, hasDescription } =
    useFormField();
  const { claimRef, owner, registerControl, unregisterControl } = useFieldRegistry();
  const context = React.useMemo<FieldContextValue>(
    () => ({
      // FormLabel / FormControl use formItemId, so the id stays fixed here.
      controlId: formItemId,
      labelFor: formItemId,
      labelId: `${formItemId}-label`,
      descriptionId: hasDescription ? formDescriptionId : undefined,
      errorId: error ? formMessageId : undefined,
      invalid: Boolean(error),
      required,
      disabled: false,
      ownerToken: owner?.token ?? null,
      claimRef,
      registerControl,
      unregisterControl,
    }),
    [
      formItemId,
      formDescriptionId,
      formMessageId,
      error,
      required,
      hasDescription,
      owner,
      claimRef,
      registerControl,
      unregisterControl,
    ],
  );
  return <FieldContext.Provider value={context}>{children}</FieldContext.Provider>;
}

/* ─────────────────────── FormLabel ─────────────────────── */

function FormLabel({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>) {
  const { error, formItemId, required } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={error ? "" : undefined}
      id={`${formItemId}-label`}
      htmlFor={formItemId}
      className={cn(error && "text-destructive-text", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ms-0.5 text-destructive-text" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
}
FormLabel.displayName = "FormLabel";

/* ─────────────────────── FormControl ─────────────────────── */

/** Slot that wires id, `aria-describedby`, `aria-invalid` and `aria-required` onto its child. */
function FormControl(props: React.ComponentPropsWithoutRef<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId, required, hasDescription } =
    useFormField();
  const describedBy =
    [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedBy}
      aria-invalid={Boolean(error)}
      {...(required ? { "aria-required": true } : {})}
      {...props}
    />
  );
}
FormControl.displayName = "FormControl";

/* ─────────────────────── FormDescription / FormMessage ─────────────────────── */

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  const item = React.useContext(FormItemContext);
  const setHasDescription = item?.setHasDescription;
  React.useEffect(() => {
    setHasDescription?.(true);
    return () => setHasDescription?.(false);
  }, [setHasDescription]);
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("caption text-muted-foreground", className)}
      {...props}
    />
  );
}
FormDescription.displayName = "FormDescription";

/**
 * The field's validation message (or `children` when there is no error).
 * Always mounted with a stable id so `aria-describedby` never points nowhere.
 */
function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return <p id={formMessageId} hidden data-slot="form-message" />;
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      {...(error ? { role: "alert" } : {})}
      className={cn(
        "caption",
        error ? "text-destructive-text" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
}
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
export type { FormItemProps };
