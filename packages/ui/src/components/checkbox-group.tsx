"use client";

import {
  Children,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  type Ref,
  isValidElement,
  cloneElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useProximityHover } from "../hooks/use-proximity-hover";
import { useMergeSplitBlocks, useStableRuns, SelectionBackgrounds } from "../hooks/use-merge-split";
import { useShape } from "../lib/shape-context";

interface CheckboxGroupContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

function useCheckboxGroup() {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) throw new Error("useCheckboxGroup must be used within a CheckboxGroup");
  return ctx;
}

interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  checkedIndices?: Set<number>;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

function CheckboxGroup({
  ref,
  children,
  checkedIndices,
  options,
  value = [],
  onValueChange,
  className,
  ...props
}: CheckboxGroupProps & { ref?: Ref<HTMLDivElement> | undefined }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { activeIndex, setActiveIndex, itemRects, session, handlers, registerItem, measureItems } =
    useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems, children]);

  const optionCheckedIndices = new Set(
    options
      ?.map((option, index) => (value.includes(option.value) ? index : -1))
      .filter((index) => index >= 0) ?? [],
  );
  const resolvedCheckedIndices = checkedIndices ?? optionCheckedIndices;
  // Contiguous checked runs with stable IDs (so a run morphs as it grows).
  const checkedGroups = useStableRuns(resolvedCheckedIndices);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
  const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
  const isHoveringOther = activeIndex !== null && !resolvedCheckedIndices.has(activeIndex);
  const shape = useShape();

  // Selected backgrounds, with the merge/split boundary animation when one
  // unchecked row bridges or splits two checked runs.
  const blocks = useMergeSplitBlocks(checkedGroups, itemRects, shape.mergedRadius);
  const renderedChildren =
    options?.map((option, index) => (
      <CheckboxItem
        key={option.value}
        index={index}
        label={option.label}
        checked={value.includes(option.value)}
        onToggle={() => {
          if (option.disabled) return;
          const next = value.includes(option.value)
            ? value.filter((item) => item !== option.value)
            : [...value, option.value];
          onValueChange?.(next);
        }}
        aria-disabled={option.disabled || undefined}
      />
    )) ??
    Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;
      const childProps = child.props as { index?: number };
      if (childProps.index !== undefined) return child;
      return cloneElement(child, { index } as Record<string, unknown>);
    });

  return (
    <CheckboxGroupContext.Provider value={{ registerItem, activeIndex }}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- roving-focus group: focus/key events bubble up from the focusable checkbox rows */}
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
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
          // Don't clear hover when focus moves to another item within the group
          if (containerRef.current?.contains(e.relatedTarget as Node)) return;
          setFocusedIndex(null);
          setActiveIndex(null);
        }}
        onKeyDown={(e) => {
          // Scope to row wrappers (the items carrying data-proximity-index).
          const items = Array.from(
            containerRef.current?.querySelectorAll("[data-proximity-index]") ?? [],
          ) as HTMLElement[];
          const currentIdx = items.indexOf(e.target as HTMLElement);
          if (currentIdx === -1) return;

          if (["ArrowDown", "ArrowUp"].includes(e.key)) {
            e.preventDefault();
            const next =
              e.key === "ArrowDown"
                ? (currentIdx + 1) % items.length
                : (currentIdx - 1 + items.length) % items.length;
            items[next]?.focus();
          } else if (e.key === "Home") {
            e.preventDefault();
            items[0]?.focus();
          } else if (e.key === "End") {
            e.preventDefault();
            items[items.length - 1]?.focus();
          }
        }}
        role="group"
        data-slot="checkbox-group"
        className={cn("relative flex flex-col w-72 max-w-full select-none", className)}
        {...props}
      >
        {/* Selected backgrounds (merged for contiguous checked items).
              A run is normally one block; mid merge/split it is drawn as two
              abutting halves — see useMergeSplitBlocks. */}
        <SelectionBackgrounds blocks={blocks} dimmed={isHoveringOther} />

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

        {renderedChildren}
      </div>
    </CheckboxGroupContext.Provider>
  );
}

CheckboxGroup.displayName = "CheckboxGroup";

interface CheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  index: number;
  checked: boolean;
  onToggle: () => void;
}

function CheckboxItem({
  ref,
  label,
  index,
  checked,
  onToggle,
  className,
  ...props
}: CheckboxItemProps & { ref?: Ref<HTMLDivElement> | undefined }) {
  const internalRef = useRef<HTMLDivElement>(null);
  const { registerItem, activeIndex } = useCheckboxGroup();

  useEffect(() => {
    registerItem(index, internalRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const isActive = activeIndex === index;
  const shape = useShape();

  return (
    <div
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      data-slot="checkbox-item"
      data-proximity-index={index}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        `relative z-10 flex items-center gap-2.5 ${shape.item} px-3 py-1.5 cursor-pointer outline-none`,
        className,
      )}
      {...props}
    >
      {/* Check box — purely visual: the row is the role="checkbox" control
          (a nested checkbox button was nested-interactive). */}
      <span
        aria-hidden="true"
        data-state={checked ? "checked" : "unchecked"}
        className="relative w-[15px] h-[15px] shrink-0"
      >
        {/* Border */}
        <div
          className={cn(
            "absolute inset-0 rounded-[5px] border-solid transition-all duration-80",
            checked
              ? "border-[1.5px] border-transparent"
              : isActive
                ? "border-[1.5px] border-neutral-400 dark:border-neutral-500"
                : "border-[1.5px] border-border",
          )}
        />
        {/* Check mark — initial={false}: already checked on mount = no draw-in. */}
        <AnimatePresence initial={false}>
          {checked && (
            <motion.svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            >
              <motion.path
                d="M6 12L10 16L18 8"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  transition: {
                    duration: 0.08,
                    ease: "easeOut",
                  },
                }}
                exit={{
                  pathLength: 0,
                  transition: {
                    duration: 0.04,
                    ease: "easeIn",
                  },
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>

      {/* Label */}
      <span className="inline-grid text-[13px]">
        <span
          className="col-start-1 row-start-1 invisible"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80",
            checked || isActive ? "text-foreground" : "text-muted-foreground",
          )}
          style={{
            fontVariationSettings: checked ? fontWeights.semibold : fontWeights.normal,
          }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}

CheckboxItem.displayName = "CheckboxItem";

export { CheckboxGroup, CheckboxItem };
export default CheckboxGroup;
