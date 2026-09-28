"use client";

import {
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  type Ref,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { useProximityHover } from "../hooks/use-proximity-hover";
import { shapeMap } from "../lib/shape-context";
import { Elevated } from "../lib/elevated";

// Dropdown opts out of the global pill/rounded shape context — popover surfaces
// look cleaner with the smaller "rounded" radii regardless of how the rest of
// the UI is shaped (the heavy pill bubbling distorts perceived padding at this
// scale and produces the corner-shadow asymmetry).
const shape = shapeMap.rounded;

interface DropdownContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  checkedIndex?: number;
}

// Every menu-item flavour participates in arrow-key navigation.
const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]';

const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * @deprecated Internal plumbing of the deprecated `Dropdown`. Use `DropdownMenu`.
 */
export function useDropdown() {
  const ctx = useContext(DropdownContext);
  return ctx ?? { registerItem: () => undefined, activeIndex: null };
}

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  checkedIndex?: number;
}

/**
 * @deprecated Hand-rolled static menu surface (no trigger, focus management,
 * typeahead or collision handling). Use `DropdownMenu` / `DropdownMenuContent`
 * (Radix-based) instead. Kept for backward compatibility; will be removed in a
 * future major.
 */
function Dropdown({
  ref,
  children,
  checkedIndex,
  className,
  ...props
}: DropdownProps & { ref?: Ref<HTMLDivElement> | undefined }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, setActiveIndex, itemRects, session, handlers, registerItem, measureItems } =
    useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems, children]);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
  const checkedRect = checkedIndex != null ? itemRects[checkedIndex] : null;
  const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
  const isHoveringOther = activeIndex !== null && activeIndex !== checkedIndex;

  return (
    <DropdownContext.Provider
      value={
        checkedIndex === undefined
          ? { registerItem, activeIndex }
          : { registerItem, activeIndex, checkedIndex }
      }
    >
      <Elevated
        offset={2}
        shadowLevel={3}
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
          if (containerRef.current?.contains(e.relatedTarget as Node)) return;
          setFocusedIndex(null);
          setActiveIndex(null);
        }}
        onKeyDown={(e) => {
          const items = Array.from(
            containerRef.current?.querySelectorAll(MENU_ITEM_SELECTOR) ?? [],
          ) as HTMLElement[];
          const currentIdx = items.indexOf(e.target as HTMLElement);
          if (currentIdx === -1) return;

          if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
            e.preventDefault();
            const next = ["ArrowDown", "ArrowRight"].includes(e.key)
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
        role="menu"
        data-slot="dropdown"
        className={cn(
          `relative flex flex-col gap-0.5 w-72 max-w-full ${shape.container} p-1 select-none`,
          className,
        )}
        {...props}
      >
        {/* Selected background */}
        <AnimatePresence>
          {checkedRect && (
            <motion.div
              className={`absolute ${shape.bg} bg-active pointer-events-none`}
              initial={false}
              animate={{
                top: checkedRect.top,
                left: checkedRect.left,
                width: checkedRect.width,
                height: checkedRect.height,
                opacity: isHoveringOther ? 0.8 : 1,
              }}
              exit={{ opacity: 0, transition: spring.moderate.exit }}
              transition={{
                ...spring.moderate,
                opacity: { duration: 0.08 },
              }}
            />
          )}
        </AnimatePresence>

        {/* Hover background */}
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={session}
              className={`absolute ${shape.bg} bg-hover pointer-events-none`}
              initial={{
                opacity: 0,
                top: checkedRect?.top ?? activeRect.top,
                left: checkedRect?.left ?? activeRect.left,
                width: checkedRect?.width ?? activeRect.width,
                height: checkedRect?.height ?? activeRect.height,
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

        {children}
      </Elevated>
    </DropdownContext.Provider>
  );
}

Dropdown.displayName = "Dropdown";

// ---------------------------------------------------------------------------
// DropdownLabel
// ---------------------------------------------------------------------------

/** @deprecated Use `DropdownMenuLabel`. */
function DropdownLabel({ ref, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-label"
      className={cn("px-2 py-1.5 text-[11px] text-muted-foreground", className)}
      {...props}
    />
  );
}

DropdownLabel.displayName = "DropdownLabel";

// ---------------------------------------------------------------------------
// DropdownSeparator
// ---------------------------------------------------------------------------

/** @deprecated Use `DropdownMenuSeparator`. */
function DropdownSeparator({ ref, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-separator"
      role="separator"
      className={cn("my-1 -mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

DropdownSeparator.displayName = "DropdownSeparator";

export { Dropdown, DropdownLabel, DropdownSeparator };
export default Dropdown;
