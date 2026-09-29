"use client";

import { useRef, useState, useEffect, useCallback, type HTMLAttributes, type Ref } from "react";
import { motion, useMotionValue, animate, type Transition } from "../lib/motion";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { useFieldControl } from "../lib/field-context";

interface SwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  /** Disables the switch. Inside a `<Field disabled>` it is disabled unless set explicitly. */
  disabled?: boolean;
  /**
   * id of the switch button (the labelable element), e.g. for a
   * `<label htmlFor>`. Inside a `<Field>` the field's label targets it.
   */
  id?: string;
  thumbTransition?: Transition;
  ref?: Ref<HTMLDivElement>;
}

const TRACK_WIDTH = 34;
const TRACK_HEIGHT = 20;
const THUMB_SIZE = 16;
const THUMB_OFFSET = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET * 2;
const PILL_EXTEND = 2;
const PRESS_EXTEND = 4;
const PRESS_SHRINK = 4;
const DRAG_DEAD_ZONE = 2;

function Switch({
  ref,
  label,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onToggle,
  disabled: disabledProp,
  thumbTransition,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: SwitchProps) {
  const fieldProps = useFieldControl({
    id,
    disabled: disabledProp,
    "aria-label": ariaLabel ?? label,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  });
  const disabled = fieldProps.disabled ?? false;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const checked = checkedProp ?? uncontrolledChecked;
  const hasMounted = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Drag refs (not state to avoid re-renders during drag)
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const pointerStart = useRef<{
    clientX: number;
    originX: number;
  } | null>(null);

  // Motion value for thumb x-axis
  const motionX = useMotionValue(checked ? THUMB_OFFSET + THUMB_TRAVEL : THUMB_OFFSET);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  // Compute thumb shape
  const thumbWidth = pressed
    ? THUMB_SIZE + PRESS_EXTEND
    : hovered
      ? THUMB_SIZE + PILL_EXTEND
      : THUMB_SIZE;
  const thumbHeight = pressed ? THUMB_SIZE - PRESS_SHRINK : THUMB_SIZE;
  const thumbY = pressed ? THUMB_OFFSET + PRESS_SHRINK / 2 : THUMB_OFFSET;
  const extraWidth = thumbWidth - THUMB_SIZE;
  const thumbX = checked ? THUMB_OFFSET + THUMB_TRAVEL - extraWidth : THUMB_OFFSET;

  const setChecked = useCallback(
    (nextChecked: boolean) => {
      if (checkedProp === undefined) setUncontrolledChecked(nextChecked);
      onCheckedChange?.(nextChecked);
      onToggle?.(nextChecked);
    },
    [checkedProp, onCheckedChange, onToggle],
  );

  // Sync motionX when thumbX changes (hover/press/checked) and not dragging
  useEffect(() => {
    if (dragging.current) return;
    if (!hasMounted.current) {
      motionX.set(thumbX);
    } else {
      animate(motionX, thumbX, thumbTransition ?? spring.moderate);
    }
  }, [thumbX, motionX, thumbTransition]);

  // --- Pointer handlers ---

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      setPressed(true);
      dragging.current = false;
      didDrag.current = false;
      pointerStart.current = {
        clientX: e.clientX,
        originX: motionX.get(),
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [disabled, motionX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerStart.current) return;
      const delta = e.clientX - pointerStart.current.clientX;

      if (!dragging.current) {
        if (Math.abs(delta) < DRAG_DEAD_ZONE) return;
        dragging.current = true;
      }

      const dragMin = THUMB_OFFSET;
      const pressedThumbWidth = THUMB_SIZE + PRESS_EXTEND;
      const dragMax = TRACK_WIDTH - THUMB_OFFSET - pressedThumbWidth;
      const rawX = pointerStart.current.originX + delta;
      motionX.set(Math.max(dragMin, Math.min(dragMax, rawX)));
    },
    [motionX],
  );

  const handlePointerUp = useCallback(() => {
    if (!pointerStart.current) return;
    setPressed(false);

    if (dragging.current) {
      didDrag.current = true;
      dragging.current = false;

      const currentX = motionX.get();
      const dragMin = THUMB_OFFSET;
      const pressedThumbWidth = THUMB_SIZE + PRESS_EXTEND;
      const dragMax = TRACK_WIDTH - THUMB_OFFSET - pressedThumbWidth;
      const midpoint = (dragMin + dragMax) / 2;

      const shouldBeOn = currentX > midpoint;

      if (shouldBeOn !== checked) {
        setChecked(shouldBeOn);
      } else {
        // Snap back to current resting position (un-pressed)
        const snapTarget = checked ? THUMB_OFFSET + THUMB_TRAVEL : THUMB_OFFSET;
        animate(motionX, snapTarget, thumbTransition ?? spring.moderate);
      }

      requestAnimationFrame(() => {
        didDrag.current = false;
      });
    }

    pointerStart.current = null;
  }, [checked, setChecked, motionX, thumbTransition]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pointer/drag convenience on the row; the switch button inside is the keyboard-accessible control
    <div
      ref={ref}
      data-slot="switch"
      className={cn(
        "relative z-10 flex items-center gap-2.5 px-3 py-2 cursor-pointer select-none touch-none",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => {
        if (disabled || didDrag.current) return;
        setChecked(!checked);
      }}
      {...props}
    >
      {/* Switch */}
      <SwitchPrimitive.Root
        {...fieldProps}
        checked={checked}
        aria-label={ariaLabel ?? label}
        onCheckedChange={(nextChecked) => {
          if (didDrag.current) return;
          setChecked(nextChecked);
        }}
        disabled={disabled}
        tabIndex={0}
        className={cn(
          "relative shrink-0 rounded-full outline-none cursor-pointer",
          "transition-colors duration-80",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Error state: a destructive outline around the track; focus keeps its ring.
          "aria-invalid:outline-solid aria-invalid:outline-2 aria-invalid:outline-offset-1 aria-invalid:outline-destructive",
        )}
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          backgroundColor: checked
            ? hovered
              ? "color-mix(in oklab, var(--primary), var(--foreground) 12%)"
              : "var(--primary)"
            : hovered
              ? "color-mix(in oklab, var(--foreground) 22%, transparent)"
              : "color-mix(in oklab, var(--foreground) 15%, transparent)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SwitchPrimitive.Thumb asChild>
          <motion.span
            className="absolute top-0 left-0 block rounded-full bg-white shadow-sm"
            initial={false}
            style={{ x: motionX }}
            animate={{
              y: thumbY,
              width: thumbWidth,
              height: thumbHeight,
            }}
            // `initial={false}` already skips the mount animation, so no ref read is needed here.
            transition={thumbTransition ?? spring.moderate}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>

      {/* Label */}
      {label && (
        <span
          className={cn(
            "text-[13px] transition-[color] duration-80",
            checked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
