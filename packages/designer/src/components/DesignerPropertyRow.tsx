import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerPropertyRowProps extends ComponentPropsWithoutRef<"div"> {
  /** Optional label for direct row usage. Compound usage can use DesignerPropertyLabel. */
  label?: ReactNode;
  /** htmlFor forwarded to the generated label when label is provided. */
  labelFor?: string;
  /** Class name for the generated controls container when label is provided. */
  controlsClassName?: string;
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
  className,
  children,
  ...rest
}: DesignerPropertyRowProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full flex-col items-stretch gap-1.5 py-1.5",
        className,
      )}
      {...rest}
    >
      {label === undefined ? (
        children
      ) : (
        <>
          <DesignerPropertyLabel htmlFor={labelFor}>{label}</DesignerPropertyLabel>
          <DesignerPropertyControls className={controlsClassName}>{children}</DesignerPropertyControls>
        </>
      )}
    </div>
  );
}

function DesignerPropertyLabel({
  className,
  children,
  ...rest
}: DesignerPropertyLabelProps) {
  return (
    <label
      className={cn(
        "caption w-full min-w-0 max-w-full select-none text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}

function DesignerPropertyControls({
  className,
  children,
  ...rest
}: DesignerPropertyControlsProps) {
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
      className={cn("flex min-w-0 max-w-full flex-col gap-3", className)}
      {...rest}
    >
      {title && (
        <div className="caption-xs min-w-0 max-w-full select-none overflow-hidden text-ellipsis uppercase tracking-wider text-muted-foreground">
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
