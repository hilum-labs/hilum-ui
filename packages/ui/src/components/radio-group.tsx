"use client";

import {
  Children,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  isValidElement,
  cloneElement,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import { motion, AnimatePresence } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useProximityHover } from "../hooks/use-proximity-hover";
import { useShape } from "../lib/shape-context";

interface RadioGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  selectedIndex: number | null;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  /** Index of the item that takes the roving tab stop. */
  tabbableIndex: number;
  /** Whole group disabled. */
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("useRadioGroup must be used within a RadioGroup");
  return ctx;
}

interface RadioGroupProps extends Omit<ComponentProps<"div">, "onSelect"> {
  children: ReactNode;
  selectedIndex?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Form field name. When set, the selected value is submitted with the
   * surrounding native `<form>` (nothing is submitted while no item is selected,
   * matching native radios). Value mode only.
   */
  name?: string;
  /** Native constraint validation: the form won't submit until an item is selected. */
  required?: boolean;
  /** Disables every item: not focusable, not selectable, excluded from submission. */
  disabled?: boolean;
  /** Associates the hidden form input with a `<form>` by id (native `form` attribute). */
  form?: string;
}

interface ChildInfo {
  value: string | undefined;
  disabled: boolean;
}

function isRtl(node: HTMLElement | null, dir: string | undefined): boolean {
  if (dir === "rtl") return true;
  if (dir === "ltr") return false;
  const closest = node?.closest("[dir]")?.getAttribute("dir");
  if (closest) return closest === "rtl";
  if (node && typeof getComputedStyle === "function") {
    return getComputedStyle(node).direction === "rtl";
  }
  return false;
}

const visuallyHiddenInput: React.CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  opacity: 0,
  margin: 0,
  width: 1,
  height: 1,
  insetInlineStart: 0,
  bottom: 0,
};

