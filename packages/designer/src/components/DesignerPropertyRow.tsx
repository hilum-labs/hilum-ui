import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerPropertyRowProps extends ComponentPropsWithoutRef<"div"> {
  /** Optional label for direct row usage. Compound usage can use DesignerPropertyLabel. */
  label?: ReactNode;
  /** htmlFor forwarded to the generated label when label is provided. */
  labelFor?: string;
  /** Class name for the generated controls container when label is provided. */
  controlsClassName?: string;
  /**
   * `stacked` (default) puts the label above the controls; `inline` puts it
   * in a fixed-width column to the left — the dense Figma-style inspector row.
   */
  layout?: "stacked" | "inline";
  /**
   * Label column width when `layout="inline"`. Default: 64px, or 72px under
   * compact density. Applies to the generated label and to a `<label>` passed
   * as a direct child (compact density).
   */
  labelWidth?: number | string;
  children: ReactNode;
}

interface DesignerPropertyLabelProps extends ComponentPropsWithoutRef<"label"> {
  children: ReactNode;
}

interface DesignerPropertyControlsProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

interface DesignerPropertyGroupProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title?: ReactNode;
  children: ReactNode;
}

function DesignerPropertyRow({
  label,
  labelFor,
  controlsClassName,
  layout = "stacked",
  labelWidth,
  className,
  style,
  children,
  ...rest
}: DesignerPropertyRowProps) {
  const inline = layout === "inline";
  const labelWidthStyle =
    inline && labelWidth !== undefined
      ? ({
          "--designer-label-width": typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth,
        } as CSSProperties)
      : undefined;
  return (
    <div
      data-layout={layout}
      className={cn(
        "flex w-full min-w-0 max-w-full py-1.5 compact:py-0.5",
        inline
          ? [
              "flex-row items-center gap-2 compact:min-h-6",
              // Compact: a fixed label column, whether the row renders the
              // label or the consumer composes its own <label> as a child;
              // the other children share the rest of the row.
              "compact:[&>label]:w-[var(--designer-label-width,72px)] compact:[&>label]:flex-[0_0_var(--designer-label-width,72px)] compact:[&>label]:truncate",
              "compact:[&>:not(label)]:min-w-0 compact:[&>:not(label)]:flex-1",
            ]
          : "flex-col items-stretch gap-1.5 compact:gap-1",
        className,
      )}
      style={labelWidthStyle ? { ...labelWidthStyle, ...style } : style}
      {...rest}
    >
      {label === undefined ? (
        children
      ) : (
        <>
          <DesignerPropertyLabel
            htmlFor={labelFor}
            className={
              inline ? "w-[var(--designer-label-width,64px)] shrink-0 truncate" : undefined
            }
          >
            {label}
          </DesignerPropertyLabel>
          <DesignerPropertyControls className={controlsClassName}>
            {children}
          </DesignerPropertyControls>
        </>
      )}
    </div>
  );
}

function DesignerPropertyLabel({ className, children, ...rest }: DesignerPropertyLabelProps) {
  return (
    <label
      className={cn(
        "caption w-full min-w-0 max-w-full select-none text-muted-foreground compact:text-[11px] compact:leading-4",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

function DesignerPropertyControls({ className, children, ...rest }: DesignerPropertyControlsProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full flex-1 items-center gap-2 overflow-visible",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function DesignerPropertyGroup({
  title,
  className,
  children,
  ...rest
}: DesignerPropertyGroupProps) {
  return (
    <div
      className={cn("flex min-w-0 max-w-full flex-col gap-3 compact:gap-2", className)}
      {...rest}
    >
      {title && (
        <div className="caption-xs min-w-0 max-w-full select-none overflow-hidden text-ellipsis uppercase tracking-wider text-muted-foreground compact:text-[11px] compact:normal-case compact:tracking-normal">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export {
  DesignerPropertyRow,
  DesignerPropertyLabel,
  DesignerPropertyControls,
  DesignerPropertyGroup,
};
export type {
  DesignerPropertyRowProps,
  DesignerPropertyLabelProps,
  DesignerPropertyControlsProps,
  DesignerPropertyGroupProps,
};
