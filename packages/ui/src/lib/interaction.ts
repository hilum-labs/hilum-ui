import * as React from "react";

export const motionClasses =
  "transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-150 ease-out motion-reduce:transition-none";

export const springMotionClasses =
  "transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 ease-[cubic-bezier(0.2,0.9,0.2,1.15)] motion-reduce:transition-none";

export const pressClasses = "active:scale-[0.97] motion-reduce:active:scale-100";

/**
 * The one size for single-line form controls at the default density: 36px tall
 * with 14px text. Input, SearchInput, Select, NativeSelect, Combobox,
 * InputNumber, InputGroup, ColorInput, TimePicker and the DatePicker /
 * DateRangePicker triggers all use these, so a row of mixed controls lines up
 * (and Buttons placed next to them in DS compositions use the same height).
 * The editor-chrome tier (`compact:` variant, 24px / 12px) and the
 * `density="compact"` prop keep their own sizes. Mirrored by the
 * `--density-input-height` / `--density-text` tokens for bespoke controls.
 */
export const controlHeightClass = "h-9";
export const controlTextClass = "text-sm";
export const controlSizeClasses = `${controlHeightClass} ${controlTextClass}`;

/**
 * For a container whose direct children sit in a row with form controls
 * (FilterBar filters and actions): text Buttons take the control height and
 * icon Buttons become square at that height, whatever `size` they were given.
 */
export const controlRowButtonClasses =
  "[&>[data-slot=button]:not([data-icon-only])]:h-9 [&>[data-slot=button][data-icon-only]]:size-9";

export const focusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

/**
 * Compact-tier focus for fields: the filled surface turns into the plain
 * background with a ring-token border, and no halo.
 */
export const compactFieldFocusClasses =
  "compact:focus-visible:border-ring compact:focus-visible:bg-background compact:focus-visible:ring-0";

/** Focus treatment for text-entry fields: ring-token border + a soft 2px halo. */
export const inputFocusClasses = [
  "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35",
  compactFieldFocusClasses,
].join(" ");

/** Same as inputFocusClasses for composite fields that wrap a native input. */
export const inputFocusWithinClasses = [
  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35",
  "compact:focus-within:border-ring compact:focus-within:bg-background compact:focus-within:ring-0",
].join(" ");

/**
 * Error state of a text-entry control carrying `aria-invalid="true"` (set by
 * `<Field error>` or explicitly): a destructive border at rest, on hover and
 * on focus, and a destructive focus halo, so focus stays visible while the
 * error reads. The border is `--destructive-text`, the red tuned per theme:
 * `--destructive` was 1.2–1.9:1 against the mid surfaces and under 3:1 on
 * raised dark ones. The stacked variants out-rank the plain `hover:` /
 * `focus:` border classes by specificity, whatever their order.
 */
export const controlInvalidClasses = [
  "aria-invalid:border-destructive-text aria-invalid:hover:border-destructive-text",
  "aria-invalid:focus-visible:border-destructive-text aria-invalid:focus-visible:ring-2 aria-invalid:focus-visible:ring-destructive/35",
  "compact:aria-invalid:border-destructive-text compact:aria-invalid:hover:border-destructive-text",
].join(" ");

/**
 * The same error state for composite fields (InputNumber, TimePicker,
 * ColorInput, MultiCombobox, TagInput) whose wrapper carries `data-invalid`
 * and whose focus is shown with `focus-within`.
 */
export const controlInvalidWithinClasses = [
  "data-[invalid]:border-destructive-text data-[invalid]:hover:border-destructive-text",
  "data-[invalid]:focus-within:border-destructive-text data-[invalid]:focus-within:ring-2 data-[invalid]:focus-within:ring-destructive/35",
  "compact:data-[invalid]:border-destructive-text compact:data-[invalid]:hover:border-destructive-text",
].join(" ");

export const iconStrokeClasses =
  "[&_svg]:transition-[stroke-width,transform,color] [&_svg]:duration-150 [&_svg]:ease-out group-hover:[&_svg]:stroke-[2]";

/**
 * Compact-tier field surface (editor chrome): a filled `--density-field`
 * surface with no resting border; hover shows the border. The hover border
 * skips focused fields, since `focus-within:` sorts before `hover:`.
 */