function RadioGroup({
  ref,
  children,
  selectedIndex,
  value,
  defaultValue,
  onValueChange,
  name,
  required = false,
  disabled = false,
  form,
  dir,
  className,
  ...props
}: RadioGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const childInfo: ChildInfo[] = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const childProps = child.props as { value?: string; disabled?: boolean };
      return { value: childProps.value, disabled: disabled || childProps.disabled === true };
    });
  const childValues = childInfo.map((c) => c.value);
  const { activeIndex, setActiveIndex, itemRects, session, handlers, registerItem, measureItems } =
    useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems, children]);

  // Native form reset restores the uncontrolled default, like native radios.
  useEffect(() => {
    const formEl = hiddenInputRef.current?.form;
    if (!formEl) return;
    const onReset = () => setUncontrolledValue(defaultValue);
    formEl.addEventListener("reset", onReset);
    return () => formEl.removeEventListener("reset", onReset);
  }, [defaultValue, form, name]);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const resolvedSelectedIndex =
    currentValue !== undefined
      ? childValues.findIndex((childValue) => childValue === currentValue)
      : (selectedIndex ?? -1);

  // Roving tab stop: the selected item, else the first enabled one, so the
  // group is always reachable with Tab even when nothing is selected.
  const firstEnabledIndex = childInfo.findIndex((c) => !c.disabled);
  const tabbableIndex =
    resolvedSelectedIndex >= 0 && !childInfo[resolvedSelectedIndex]?.disabled
      ? resolvedSelectedIndex
      : firstEnabledIndex;

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
  const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
  const selectedRect = resolvedSelectedIndex >= 0 ? itemRects[resolvedSelectedIndex] : null;
  const isHoveringOther = activeIndex !== null && activeIndex !== resolvedSelectedIndex;
  const shape = useShape();

  const indexedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, { index } as Record<string, unknown>);
  });

  const handleValueChange = (nextValue: string) => {
    if (disabled) return;
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
  };

  const submitsValue = name !== undefined || required;

  const content = (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabindex per WAI-ARIA APG: the radios are focusable, the radiogroup container is not
    <div
      ref={setRefs}
      onMouseEnter={handlers.onMouseEnter}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      onFocus={(e) => {
        const indexAttr = (e.target as HTMLElement)
          .closest("[data-proximity-index]")
          ?.getAttribute("data-proximity-index");
        if (indexAttr != null) {
          const idx = Number(indexAttr);
          setActiveIndex(idx);
          setFocusedIndex((e.target as HTMLElement).matches(":focus-visible") ? idx : null);
        }
      }}
      onBlur={(e) => {
        if (containerRef.current?.contains(e.relatedTarget as Node)) return;
        setFocusedIndex(null);
        setActiveIndex(null);
      }}
      onKeyDown={(e) => {
        // Disabled items are skipped by arrow keys, Home and End.
        const items = (
          Array.from(
            containerRef.current?.querySelectorAll('[role="radio"]') ?? [],
          ) as HTMLElement[]
        ).filter((item) => item.getAttribute("aria-disabled") !== "true");
        const currentIdx = items.indexOf(e.target as HTMLElement);
        if (currentIdx === -1) return;

        if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
          e.preventDefault();
          // Horizontal arrows follow reading direction: in RTL, ArrowLeft moves forward.
          const forwardKeys = isRtl(containerRef.current, dir)
            ? ["ArrowDown", "ArrowLeft"]
            : ["ArrowDown", "ArrowRight"];
          const next = forwardKeys.includes(e.key)
            ? (currentIdx + 1) % items.length
            : (currentIdx - 1 + items.length) % items.length;
          items[next]?.focus();
          items[next]?.click();
        } else if (e.key === "Home") {
          e.preventDefault();
          items[0]?.focus();
          items[0]?.click();
        } else if (e.key === "End") {
          e.preventDefault();
          items[items.length - 1]?.focus();
          items[items.length - 1]?.click();
        }
      }}
      role="radiogroup"
      dir={dir}
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      data-slot="radio-group"
      data-disabled={disabled ? "" : undefined}
      className={cn("relative flex flex-col w-72 max-w-full select-none", className)}
      {...props}
    >
      {/* Selected background */}
      {selectedRect && (
        <motion.div
          className={`absolute ${shape.bg} bg-active pointer-events-none`}
          initial={false}
          animate={{
            top: selectedRect.top,
            left: selectedRect.left,
            width: selectedRect.width,
            height: selectedRect.height,
            opacity: isHoveringOther ? 0.8 : 1,
          }}
          transition={{
            ...spring.moderate,
            opacity: { duration: 0.08 },
          }}
        />
      )}

      {/* Hover background */}
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={session}
            className={`absolute ${shape.bg} bg-hover pointer-events-none`}
            initial={{
              opacity: 0,
              top: activeRect.top,
              left: activeRect.left,
              width: activeRect.width,
              height: activeRect.height,
            }}
            animate={{
              opacity: 1,
              top: activeRect.top,
              left: activeRect.left,
              width: activeRect.width,
              height: activeRect.height,
            }}
            exit={{ opacity: 0, transition: spring.fast.exit }}
            transition={{
              ...spring.fast,
              opacity: { duration: 0.08 },
            }}
          />
        )}
      </AnimatePresence>

      {/* Focus ring */}
      <AnimatePresence>
        {focusRect && (
          <motion.div
            className={`absolute ${shape.focusRing} pointer-events-none z-20 border-2 border-ring`}
            initial={false}
            animate={{
              left: focusRect.left - 2,
              top: focusRect.top - 2,
              width: focusRect.width + 4,
              height: focusRect.height + 4,
            }}
            exit={{ opacity: 0, transition: spring.fast.exit }}
            transition={{
              ...spring.fast,
              opacity: { duration: 0.08 },
            }}
          />
        )}
      </AnimatePresence>

      {indexedChildren}

      {/*
          Native form participation. A visually hidden text input (not
          type="hidden", which is barred from constraint validation) carries the
          selected value; `name` is dropped while nothing is selected so an empty
          group submits nothing, like native radios. Invalid -> focus the group.
        */}
      {submitsValue && (
        <input
          ref={hiddenInputRef}
          type="text"
          aria-hidden="true"
          tabIndex={-1}
          data-slot="radio-group-input"
          name={currentValue ? name : undefined}
          value={currentValue ?? ""}
          form={form}
          required={required}
          disabled={disabled}
          onChange={() => {}}
          onInvalid={() => {
            const target = containerRef.current?.querySelector<HTMLElement>(
              '[role="radio"][tabindex="0"]',
            );
            target?.focus();
          }}
          style={visuallyHiddenInput}
        />
      )}
    </div>
  );

  // Value mode (value/defaultValue given): items select by `value`.
  // Index mode: items are driven by `selectedIndex` / their own `selected`.
  const contextValue: RadioGroupContextValue =
    currentValue !== undefined
      ? {
          registerItem,
          activeIndex,
          selectedIndex: resolvedSelectedIndex >= 0 ? resolvedSelectedIndex : null,
          selectedValue: currentValue,
          onValueChange: handleValueChange,
          tabbableIndex,
          disabled,
        }
      : {
          registerItem,
          activeIndex,
          selectedIndex: selectedIndex ?? null,
          tabbableIndex,
          disabled,
        };

  return <RadioGroupContext.Provider value={contextValue}>{content}</RadioGroupContext.Provider>;
}

