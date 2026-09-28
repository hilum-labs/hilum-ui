"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconComponent } from "../lib/icon-context";
import { cn } from "../lib/utils";
import { useDensityAttributes } from "../lib/density-context";
import { useShape } from "../lib/shape-context";
import { useScrollEdges, ScrollEdgeCue } from "../lib/scroll-fade";
import { useFieldControl } from "../lib/field-context";
import { surfaceClasses } from "../lib/surface-classes";
import { SurfaceProvider, useSurface } from "../lib/surface-context";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetStyle,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";
import type { ControlDensity, ControlMobileSurface } from "./input";

// Built on Radix Select: collision-aware popper positioning, typeahead,
// full keyboard support, focus management, native form participation
// (`name`, `required`, `form` via a hidden native <select>) and items that can
// be wrapped in fragments / custom components.

// ---------------------------------------------------------------------------
// Select (root)
// ---------------------------------------------------------------------------

type SelectProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

function Select(props: SelectProps) {
  return <SelectPrimitive.Root {...props} />;
}

Select.displayName = "Select";

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------

const triggerVariants = cva(
  [
    "group inline-flex items-center justify-between gap-2 outline-none cursor-pointer",
    "text-[13px] h-9 px-3 min-w-40",
    "transition-all duration-80 motion-reduce:transition-none",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    // Editor-chrome density: a full-width 24px field; open or focused reads
    // as the plain background with a ring-token border and no halo.
    "compact:h-6 compact:w-full compact:min-w-0 compact:justify-between compact:gap-1 compact:ps-2 compact:pe-1.5 compact:text-[12px] compact:rounded-[5px]",
    "compact:focus-visible:ring-0 compact:aria-expanded:bg-background compact:aria-expanded:border-ring",
    "compact:focus-visible:bg-background compact:focus-visible:border-ring",
  ],
  {
    variants: {
      variant: {
        bordered: [
          "border border-border bg-transparent text-foreground hover:bg-hover hover:border-border-strong",
          "compact:border-transparent compact:bg-[var(--density-field)] compact:shadow-none",
          "compact:hover:border-border compact:hover:bg-[var(--density-field)]",
        ],
        borderless: "border border-transparent bg-transparent text-foreground hover:bg-hover",
      },
    },
    defaultVariants: {
      variant: "bordered",
    },
  },
);

const selectTriggerDensityClasses: Record<ControlDensity, string> = {
  default: "h-9 px-3",
  compact: "h-8 px-2.5",
};

const selectTriggerMobileDensityClasses: Record<ControlDensity, string> = {
  default: "",
  compact: "max-sm:h-8 max-sm:px-2.5",
};

const selectTriggerMobileSurfaceClasses: Record<ControlMobileSurface, string> = {
  default: "",
  flush:
    "max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:bg-transparent max-sm:px-0 max-sm:shadow-none max-sm:focus-visible:ring-0 max-sm:focus-visible:ring-offset-0",
};

interface SelectTriggerProps
  extends
    React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof triggerVariants> {
  icon?: IconComponent;
  /** Placeholder shown when no children are passed and nothing is selected. */
  placeholder?: string;
  /** Error message rendered under the trigger; also sets aria-invalid. */
  error?: string;
  density?: ControlDensity;
  mobileDensity?: ControlDensity;
  mobileSurface?: ControlMobileSurface;
}

function SelectTrigger({
  ref,
  className,
  variant,
  icon: Icon,
  placeholder = "Select…",
  error,
  children,
  density = "default",
  mobileDensity = "default",
  mobileSurface = "default",
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: SelectTriggerProps) {
  const shape = useShape();
  const errorId = React.useId();
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy ?? (error ? errorId : undefined),
    "aria-invalid": ariaInvalid ?? (error ? true : undefined),
    "aria-required": ariaRequired,
  });

  return (
    <div className="flex flex-col gap-1 compact:w-full compact:min-w-0">
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        {...fieldProps}
        className={cn(
          triggerVariants({ variant }),
          selectTriggerDensityClasses[density],
          selectTriggerMobileDensityClasses[mobileDensity],
          selectTriggerMobileSurfaceClasses[mobileSurface],
          shape.input,
          error &&
            "border-destructive/50 hover:border-destructive/50 compact:border-destructive/50 compact:hover:border-destructive/50",
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <Icon
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground transition-[color,stroke-width] duration-80 group-hover:text-foreground group-hover:stroke-[2]"
            />
          )}
          {children ?? <SelectValue placeholder={placeholder} />}
        </span>

        <SelectPrimitive.Icon asChild>
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0 text-muted-foreground transition-colors duration-80 group-hover:text-foreground compact:size-3 compact:group-hover:text-muted-foreground"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      {error && (
        <span id={errorId} className="text-[12px] text-destructive ps-3">
          {error}
        </span>
      )}
    </div>
  );
}

SelectTrigger.displayName = "SelectTrigger";

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

interface SelectContentProps extends React.ComponentProps<typeof SelectPrimitive.Content> {
  /** Show a fade + chevron cue at the scroll edges when the list overflows its
   *  max-height, signalling there's more to scroll. Auto-activates on overflow;
   *  set to `false` to disable. Defaults to `true`. */
  scrollFade?: boolean;
}

