"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ChangeEventHandler,
  type ComponentProps,
  type Ref,
} from "react";
import type { IconComponent } from "../lib/icon-context";
import { cn } from "../lib/utils";
import { fontWeights } from "../lib/font-weight";
import { useShape } from "../lib/shape-context";
import {
  controlHeightClass,
  controlInvalidWithinClasses,
  controlSurfaceClasses,
  controlTextClass,
  inputFocusWithinClasses,
  motionClasses,
} from "../lib/interaction";
import { isAriaInvalid, useFieldControl } from "../lib/field-context";

interface InputGroupContextValue {
  registerItem: (index: number, element: HTMLLabelElement | null) => void;
  activeIndex: number | null;
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

function useInputGroup() {
  const ctx = useContext(InputGroupContext);
  if (!ctx) throw new Error("useInputGroup must be used within an InputGroup");
  return ctx;
}

interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children?: ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  leadingAddon?: ReactNode;
  trailingAddon?: ReactNode;
  trailingAction?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingButton?: ReactNode;
  error?: boolean | string;
  disabled?: boolean;
  wrapperClassName?: string;
  pill?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  defaultValue?: InputHTMLAttributes<HTMLInputElement>["defaultValue"];
  /**
   * id of the built-in input. Inside a `<Field>` the input takes the field's
   * id, label, hint / error (`aria-describedby`), `aria-invalid`,
   * `aria-required` and `disabled` automatically, like `Input`.
   */
  id?: string;
  /** Marks the built-in input required (`required` + `aria-required`). */
  required?: boolean;
  /** Form field name of the built-in input. */
  name?: string;
  /**
   * Other props for the built-in `<input>` (`autoComplete`, `inputMode`,
   * `onBlur`, `maxLength`, a `ref` for react-hook-form's `register`, …).
   */
  inputProps?: Omit<ComponentProps<"input">, "className" | "value" | "defaultValue" | "onChange">;
  /** Accessible name. With a built-in input it names the input, otherwise the group. */
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

function InputGroup({
  children,
  className,
  placeholder,
  value,
  onChange,
  leadingAddon,
  trailingAddon,
  trailingAction,
  leadingIcon,
  trailingIcon,
  trailingButton,
  error,
  disabled,
  wrapperClassName,
  pill,
  type,
  defaultValue,
  id,
  required,
  name,
  inputProps,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: InputGroupProps) {
  const itemsRef = useRef(new Map<number, HTMLLabelElement>());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shape = useShape();

  const registerItem = useCallback((index: number, element: HTMLLabelElement | null) => {
    if (element) {
      itemsRef.current.set(index, element);
    } else {
      itemsRef.current.delete(index);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mouseY = e.clientY;

    let closestIndex: number | null = null;
    let closestDistance = Infinity;

    itemsRef.current.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(mouseY - itemCenterY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const rendersInput =
    placeholder !== undefined ||
    value !== undefined ||
    onChange !== undefined ||
    leadingAddon !== undefined ||
    trailingAddon !== undefined ||
    trailingAction !== undefined ||
    leadingIcon !== undefined ||
    trailingIcon !== undefined ||
    trailingButton !== undefined ||
    error !== undefined ||
    inputProps !== undefined ||
    name !== undefined;
  // Field wiring for the built-in input (`error` marks it invalid too). The
  // multi-field variant has no single input for a Field label to target.
  const fieldProps = useFieldControl(
    {
      id,
      disabled,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid ?? (error ? true : undefined),
      "aria-required": ariaRequired ?? (required ? true : undefined),
    },
    { labelable: rendersInput },
  );

  if (rendersInput) {
    const invalid = isAriaInvalid(fieldProps["aria-invalid"]);
    const isDisabled = fieldProps.disabled ?? false;
    return (
      <div
        ref={ref}
        data-slot="input-group"
        data-invalid={invalid ? "" : undefined}
        data-disabled={isDisabled ? "" : undefined}
        className={cn(
          // The wrapper is the control: the standard single-line height and
          // text size, the field surface, and the focus ring while the input
          // inside it has focus.
          "relative flex items-center gap-2 px-3 text-foreground",
          controlHeightClass,
          controlTextClass,
          controlSurfaceClasses,
          motionClasses,
          inputFocusWithinClasses,
          shape.input,
          "compact:h-6 compact:gap-1.5 compact:px-2 compact:text-[12px] compact:rounded-[5px]",
          controlInvalidWithinClasses,
          isDisabled && "cursor-not-allowed opacity-50",
          pill && "rounded-full",
          // A trailing button sits inset in the field, 4px from each edge.
          trailingButton !== undefined && "pe-1 compact:pe-0.5",
          wrapperClassName,
        )}
        {...props}
      >
        {leadingAddon && <span className="shrink-0 text-muted-foreground">{leadingAddon}</span>}
        {leadingIcon && <span className="shrink-0 text-muted-foreground">{leadingIcon}</span>}
        <input
          {...inputProps}
          {...fieldProps}
          data-slot="input-group-input"
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-label={ariaLabel}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
            (trailingAction || trailingIcon) && "pe-16",
            className,
          )}
        />
        {trailingAddon && <span className="shrink-0 text-muted-foreground">{trailingAddon}</span>}
        {trailingIcon && <span className="shrink-0 text-muted-foreground">{trailingIcon}</span>}
        {trailingButton !== undefined && (
          <span
            data-slot="input-group-button"
            className="flex shrink-0 items-center [&>[data-slot=button]]:h-7 compact:[&>[data-slot=button]]:h-5"
          >
            {trailingButton}
          </span>
        )}
        {trailingAction && (
          <span className="absolute end-2 top-1/2 -translate-y-1/2">{trailingAction}</span>
        )}
      </div>
    );
  }

  return (
    <InputGroupContext.Provider value={{ registerItem, activeIndex }}>
      <div
        ref={ref}
        data-slot="input-group"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        id={id}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("flex flex-col gap-3 w-72 max-w-full", className)}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

InputGroup.displayName = "InputGroup";

interface InputFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "index"
> {
  label: string;
  placeholder?: string;
  icon?: IconComponent;
  index: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLLabelElement>;
}

function InputField({
  label,
  placeholder,
  icon: Icon,
  index,
  value,
  onChange,
  error,
  disabled,
  className,
  ref,
  ...props
}: InputFieldProps) {
  const internalRef = useRef<HTMLLabelElement>(null);
  const { registerItem, activeIndex } = useInputGroup();
  const [isFocused, setIsFocused] = useState(false);
  const shape = useShape();

  useEffect(() => {
    registerItem(index, internalRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const isActive = activeIndex === index;
  const labelActive = isActive || isFocused;

  const errorId = error ? `input-error-${index}` : undefined;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Input container classes
  let bgClass: string;
  let ringClass: string;

  if (disabled) {
    bgClass = "bg-transparent";
    ringClass = "ring-border";
  } else if (error) {
    bgClass = isFocused ? "bg-card" : isActive ? "bg-destructive/10" : "bg-transparent";
    ringClass = isFocused || isActive ? "ring-destructive/50" : "ring-transparent";
  } else if (isFocused) {
    bgClass = "bg-card";
    ringClass = "ring-border";
  } else if (isActive) {
    bgClass = "bg-muted/50";
    ringClass = "ring-border";
  } else {
    bgClass = "bg-transparent";
    ringClass = "ring-transparent";
  }

  return (
    <label
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLLabelElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLLabelElement | null>).current = node;
      }}
      data-slot="input-field"
      className={cn(
        "flex flex-col gap-1 cursor-text",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {/* Label */}
      <span className="inline-grid text-[13px] ps-3">
        <span
          className="col-start-1 row-start-1 invisible"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1",
            error ? "text-destructive" : "text-muted-foreground",
          )}
          style={{
            fontVariationSettings: fontWeights.normal,
          }}
        >
          {label}
        </span>
      </span>

      {/* Input container */}
      <div
        className={cn(
          `flex items-center gap-2 ${shape.input} px-3 ring-1 transition-all duration-80`,
          controlHeightClass,
          bgClass,
          ringClass,
        )}
      >
        {Icon && (
          <Icon
            size={16}
            strokeWidth={labelActive ? 2 : 1.5}
            className={cn(
              "shrink-0 transition-[color,stroke-width] duration-80",
              labelActive ? "text-foreground" : "text-muted-foreground",
            )}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-[inherit]"
          style={{ fontVariationSettings: fontWeights.normal }}
          {...props}
        />
      </div>

      {/* Error message */}
      {error && (
        <span
          id={errorId}
          className="text-[12px] text-destructive ps-3"
          style={{ fontVariationSettings: fontWeights.medium }}
        >
          {error}
        </span>
      )}
    </label>
  );
}

InputField.displayName = "InputField";

export { InputGroup, InputField };
export default InputGroup;
