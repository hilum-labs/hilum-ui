import * as React from "react";

export const motionClasses =
  "transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-150 ease-out motion-reduce:transition-none";

export const springMotionClasses =
  "transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 ease-[cubic-bezier(0.2,0.9,0.2,1.15)] motion-reduce:transition-none";

export const pressClasses = "active:scale-[0.97] motion-reduce:active:scale-100";

export const focusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1";

export const iconStrokeClasses =
  "[&_svg]:transition-[stroke-width,transform,color] [&_svg]:duration-150 [&_svg]:ease-out group-hover:[&_svg]:stroke-[2]";

export const controlSurfaceClasses =
  "border border-border bg-card shadow-natural hover:border-ground-200 hover:shadow-elevated";

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

export const menuItemClasses =
  "relative flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 body outline-none transition-[background-color,color,box-shadow] duration-150 ease-out";

export const menuItemActiveClasses =
  "focus:bg-muted focus:text-foreground data-[highlighted]:bg-muted";

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
