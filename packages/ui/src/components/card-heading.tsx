import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface CardHeadingAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

/** Heading level of a card title. Cards on a page sit under its h1, so the default is 2. */
type CardHeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * The one card-title style (14px semibold, like Shopify admin card headings),
 * shared by CardHeading and TitledCard whether or not the card has actions.
 */
const cardHeadingTitleClassName = "body min-w-0 font-semibold text-balance text-foreground";

interface CardHeadingTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Rendered heading element (`h2` … `h6`). Default: 2. */
  level?: CardHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
}

/** A card title rendered as a real heading element in the shared card-title style. */
function CardHeadingTitle({ level = 2, className, ...props }: CardHeadingTitleProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      data-slot="card-heading-title"
      className={cn(cardHeadingTitleClassName, className)}
      {...props}
    />
  );
}
CardHeadingTitle.displayName = "CardHeadingTitle";

interface CardHeadingProps {
  title: string;
  description?: string;
  actions?: CardHeadingAction[];
  children?: React.ReactNode; // e.g. avatar or icon on the left
  /** Heading level of the title (`h2` … `h6`). Default: 2. */
  headingLevel?: CardHeadingLevel;
  className?: string;
}

function CardHeading({
  title,
  description,
  actions,
  children,
  headingLevel = 2,
  className,
}: CardHeadingProps) {
  return (
    <div
      data-slot="card-heading"
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border px-5 py-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {children}
        <div className="min-w-0">
          <CardHeadingTitle level={headingLevel} className="truncate">
            {title}
          </CardHeadingTitle>
          {description && (
            <p className="caption mt-0.5 text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex shrink-0 items-center gap-2">
          {actions.map((action, i) =>
            action.href ? (
              <Button key={i} size="sm" variant={action.variant ?? "default"} asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button
                key={i}
                size="sm"
                variant={action.variant ?? "default"}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export { CardHeading, CardHeadingTitle };
export type { CardHeadingAction, CardHeadingLevel, CardHeadingProps, CardHeadingTitleProps };
