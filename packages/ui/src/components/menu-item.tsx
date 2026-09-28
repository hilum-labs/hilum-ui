"use client";

import {
  useRef,
  useEffect,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import type { IconComponent } from "../lib/icon-context";
import { motion, AnimatePresence } from "../lib/motion";
import { useDropdown } from "./dropdown";
import { cn } from "../lib/utils";
import { fontWeights } from "../lib/font-weight";
import { shapeMap } from "../lib/shape-context";

// MenuItem is only used inside Dropdown, which opts out of the global pill
// shape — see dropdown.tsx for the rationale.
const shape = shapeMap.rounded;

/** ARIA flavour of a menu row. */
type MenuItemType = "item" | "radio" | "checkbox";

const MENU_ITEM_ROLES: Record<MenuItemType, "menuitem" | "menuitemradio" | "menuitemcheckbox"> = {
  item: "menuitem",
  radio: "menuitemradio",
  checkbox: "menuitemcheckbox",
};

interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional leading icon. When omitted, the row renders text-only with no
   *  reserved icon column. */
  icon?: IconComponent | ReactNode;
  label?: string;
  index?: number;
  checked?: boolean;
  /**
   * ARIA semantics of the row:
   * - `"item"` → `role="menuitem"` (a plain action, no `aria-checked`)
   * - `"radio"` → `role="menuitemradio"` (one-of-many selection)
   * - `"checkbox"` → `role="menuitemcheckbox"` (independent toggle)
   *
   * Defaults to `"radio"` when the row carries selection state — `checked` is
   * passed or the parent `<Dropdown>` has a `checkedIndex` — otherwise `"item"`.
   */
  type?: MenuItemType;
  onSelect?: () => void;
  trailing?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * @deprecated Row for the deprecated `Dropdown`. Use `DropdownMenuItem`,
 * `DropdownMenuCheckboxItem` or `DropdownMenuRadioItem` inside
 * `DropdownMenuContent` instead. Kept for backward compatibility; will be
 * removed in a future major.
 */
function MenuItem({
  icon: Icon,
  label,
  index = 0,
  checked,
  type,
  onSelect,
  trailing,
  className,
  children,
  ref,
  ...props
}: MenuItemProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const { registerItem, activeIndex, checkedIndex } = useDropdown();

  useEffect(() => {
    registerItem(index, internalRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const resolvedType: MenuItemType =
    type ?? (checked !== undefined || checkedIndex !== undefined ? "radio" : "item");
  const role = MENU_ITEM_ROLES[resolvedType];
  const isActive = activeIndex === index;

  return (
    <div
      ref={(node) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      data-slot="menu-item"
      data-proximity-index={index}
      tabIndex={index === (checkedIndex ?? 0) ? 0 : -1}
      role={role}
      aria-checked={resolvedType === "item" ? undefined : !!checked}
      aria-label={label ?? (typeof children === "string" ? children : undefined)}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        `relative z-10 flex items-center gap-2 ${shape.item} px-2 py-2 cursor-pointer outline-none`,
        className,
      )}
      {...props}
    >
      {Icon && typeof Icon === "function" && (
        <span className="inline-grid">
          <span className="col-start-1 row-start-1 invisible">
            <Icon size={16} strokeWidth={2} />
          </span>
          <Icon
            size={16}
            strokeWidth={isActive || checked ? 2 : 1.5}
            className={cn(
              "col-start-1 row-start-1 transition-[color,stroke-width] duration-80",
              isActive || checked ? "text-foreground" : "text-muted-foreground",
            )}
          />
        </span>
      )}
      {Icon && isValidElement(Icon) && <span className="text-muted-foreground">{Icon}</span>}
      <span className="inline-grid flex-1 text-[13px]">
        <span
          className="col-start-1 row-start-1 invisible"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label ?? children}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-80",
            isActive || checked ? "text-foreground" : "text-muted-foreground",
          )}
          style={{
            fontVariationSettings: checked ? fontWeights.semibold : fontWeights.normal,
          }}
        >
          {label ?? children}
        </span>
      </span>
      {trailing && <span className="text-[12px] text-muted-foreground">{trailing}</span>}
      {/* initial={false}: a row that mounts already checked shows the check without drawing it. */}
      <AnimatePresence initial={false}>
        {checked && (
          <motion.svg
            key="check"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground shrink-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
            <motion.path
              d="M4 12L9 17L20 6"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: 1,
                transition: { duration: 0.08, ease: "easeOut" },
              }}
              exit={{
                pathLength: 0,
                transition: { duration: 0.04, ease: "easeIn" },
              }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

MenuItem.displayName = "MenuItem";

export { MenuItem };
export type { MenuItemProps, MenuItemType };
export default MenuItem;
