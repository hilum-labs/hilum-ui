"use client";

import {
  cloneElement,
  useCallback,
  type Ref,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconComponent } from "../lib/icon-context";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";

// `primary` (and `default`): the inverted foreground. In the mid theme the
// fill is near-white under a gray label (5.8:1), and at 80% alpha it lets
// enough of the gray surface through to drop to 4.1–4.4:1, so mid stops at
// the hover fill (4.9–5.0:1).
const neutralSolidClasses = [
  "text-background before:bg-foreground hover:before:bg-foreground/90 active:before:bg-foreground/80",
  "in-data-[theme=mid]:active:before:bg-foreground/90",
];

// The variant fill is painted on the element's own `::before` (inset 0, the
// border radius inherited, stacked under the label by `isolate` + a negative
// z-index) instead of an extra child. That keeps the classes self-contained:
// a `<Button>`, a `<Button asChild>` child (router links, EmptyState / PageHeader
// href actions) and any element styled with `buttonVariants()` (PaginationLink)
// get the same fill, hover, press and pressed states.
const buttonVariants = cva(
  [
    "group relative isolate inline-flex items-center justify-center outline-none cursor-pointer",
    "text-box-trim-both text-box-edge-cap-alphabetic",
    "transition-colors duration-80",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:content-['']",
    "before:transition-[background-color,box-shadow,scale] before:duration-80",
    "active:before:scale-[0.98] motion-reduce:active:before:scale-100",
    "disabled:opacity-50 disabled:pointer-events-none",
    "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
    "compact:rounded-[5px] compact:whitespace-nowrap",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      // Neutral variants tint with `foreground` alpha rather than a fixed
      // palette colour so they mean the same thing in light, mid and dark:
      // primary = inverted foreground, secondary = soft neutral fill, outline /
      // tertiary / ghost = transparent with a neutral hover wash; a pressed
      // ghost (`aria-pressed="true"`) keeps a subtle fill.
      variant: {
        default: neutralSolidClasses,
        primary: neutralSolidClasses,
        // Hover and pressed mix the fill toward `--primary-shade` (away from
        // the label). At 90% / 80% alpha it got lighter over a white page:
        // the white label was 4.3:1 and 3.9:1.
        brand:
          "text-primary-foreground before:bg-primary hover:before:bg-primary-hover active:before:bg-primary-active",
        secondary:
          "text-foreground before:bg-foreground/[0.07] hover:before:bg-foreground/[0.11] active:before:bg-foreground/[0.15]",
        outline: [
          "border border-border text-foreground hover:border-border-strong",
          "hover:before:bg-foreground/[0.05] active:before:bg-foreground/[0.09]",
        ],
        tertiary: [
          "border border-border text-foreground hover:border-border-strong",
          "hover:before:bg-foreground/[0.05] active:before:bg-foreground/[0.09]",
        ],
        destructive: [
          "text-destructive-text border border-destructive/30",
          "before:bg-destructive/10 hover:before:bg-destructive/15 active:before:bg-destructive/20",
        ],
        ghost: [
          "text-muted-foreground hover:text-foreground aria-pressed:text-foreground",
          "hover:before:bg-foreground/[0.06] active:before:bg-foreground/[0.1] aria-pressed:before:bg-foreground/[0.08]",
        ],
        link: "text-foreground underline-offset-4 hover:underline",
        // Pressable preset tile (style presets, font pairings, previews): a
        // quiet filled tile; pressed (`aria-pressed` or `active`) is a
        // background tile with a hairline foreground ring.
        // Tiles are usually content-sized: pass `h-auto compact:h-auto`.
        tile: [
          "text-foreground before:bg-foreground/[0.05] hover:before:bg-foreground/[0.08]",
          "aria-pressed:before:bg-background aria-pressed:before:shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]",
        ],
        // A button that reads as a field, e.g. a font-family picker trigger.
        field: [
          "border border-border text-foreground font-normal justify-between hover:border-border-strong",
          "before:bg-background compact:before:bg-[var(--density-field)]",
          "compact:aria-expanded:before:bg-background compact:focus-visible:before:bg-background",
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

/**
 * Forced pressed/held fills for `active`. They replace (via tailwind-merge) the
 * resting and hover fills of the variant, so an engaged button doesn't shift
 * on hover.
 */
const neutralSolidActiveClasses =
  "before:bg-foreground/80 hover:before:bg-foreground/80 in-data-[theme=mid]:before:bg-foreground/90 in-data-[theme=mid]:hover:before:bg-foreground/90";

const activeFillVariants: Record<ButtonVariant, string> = {
  default: neutralSolidActiveClasses,
  primary: neutralSolidActiveClasses,
  brand: "before:bg-primary-active hover:before:bg-primary-active",
  secondary: "before:bg-foreground/[0.15] hover:before:bg-foreground/[0.15]",
  outline: "before:bg-foreground/[0.09] hover:before:bg-foreground/[0.09]",
  tertiary: "before:bg-foreground/[0.09] hover:before:bg-foreground/[0.09]",
  destructive: "before:bg-destructive/20 hover:before:bg-destructive/20",
  ghost: "before:bg-foreground/[0.1] hover:before:bg-foreground/[0.1]",
  link: "",
  // Pressed preset tile: a background-coloured tile with a hairline ring.
  tile: "before:bg-background hover:before:bg-background before:shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]",
  field: "before:bg-background compact:before:bg-background",
};

function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

/** The Hilum loading glyph: a dash tracing a figure-eight (`hilum-orbit`). */
function ButtonSpinner() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
          stroke="currentColor"
          strokeWidth="1.125"
          strokeLinecap="round"
          strokeDasharray="15 85"
          pathLength="100"
          className="animate-hilum-orbit motion-reduce:animate-none"
        />
      </svg>
    </span>
  );
}

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
  const isIconOnly =
    size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg";
  const iconSize = size === "xs" || size === "sm" ? 14 : size === "lg" ? 20 : 16;
  const shape = useShape();
  const childRef =
    asChild && isValidElement(children)
      ? (children.props as { ref?: Ref<HTMLButtonElement> }).ref
      : undefined;
  // asChild: the button's ref and the child's own ref both get the node.
  const composedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setRef(ref, node);
      setRef(childRef, node);
    },
    [ref, childRef],
  );
  const classes = cn(
    buttonVariants({
      variant,
      size,
      iconLeft: !isIconOnly && !!LeadingIcon,
      iconRight: !isIconOnly && !!TrailingIcon,
    }),
    shape.button,
    active && activeFillVariants[variant ?? "primary"],
  );

  // The label layer. Identical for <button> and asChild children, so icons,
  // loading and the icon-only stroke treatment render the same either way.
  const renderContent = (content: ReactNode) => (
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
            {content}
            {TrailingIcon && !isIconOnly && <TrailingIcon size={iconSize} strokeWidth={2} />}
          </span>
          <ButtonSpinner />
        </>
      ) : isIconOnly ? (
        <span className="[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] [&_svg]:duration-80 group-hover:[&_svg]:stroke-[2]">
          {content}
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
          {LeadingIcon || TrailingIcon ? <span>{content}</span> : content}
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
  );

  if (asChild && isValidElement(children)) {
    // The child receives arbitrary button props (data-*, aria-*, handlers).
    const child = children as ReactElement<
      Record<string, unknown> & {
        className?: string;
        style?: CSSProperties;
        children?: ReactNode;
      }
    >;
    const inert = Boolean(disabled || loading);
    const childContent = child.props.children;
    // Links keep their own markup unless the button needs to add something
    // (icons, the loading glyph, the icon-only stroke treatment). Render-prop
    // children (e.g. a NavLink function) are passed through untouched.
    const decorate =
      (loading || isIconOnly || Boolean(LeadingIcon) || Boolean(TrailingIcon)) &&
      typeof childContent !== "function";
    return cloneElement(
      child,
      {
        ...props,
        ref: composedRef,
        "data-slot": "button",
        "data-icon-only": isIconOnly ? "" : undefined,
        ...(active ? { "data-active": "" } : {}),
        ...(inert
          ? {
              "aria-disabled": true,
              tabIndex: -1,
              onClick: (event: MouseEvent<HTMLElement>) => event.preventDefault(),
            }
          : {}),
        ...(loading ? { "aria-busy": true } : {}),
        className: cn(classes, child.props.className, className),
        style: { ...child.props.style, ...style },
      },
      ...(decorate ? [renderContent(childContent)] : []),
    );
  }

  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      // Lets layouts target icon-only buttons (e.g. the inspector grid's action column).
      data-icon-only={isIconOnly ? "" : undefined}
      {...(active ? { "data-active": "" } : {})}
      className={cn(classes, className)}
      disabled={disabled || loading}
      {...(loading ? { "aria-busy": true } : {})}
      style={style}
      {...props}
    >
      {renderContent(children)}
    </Comp>
  );
}

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
