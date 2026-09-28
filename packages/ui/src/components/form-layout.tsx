import * as React from "react";
import { cn } from "../lib/utils";

/* ─────────────────────── FormLayout ─────────────────────── */

interface FormLayoutProps extends React.ComponentProps<"div"> {
  /** Space between rows. Default "md". */
  gap?: "sm" | "md";
}

/**
 * Vertical rhythm for form fields (Polaris `FormLayout`): consistent spacing
 * between rows, with `FormLayout.Group` for fields that share a row.
 *
 *   <FormLayout>
 *     <Field label="Store name"><Input /></Field>
 *     <FormLayout.Group>
 *       <Field label="First name"><Input /></Field>
 *       <Field label="Last name"><Input /></Field>
 *     </FormLayout.Group>
 *   </FormLayout>
 */
function FormLayoutRoot({ className, gap = "md", ...props }: FormLayoutProps) {
  return (
    <div
      data-slot="form-layout"
      className={cn("flex min-w-0 flex-col", gap === "sm" ? "gap-3" : "gap-4", className)}
      {...props}
    />
  );
}
FormLayoutRoot.displayName = "FormLayout";

interface FormLayoutGroupProps extends Omit<React.ComponentProps<"div">, "title"> {
  /**
   * Narrower minimum item width (7rem instead of 13rem) so short fields —
   * dimensions, prices, dates — share a row even on small screens.
   */
  condensed?: boolean;
  /** Group heading; the group becomes `role="group"` labelled by it. */
  title?: React.ReactNode;
  /** Help text under the group, linked via `aria-describedby`. */
  helpText?: React.ReactNode;
}

/** A row of fields that wraps responsively: items keep a minimum width and wrap when space runs out. */
function FormLayoutGroup({
  condensed = false,
  title,
  helpText,
  className,
  children,
  ...props
}: FormLayoutGroupProps) {
  const id = React.useId();
  const titleId = `${id}-title`;
  const helpId = `${id}-help`;
  return (
    <div
      data-slot="form-layout-group"
      data-condensed={condensed || undefined}
      {...(title ? { role: "group", "aria-labelledby": titleId } : {})}
      {...(helpText ? { "aria-describedby": helpId } : {})}
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    >
      {title && (
        <div id={titleId} className="body font-medium text-foreground">
          {title}
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-wrap gap-3 [&>*]:min-w-0",
          condensed ? "[&>*]:flex-[1_1_7rem]" : "[&>*]:flex-[1_1_13rem]",
        )}
      >
        {children}
      </div>
      {helpText && (
        <p id={helpId} className="caption text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
FormLayoutGroup.displayName = "FormLayout.Group";

const FormLayout = Object.assign(FormLayoutRoot, { Group: FormLayoutGroup });

export { FormLayout, FormLayoutGroup };
export type { FormLayoutProps, FormLayoutGroupProps };
