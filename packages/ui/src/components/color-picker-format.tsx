"use client";

import { useCallback, useContext, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useShape } from "../lib/shape-context";
import { useIcon } from "../lib/icon-context";
import { Dropdown, useDropdown } from "./dropdown";
import { type ColorFormat } from "../lib/color";
import { ColorPickerPortalContainerContext } from "./color-picker-controls";

// ---------------------------------------------------------------------------
// FormatDropdown (custom, lightweight)
// ---------------------------------------------------------------------------

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
  oklch: "OKLCH",
};

function FormatItem({
  index,
  label,
  checked,
  onSelect,
}: {
  index: number;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { registerItem, activeIndex, checkedIndex } = useDropdown();
  const shape = useShape();

  useEffect(() => {
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const isActive = activeIndex === index;

  return (
    <div
      ref={ref}
      data-proximity-index={index}
      role="menuitemradio"
      aria-checked={checked}
      aria-label={label}
      tabIndex={index === (checkedIndex ?? 0) ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        `relative z-10 flex items-center px-3 py-2 text-[13px] cursor-pointer outline-none`,
        shape.item,
      )}
    >
      <span className="inline-grid">
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
            isActive || checked ? "text-foreground" : "text-muted-foreground",
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

export function FormatDropdown({
  value,
  onChange,
  open: openProp,
  defaultOpen = false,
}: {
  value: ColorFormat;
  onChange: (f: ColorFormat) => void;
  open?: boolean;
  defaultOpen?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      if (isControlled) return;
      setInternalOpen(next);
    },
    [isControlled],
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const portalContainer = useContext(ColorPickerPortalContainerContext);
  const [pos, setPos] = useState<
    | { mode: "fixed"; top: number; left: number; width: number }
    | { mode: "absolute"; top: number; left: number; width: number }
    | null
  >(null);

  useEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    const triggerRect = triggerRef.current.getBoundingClientRect();
    if (portalContainer) {
      const cRect = portalContainer.getBoundingClientRect();
      const cWidth = portalContainer.offsetWidth;
      const scale = cWidth > 0 ? cRect.width / cWidth : 1;
      // Convert viewport coords into the portal container's pre-scale frame so
      // an ancestor CSS scale visually scales the menu alongside the trigger.
      setPos({
        mode: "absolute",
        top: (triggerRect.bottom - cRect.top) / scale + 6,
        left: (triggerRect.left - cRect.left) / scale,
        width: triggerRect.width / scale,
      });
    } else {
      setPos({
        mode: "fixed",
        top: triggerRect.bottom + 6,
        left: triggerRect.left,
        width: triggerRect.width,
      });
    }
  }, [open, portalContainer]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const formats = ["hex", "rgb", "hsl", "oklch"] as const;
  const checkedIdx = formats.indexOf(value);
  const ChevronDownIcon = useIcon("chevron-down");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center justify-between gap-1.5 h-6 min-w-[4.5rem] ps-2 pe-1.5 text-[12px] rounded-[5px] border border-border bg-background text-foreground",
          "hover:border-border-strong transition-colors duration-80 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
          open && "border-border-strong bg-active",
        )}
        style={{ fontVariationSettings: fontWeights.medium }}
      >
        <span>{FORMAT_LABELS[value]}</span>
        <ChevronDownIcon
          size={12}
          strokeWidth={1.5}
          className={cn(
            "text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: pos.mode,
              top: pos.top,
              left: pos.left,
              zIndex: 60,
            }}
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              transition={spring.fast}
              style={{ transformOrigin: "top center", minWidth: pos.width }}
            >
              <Dropdown checkedIndex={checkedIdx} className="!w-auto min-w-full">
                {formats.map((fmt, i) => (
                  <FormatItem
                    key={fmt}
                    index={i}
                    label={FORMAT_LABELS[fmt]}
                    checked={value === fmt}
                    onSelect={() => {
                      onChange(fmt);
                      setOpen(false);
                    }}
                  />
                ))}
              </Dropdown>
            </motion.div>
          </div>,
          portalContainer ?? document.body,
        )}
    </>
  );
}
