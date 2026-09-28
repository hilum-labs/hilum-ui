import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/* ─────────────────────── PageLayout ─────────────────────── */

interface PageLayoutProps extends React.ComponentProps<"div"> {
  /** Vertical/horizontal gap between sections. Default "md" (1rem; 1.25rem from `md`). */
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4 md:gap-5",
  lg: "gap-6 md:gap-8",
} as const;

/**
 * Page content grid for admin screens (Polaris `Layout`). Sections sit side
 * by side while there's room and wrap to a single column on narrow screens —
 * no breakpoints to manage.
 *
 *   <PageLayout>
 *     <PageLayout.Section>Primary cards</PageLayout.Section>
 *     <PageLayout.Section variant="secondary">Sidebar cards</PageLayout.Section>
 *   </PageLayout>
 */
function PageLayoutRoot({ className, gap = "md", ...props }: PageLayoutProps) {
  return (
    <div
      data-slot="page-layout"
      className={cn("flex min-w-0 flex-wrap items-start", gapClasses[gap], className)}
      {...props}
    />
  );
}
PageLayoutRoot.displayName = "PageLayout";

const pageLayoutSectionVariants = cva("flex min-w-0 flex-col gap-4 md:gap-5", {
  variants: {
    variant: {
      /** Main column — takes about two thirds next to a secondary column. */
      primary: "flex-[2_2_30rem]",
      /** Sidebar column (one third). */
      secondary: "flex-[1_1_15rem]",
      /** Full row. */
      full: "flex-[1_1_100%]",
      /** Two equal columns. */
      oneHalf: "flex-[1_1_22.5rem]",
      /** Three equal columns. */
      oneThird: "flex-[1_1_15rem]",
    },
  },
  defaultVariants: { variant: "primary" },
});

interface PageLayoutSectionProps
  extends React.ComponentProps<"div">, VariantProps<typeof pageLayoutSectionVariants> {}

function PageLayoutSection({ className, variant, ...props }: PageLayoutSectionProps) {
  return (
    <div
      data-slot="page-layout-section"
      data-variant={variant ?? "primary"}
      className={cn(pageLayoutSectionVariants({ variant }), className)}
      {...props}
    />
  );
}
PageLayoutSection.displayName = "PageLayout.Section";

/* ─────────────────────── AnnotatedSection ─────────────────────── */

interface AnnotatedSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Heading element for the title. Default "h2". */
  titleAs?: "h2" | "h3" | "h4";
  /** Extra content under the description (e.g. a "Learn more" link). */
  aside?: React.ReactNode;
}

/**
 * Settings-style row: title and description on the inline-start side, content
 * (usually a Card) on the other. Stacks on mobile; mirrors in RTL.
 */
function AnnotatedSection({
  title,
  description,
  titleAs: Heading = "h2",
  aside,
  className,
  children,
  id,
  ...props
}: AnnotatedSectionProps) {
  const generatedId = React.useId();
  const headingId = `${id ?? generatedId}-title`;
  return (
    <section
      data-slot="annotated-section"
      aria-labelledby={headingId}
      id={id}
      className={cn(
        "grid min-w-0 flex-[1_1_100%] gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1.5 md:pt-4">
        <Heading id={headingId} className="body-lg font-semibold text-balance text-foreground">
          {title}
        </Heading>
        {description && <div className="body text-pretty text-muted-foreground">{description}</div>}
        {aside}
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  );
}
AnnotatedSection.displayName = "AnnotatedSection";

const PageLayout = Object.assign(PageLayoutRoot, {
  Section: PageLayoutSection,
  AnnotatedSection,
});

export { PageLayout, PageLayoutSection, AnnotatedSection, pageLayoutSectionVariants };
export type { PageLayoutProps, PageLayoutSectionProps, AnnotatedSectionProps };
