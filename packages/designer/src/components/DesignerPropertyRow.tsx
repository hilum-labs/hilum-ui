import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerPropertyRowProps extends ComponentPropsWithoutRef<"div"> {
  /** Optional label for direct row usage. Compound usage can use DesignerPropertyLabel. */
  label?: ReactNode;
  /** htmlFor forwarded to the generated label when label is provided. */
  labelFor?: string;
  /**
   * Class name for the generated controls container when label is provided.
   * Unused by `layout="grid"`, where the children are grid items themselves.
   */
  controlsClassName?: string;
  /**
   * - `stacked` (default) puts the label above the controls.
   * - `inline` puts it in a fixed-width column to the left.
   * - `grid` is the Figma inspector row: two equal field columns plus a fixed
   *   action column (24px compact, 32px default), with the label spanning the
   *   row above them. Direct children (or those of a DesignerPropertyControls)
   *   fill columns 1 and 2 and stretch to the cell; a lone field spans both,
   *   as does `data-span="2"` / `<DesignerPropertyField span={2}>`; icon-only
   *   Buttons go to the action column. Every grid row keeps the action column,
   *   so field edges line up down the panel.
   */
  layout?: "stacked" | "inline" | "grid";
  /**
   * Label column width when `layout="inline"`. Default: 64px, or 72px under
   * compact density. Applies to the generated label and to a `<label>` passed
   * as a direct child (compact density).
   */
  labelWidth?: number | string;
  /**
   * Trailing action (e.g. an icon-only Button). In `layout="grid"` it sits
   * centred in the action column; other layouts append it after the controls.
   */
  action?: ReactNode;
  children: ReactNode;
}

interface DesignerPropertyFieldProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Field columns to span in a `layout="grid"` row. When omitted the field
   * takes one column, or both when it is the row's only field; pass `1` to
   * keep a lone field in the first column.
   */
  span?: 1 | 2;
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

/*
 * Grid row (`layout="grid"`). Grid items are the row's direct children, plus
 * the children of a DesignerPropertyControls, which turns into
 * `display: contents`; the rules are spelled out for both. "Fields" are the
 * items that are not the label, an icon-only Button (`data-icon-only`) or the
 * action cell. The descendant `min-w-0`/`w-full` rules out-rank the field
 * components' own widths (InputNumber `w-48 min-w-fit`, Select `min-w-40`).
 */
const gridRowClasses = [
  "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_var(--designer-action-col)] items-center gap-x-2 gap-y-1",
  "[--designer-action-col:32px] compact:[--designer-action-col:24px] compact:py-0",
  // The label spans the first grid row.
  "[&>label]:col-span-full [&>label]:row-start-1",
  // Direct children: fields stretch to their cell, icon-only buttons take the action column.
  "[&>*]:min-w-0 [&>:not(label,[data-icon-only],[data-slot=designer-property-action])]:w-full",
  "[&>[data-icon-only]]:col-start-3 [&>[data-icon-only]]:justify-self-center",
  "[&>[data-span='2']]:col-span-2",
  // A lone field spans both field columns (unless it asks for data-span="1").
  "[&:not(:has(>:not(label,[data-icon-only],[data-slot=designer-property-action])~:not(label,[data-icon-only],[data-slot=designer-property-action])))>:not(label,[data-icon-only],[data-slot=designer-property-action],[data-span='1'])]:col-span-2",
  // The same through a DesignerPropertyControls, whose children join the grid.
  "[&>[data-slot=designer-property-controls]]:contents",
  "[&>[data-slot=designer-property-controls]>*]:min-w-0 [&>[data-slot=designer-property-controls]>:not([data-icon-only])]:w-full",
  "[&>[data-slot=designer-property-controls]>[data-icon-only]]:col-start-3 [&>[data-slot=designer-property-controls]>[data-icon-only]]:justify-self-center",
  "[&>[data-slot=designer-property-controls]>[data-span='2']]:col-span-2",
  "[&>[data-slot=designer-property-controls]:not(:has(>:not([data-icon-only])~:not([data-icon-only])))>:not([data-icon-only],[data-span='1'])]:col-span-2",
  // Default-density Select triggers have a 160px minimum.
  "[&_[data-slot=select-trigger]]:w-full [&_[data-slot=select-trigger]]:min-w-0",
];

function DesignerPropertyRow({
  label,
  labelFor,
  controlsClassName,
  layout = "stacked",
  labelWidth,
  action,
  className,
  style,
  children,
  ...rest
}: DesignerPropertyRowProps) {
  const inline = layout === "inline";
  const grid = layout === "grid";
  const labelWidthStyle =
    inline && labelWidth !== undefined
      ? ({
          "--designer-label-width": typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth,
        } as CSSProperties)
      : undefined;
  // Rendered after the fields: the grid auto-places it into column 3 of their row.
  const actionCell =
    action === undefined ? null : (
      <div
        data-slot="designer-property-action"
        className="col-start-3 flex shrink-0 items-center justify-center"
      >
        {action}
      </div>
    );
  return (
    <div
      data-layout={layout}
      className={cn(
        "w-full min-w-0 max-w-full py-1.5",
        grid
          ? gridRowClasses
          : inline
            ? [
                "flex flex-row items-center gap-2 compact:min-h-6 compact:py-0.5",
                // Compact: a fixed label column, whether the row renders the
                // label or the consumer composes its own <label> as a child;
                // the other children share the rest of the row.
                "compact:[&>label]:w-[var(--designer-label-width,72px)] compact:[&>label]:flex-[0_0_var(--designer-label-width,72px)] compact:[&>label]:truncate",
                "compact:[&>:not(label)]:min-w-0 compact:[&>:not(label)]:flex-1",
              ]
            : // Compact: no extra padding, the pane's gap sets the rhythm.
              "flex flex-col items-stretch gap-1.5 compact:gap-1 compact:py-0",
        className,
      )}
      style={labelWidthStyle ? { ...labelWidthStyle, ...style } : style}
      {...rest}
    >
      {label === undefined ? (
        <>
          {children}
          {actionCell}
        </>
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
          {grid ? (
            <>
              {children}
              {actionCell}
            </>
          ) : (
            <DesignerPropertyControls className={controlsClassName}>
              {children}
              {actionCell}
            </DesignerPropertyControls>
          )}
        </>
      )}
    </div>
  );
}

/**
 * A cell in a `layout="grid"` row: one field column, or both with `span={2}`.
 * Its children sit in a row and stretch; icon-only Buttons keep their size.
 */
function DesignerPropertyField({ span, className, children, ...rest }: DesignerPropertyFieldProps) {
  return (
    <div
      data-slot="designer-property-field"
      data-span={span}
      className={cn(
        "flex min-w-0 items-center gap-2 [&>*]:min-w-0 [&>:not([data-icon-only])]:flex-1",
        className,
      )}
      {...rest}
    >
      {children}
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
      data-slot="designer-property-controls"
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
  DesignerPropertyField,
  DesignerPropertyGroup,
};
export type {
  DesignerPropertyRowProps,
  DesignerPropertyFieldProps,
  DesignerPropertyLabelProps,
  DesignerPropertyControlsProps,
  DesignerPropertyGroupProps,
};