export const compactFieldSurfaceClasses =
  "compact:border-transparent compact:bg-[var(--density-field)] compact:shadow-none compact:hover:not-focus-within:border-border";

export const controlSurfaceClasses = [
  "border border-border bg-background hover:border-border-strong",
  compactFieldSurfaceClasses,
].join(" ");

export const surfaceElevationClasses = {
  flat: "border border-border bg-card",
  raised: "border border-border bg-card shadow-natural",
  floating: "border border-border bg-card shadow-elevated",
} as const;

export const radiusClasses = {
  control: "rounded-md",
  panel: "rounded-xl",
  pill: "rounded-full",
} as const;

/*
 * Segmented control (ButtonGroup, ToggleGroup variant="segmented"): a muted
 * track with a raised chip for the active item. In the compact tier the track
 * is the filled field surface and the chip a white 20px pill; `w-full` on the
 * track stretches the items evenly.
 */
export const segmentedTrackClasses = [
  "inline-flex items-center gap-0.5 rounded-xl bg-muted p-0.5",
  "compact:h-6 compact:gap-0 compact:rounded-[6px] compact:bg-[var(--density-field)] compact:p-0.5 compact:[&.w-full]:flex",
].join(" ");

export const segmentedItemClasses = [
  "relative inline-flex min-h-8 items-center justify-center gap-1 rounded-[10px] px-3 py-1 body-sm font-medium",
  "transition-[background-color,box-shadow,color,opacity,scale] active:scale-[0.96]",
  "focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "text-muted-foreground hover:text-foreground",
  "compact:h-5 compact:min-h-0 compact:min-w-6 compact:flex-1 compact:rounded-[4px] compact:px-1.5 compact:py-0",
  "compact:text-[11px] compact:active:scale-100 compact:[&_svg]:size-3.5",
  "compact:disabled:cursor-default compact:disabled:opacity-40",
].join(" ");

/** Active chip, applied conditionally (ButtonGroupItem `active` / `aria-pressed`). */
export const segmentedItemActiveClasses = [
  "bg-card text-foreground shadow-natural",
  "compact:bg-background compact:shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.08)]",
].join(" ");

/**
 * The same chip keyed off Radix's `data-state="on"` (ToggleGroup items).
 * Tailwind can't prefix a variant at runtime, so it is spelled out here; keep
 * it in sync with segmentedItemActiveClasses (a test checks this).
 */
export const segmentedItemOnClasses = [
  "data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-natural",
  "compact:data-[state=on]:bg-background compact:data-[state=on]:shadow-[0_0_0_0.5px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.08)]",
].join(" ");

export const menuItemClasses =
  "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 body outline-none transition-[background-color,color,box-shadow] duration-150 ease-out compact:min-h-7 compact:px-2 compact:py-1 compact:text-[13px] compact:rounded-[4px]";

export const menuItemActiveClasses =
  "focus:bg-active focus:text-foreground data-[highlighted]:bg-active";

export function useProximityIndex<T extends HTMLElement>(axis: "x" | "y" = "y") {
  const containerRef = React.useRef<T | null>(null);
  const itemRefs = React.useRef(new Map<number, HTMLElement>());
  const frameRef = React.useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const registerItem = React.useCallback((index: number, node: HTMLElement | null) => {
    if (node) itemRefs.current.set(index, node);
    else itemRefs.current.delete(index);
  }, []);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<T>) => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      const pointer = axis === "x" ? event.clientX : event.clientY;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        let closestIndex: number | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        itemRefs.current.forEach((node, index) => {
          const rect = node.getBoundingClientRect();
          const start = axis === "x" ? rect.left : rect.top;
          const size = axis === "x" ? rect.width : rect.height;
          const center = start + size / 2;
          const distance = Math.abs(pointer - center);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
      });
    },
    [axis],
  );

  const clearActiveIndex = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setActiveIndex(null);
  }, []);

  React.useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return {
    activeIndex,
    containerRef,
    registerItem,
    handlers: {
      onPointerMove,
      onPointerLeave: clearActiveIndex,
    },
  };
}