RadioGroup.displayName = "RadioGroup";

interface RadioItemProps extends Omit<ComponentProps<"div">, "onSelect"> {
  label?: string;
  index?: number;
  selected?: boolean;
  onSelect?: () => void;
  value?: string;
  /** Not focusable or selectable; skipped by arrow-key navigation. */
  disabled?: boolean;
}

function RadioItem({
  ref,
  label,
  index = 0,
  selected,
  onSelect,
  value,
  disabled: itemDisabled = false,
  className,
  children,
  ...props
}: RadioItemProps & { ref?: Ref<HTMLDivElement> }) {
  const internalRef = useRef<HTMLDivElement>(null);
  const {
    registerItem,
    activeIndex,
    selectedIndex,
    selectedValue,
    onValueChange,
    tabbableIndex,
    disabled: groupDisabled,
  } = useRadioGroupContext();
  const disabled = groupDisabled || itemDisabled;

  useEffect(() => {
    registerItem(index, internalRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const isActive = activeIndex === index;
  const shape = useShape();
  const isSelected =
    value !== undefined && selectedValue !== undefined
      ? selectedValue === value
      : (selected ?? selectedIndex === index);

  const handleSelect = () => {
    if (disabled) return;
    if (value !== undefined) {
      onValueChange?.(value);
    }
    onSelect?.();
  };

  return (
    <div
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
      }}
      data-proximity-index={index}
      data-slot="radio-group-item"
      data-state={isSelected ? "checked" : "unchecked"}
      data-disabled={disabled ? "" : undefined}
      tabIndex={!disabled && index === tabbableIndex ? 0 : -1}
      role="radio"
      aria-checked={isSelected}
      aria-disabled={disabled || undefined}
      aria-label={label ?? (typeof children === "string" ? children : value)}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={cn(
        `relative z-10 flex items-center gap-2.5 ${shape.item} px-3 py-1.5 cursor-pointer outline-none`,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {/* Radio circle */}
      <div className="relative w-[15px] h-[15px] shrink-0">
        {/* Border */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-solid transition-all duration-80",
            isSelected
              ? "border-[1.5px] border-transparent"
              : isActive
                ? "border-[1.5px] border-neutral-400 dark:border-neutral-500"
                : "border-[1.5px] border-border",
          )}
        />
        {/* Dot */}
        {/* initial={false}: a dot that is selected on mount appears without animating. */}
        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.04 } }}
              transition={spring.fast}
            >
              <div className="size-2 rounded-full bg-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <span className="inline-grid text-[13px]">
        <span
          className="col-start-1 row-start-1 invisible"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label ?? children ?? value}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80",
            isSelected || isActive ? "text-foreground" : "text-muted-foreground",
          )}
          style={{
            fontVariationSettings: isSelected ? fontWeights.semibold : fontWeights.normal,
          }}
        >
          {label ?? children ?? value}
        </span>
      </span>
    </div>
  );
}

RadioItem.displayName = "RadioItem";

const RadioGroupItem = RadioItem;

export { RadioGroup, RadioItem, RadioGroupItem };
export type { RadioGroupProps, RadioItemProps };
export default RadioGroup;