function SelectContent({
  ref,
  className,
  children,
  scrollFade = true,
  position = "popper",
  sideOffset = 6,
  align = "start",
  ...props
}: SelectContentProps) {
  const shape = useShape();
  const densityAttributes = useDensityAttributes();
  // Menus sit two steps above their substrate with a fixed shadow weight
  // (same treatment as <Elevated offset={2} shadowLevel={3}>).
  const level = Math.min(useSurface() + 2, 8);
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null);
  const viewportRef = React.useMemo(() => ({ current: viewport }), [viewport]);
  const edges = useScrollEdges(viewportRef, { enabled: scrollFade && viewport !== null });

  return (
    <SelectPrimitive.Portal>
      <SurfaceProvider value={level}>
        <style>{mobilePopperSheetStyle}</style>
        <SelectPrimitive.Content
          ref={ref}
          data-slot="select-content"
          {...densityAttributes}
          data-hilum-mobile-sheet="true"
          position={position}
          {...(position === "popper" ? { sideOffset, align } : {})}
          className={cn(
            surfaceClasses(level, 3),
            "relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden select-none outline-none",
            position === "popper" &&
              "max-h-[min(300px,var(--radix-select-content-available-height))]",
            shape.container,
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "motion-reduce:animate-none",
            mobilePopperSheetPositionClassName,
            mobilePopperSheetSurfaceClassName,
            mobilePopperSheetMotionClassName,
            "max-md:!fixed max-md:rounded-2xl max-md:data-[state=open]:slide-in-from-bottom max-md:pt-4",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.Viewport
            ref={setViewport}
            className="relative flex flex-col gap-0.5 p-1"
          >
            {/* Sticky cues live inside the scroller; they read the surface
                  level from the SurfaceProvider above so the gradient matches
                  the menu background at any depth. */}
            {scrollFade && <ScrollEdgeCue edge="top" visible={edges.top} />}
            {children}
            {scrollFade && <ScrollEdgeCue edge="bottom" visible={edges.bottom} />}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SurfaceProvider>
    </SelectPrimitive.Portal>
  );
}

SelectContent.displayName = "SelectContent";

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

interface SelectItemProps extends React.ComponentProps<typeof SelectPrimitive.Item> {
  icon?: IconComponent;
  /**
   * @deprecated No longer needed — items are discovered by Radix regardless of
   * nesting. Accepted and ignored for backward compatibility.
   */
  index?: number;
}

function SelectItem({
  ref,
  className,
  children,
  icon: Icon,
  index: _index,
  ...props
}: SelectItemProps) {
  const shape = useShape();

  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        `group/select-item relative z-10 flex items-center gap-2 ${shape.item} px-2 py-2 text-[13px] cursor-pointer outline-none select-none`,
        "compact:min-h-7 compact:py-1 compact:rounded-[4px]",
        "transition-[color,background-color] duration-80 motion-reduce:transition-none",
        "text-muted-foreground data-[highlighted]:bg-hover data-[highlighted]:text-foreground",
        "data-[state=checked]:bg-active data-[state=checked]:text-foreground",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon
          size={16}
          strokeWidth={1.5}
          className="shrink-0 transition-[color,stroke-width] duration-80 group-data-[highlighted]/select-item:stroke-[2] group-data-[state=checked]/select-item:stroke-[2]"
        />
      )}

      <span className="flex-1 min-w-0 truncate">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </span>

      <SelectPrimitive.ItemIndicator className="shrink-0 text-foreground">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12L9 17L20 6" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

SelectItem.displayName = "SelectItem";

// ---------------------------------------------------------------------------
// SelectGroup + SelectLabel + SelectSeparator + SelectValue
// ---------------------------------------------------------------------------

// Radix requires Select.Label to sit inside Select.Group; the previous
// hand-rolled SelectLabel worked anywhere, so track group membership and fall
// back to a plain (aria-hidden, decorative) heading outside a group.
const InSelectGroupContext = React.createContext(false);

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <InSelectGroupContext.Provider value={true}>
      <SelectPrimitive.Group data-slot="select-group" {...props} />
    </InSelectGroupContext.Provider>
  );
}

SelectGroup.displayName = "SelectGroup";

function SelectLabel({
  className,
  asChild: _asChild,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  const inGroup = React.useContext(InSelectGroupContext);
  const classes = cn("px-2 py-1.5 text-[11px] text-muted-foreground", className);
  if (!inGroup)
    return <div data-slot="select-label" aria-hidden="true" className={classes} {...props} />;
  return <SelectPrimitive.Label data-slot="select-label" className={classes} {...props} />;
}

SelectLabel.displayName = "SelectLabel";

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 -mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

SelectSeparator.displayName = "SelectSeparator";

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;

function SelectValue({ className, placeholder, ...props }: SelectValueProps) {
  return (
    <span className="min-w-0 flex-1 text-start truncate group-data-[placeholder]:text-muted-foreground">
      <SelectPrimitive.Value
        data-slot="select-value"
        className={className}
        placeholder={placeholder}
        {...props}
      />
    </span>
  );
}

SelectValue.displayName = "SelectValue";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  triggerVariants,
};

export type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectValueProps,
};
