"use client";

import {
  cloneElement,
  type Ref,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
} from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconComponent } from "../lib/icon-context";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";

const buttonVariants = cva(
  [
    "group relative isolate inline-flex items-center justify-center outline-none cursor-pointer",
    "text-box-trim-both text-box-edge-cap-alphabetic",
    "transition-colors duration-80",
    "disabled:opacity-50 disabled:pointer-events-none",
    "compact:rounded-[5px] compact:whitespace-nowrap",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      variant: {
        default: "text-background",
        primary: "text-background",
        brand: "text-primary-foreground",
        secondary: "text-foreground",
        outline: "border border-border text-foreground hover:border-border-strong",
        tertiary: "border border-border text-foreground hover:border-border-strong",
        destructive: "text-destructive border border-destructive/30",
        ghost: "text-muted-foreground hover:text-foreground aria-pressed:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        // Pressable preset tile (style presets, font pairings, previews): a
        // quiet filled tile; pressed (`aria-pressed` or `active`) is a
        // background tile with a hairline foreground ring (on the bg span).
        // Tiles are usually content-sized: pass `h-auto compact:h-auto`.
        tile: "text-foreground",
        // A button that reads as a field, e.g. a font-family picker trigger.
        field: [
          "border border-border text-foreground font-normal justify-between hover:border-border-strong",
          "compact:border-transparent compact:hover:border-border",
          "compact:aria-expanded:border-ring compact:focus-visible:border-ring",
          "compact:focus-visible:ring-0 compact:focus-visible:ring-offset-0",
          "compact:[&_svg]:size-3 compact:[&_svg]:text-muted-foreground",
        ],
      },
      // `compact:` classes apply under data-density="compact" (editor chrome):
      // 24px controls, 12px text, 8–10px padding, 5px radius.
      size: {
        xs: "h-6 px-2.5 text-[11px] gap-1 compact:px-2",
        sm: "h-7 px-3 text-[12px] gap-1 compact:h-6 compact:px-2",
        default: "h-8 px-4 text-[13px] gap-1.5 compact:h-6 compact:px-2.5 compact:text-[12px]",
        md: "h-8 px-4 text-[13px] gap-1.5 compact:h-6 compact:px-2.5 compact:text-[12px]",
        lg: "h-9 px-5 text-[14px] gap-1.5 compact:h-7 compact:px-3 compact:text-[12px]",
        "icon-xs": "h-7 w-7 p-0 [&_svg]:h-3 [&_svg]:w-3 compact:h-6 compact:w-6",
        "icon-sm": "h-8 w-8 p-0 [&_svg]:h-3.5 [&_svg]:w-3.5 compact:h-6 compact:w-6",
        icon: "h-9 w-9 p-0 [&_svg]:h-4 [&_svg]:w-4 compact:h-7 compact:w-7",
        "icon-lg": "h-10 w-10 p-0 [&_svg]:h-5 [&_svg]:w-5 compact:h-8 compact:w-8",
      },
      iconLeft: { true: "" },
      iconRight: { true: "" },
    },
    compoundVariants: [
      { size: "sm", iconLeft: true, className: "ps-1.5" },
      { size: "md", iconLeft: true, className: "ps-2.5" },
      { size: "lg", iconLeft: true, className: "ps-3.5" },
      { size: "sm", iconRight: true, className: "pe-1.5" },
      { size: "md", iconRight: true, className: "pe-2.5" },
      { size: "lg", iconRight: true, className: "pe-3.5" },
      // Compact: every icon-only size draws a 14px icon, so panel icons are uniform.
      // Emitted after the per-size `[&_svg]` sizes (a compact variant), so it wins.
      {
        size: ["icon", "icon-xs", "icon-sm", "icon-lg"],
        className: "compact:[&_svg]:size-3.5",
      },
      // After the size classes, so the field sizing follows (and overrides) them.
      {
        variant: "field",
        className: "compact:h-6 compact:ps-2 compact:pe-1.5 compact:text-[12px]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  /** Force the visual pressed/held state. Useful when the button drives an
   *  external open piece of UI (a popover, dropdown, etc.) so it reads as
   *  engaged while the menu is showing. */
  active?: boolean;
}

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

/** Pressed preset tile: a background-coloured tile with a hairline ring.
 *  Painted on the bg span, since an inset shadow on the root would sit under it. */
const tilePressedClasses =
  "bg-background shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]";

// Variant fills. Neutral variants tint with `foreground` alpha rather than a
// fixed palette colour so they mean the same thing in light, mid and dark:
// primary = inverted foreground, secondary = soft neutral fill, outline /
// tertiary / ghost = transparent with a neutral hover wash; a pressed ghost
// (`aria-pressed="true"`) keeps a subtle fill.
const bgVariants: Record<ButtonVariant, string> = {
  default: "bg-foreground group-hover:bg-foreground/90 group-active:bg-foreground/80",
  primary: "bg-foreground group-hover:bg-foreground/90 group-active:bg-foreground/80",
  brand: "bg-primary group-hover:bg-primary/90 group-active:bg-primary/80",
  secondary:
    "bg-foreground/[0.07] group-hover:bg-foreground/[0.11] group-active:bg-foreground/[0.15]",
  outline: "bg-transparent group-hover:bg-foreground/[0.05] group-active:bg-foreground/[0.09]",
  tertiary: "bg-transparent group-hover:bg-foreground/[0.05] group-active:bg-foreground/[0.09]",
  destructive: "bg-destructive/10 group-hover:bg-destructive/15 group-active:bg-destructive/20",
  ghost:
    "bg-transparent group-hover:bg-foreground/[0.06] group-active:bg-foreground/[0.1] group-aria-pressed:bg-foreground/[0.08]",
  link: "bg-transparent",
  tile: [
    "bg-foreground/[0.05] group-hover:bg-foreground/[0.08]",
    "group-aria-pressed:bg-background group-aria-pressed:shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]",
  ].join(" "),
  field: [
    "bg-background compact:bg-[var(--density-field)]",
    "compact:group-aria-expanded:bg-background compact:group-focus-visible:bg-background",
  ].join(" "),
};

const activeBgVariants: Record<ButtonVariant, string> = {
  default: "bg-foreground/80",
  primary: "bg-foreground/80",
  brand: "bg-primary/80",
  secondary: "bg-foreground/[0.15]",
  outline: "bg-foreground/[0.09]",
  tertiary: "bg-foreground/[0.09]",
  destructive: "bg-destructive/20",
  ghost: "bg-foreground/[0.1]",
  link: "bg-transparent",
  tile: tilePressedClasses,
  field: "bg-background",
};

function Button({
  ref,
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  active = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> | undefined }) {
  const Comp = asChild ? Slot.Root : "button";
  const isIconOnly =
    size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg";
  const iconSize = size === "xs" || size === "sm" ? 14 : size === "lg" ? 20 : 16;
  const shape = useShape();
  const bgClass = active
    ? activeBgVariants[variant ?? "primary"]
    : bgVariants[variant ?? "primary"];

  if (asChild && isValidElement(children)) {
    // The child receives arbitrary button props (data-*, aria-*, handlers).
    const child = children as ReactElement<
      Record<string, unknown> & { className?: string; style?: CSSProperties }
    >;
    return cloneElement(child, {
      ...props,
      "data-slot": "button",
      "data-icon-only": isIconOnly ? "" : undefined,
      className: cn(
        buttonVariants({
          variant,
          size,
          iconLeft: !isIconOnly && !!LeadingIcon,
          iconRight: !isIconOnly && !!TrailingIcon,
        }),
        shape.button,
        child.props.className,
        className,
      ),
      style: { ...child.props.style, ...style },
    });
  }

  return (
    <Comp
      ref={ref}
      data-slot="button"
      // Lets layouts target icon-only buttons (e.g. the inspector grid's action column).
      data-icon-only={isIconOnly ? "" : undefined}
      className={cn(
        buttonVariants({
          variant,
          size,
          iconLeft: !isIconOnly && !!LeadingIcon,
          iconRight: !isIconOnly && !!TrailingIcon,
        }),
        shape.button,
        className,
      )}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-[inherit] transition-[background-color,transform] duration-80 group-active:scale-[0.98]",
          bgClass,
        )}
      />
      <span
        className={cn(
          "relative inline-flex items-center justify-center gap-[inherit]",
          // Field buttons: value at the start, trailing icon at the end.
          variant === "field" && "w-full min-w-0 justify-between text-start",
        )}
      >
        {loading ? (
          <>
            <span className="flex items-center justify-center gap-[inherit] opacity-0">
              {LeadingIcon && !isIconOnly && <LeadingIcon size={iconSize} strokeWidth={2} />}
              {children}
              {TrailingIcon && !isIconOnly && <TrailingIcon size={iconSize} strokeWidth={2} />}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <path
                  d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
                  stroke="currentColor"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  pathLength="100"
                  style={{
                    strokeDasharray: "15 85",
                    animation:
                      "spinner-move 2s linear infinite, spinner-dash 4s ease-in-out infinite",
                  }}
                />
              </svg>
            </span>
          </>
        ) : isIconOnly ? (
          <span className="[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]">
            {children}
          </span>
        ) : (
          <>
            {LeadingIcon && (
              <LeadingIcon
                size={iconSize}
                strokeWidth={1.5}
                className="transition-[stroke-width] duration-80 group-hover:stroke-[2]"
              />
            )}
            {LeadingIcon || TrailingIcon ? <span>{children}</span> : children}
            {TrailingIcon && (
              <TrailingIcon
                size={iconSize}
                strokeWidth={1.5}
                className="transition-[stroke-width] duration-80 group-hover:stroke-[2]"
              />
            )}
          </>
        )}
      </span>
    </Comp>
  );
}

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
