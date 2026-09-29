"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, type CardMobileSurface } from "./card";
import { CardHeadingTitle, type CardHeadingLevel } from "./card-heading";

interface TitledCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  /** Heading level of the title (`h2` … `h6`). Default: 2. */
  headingLevel?: CardHeadingLevel;
  contentPadding?: "default" | "flush-mobile" | "flush";
  mobileSurface?: CardMobileSurface;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  titleClassName?: string;
}

function TitledCard({
  title,
  subtitle,
  children,
  actionButtons,
  icon: Icon,
  headingLevel = 2,
  contentPadding = "default",
  mobileSurface = "flush",
  className,
  contentClassName,
  containerClassName,
  titleClassName,
}: TitledCardProps) {
  const hasHeader = Boolean(title || subtitle || actionButtons);
  const hasContent = Boolean(children);
  const contentPaddingClassName =
    contentPadding === "flush"
      ? "p-0"
      : contentPadding === "flush-mobile"
        ? "p-0 sm:p-5"
        : hasHeader
          ? "p-4 sm:p-5"
          : "p-0 sm:p-5";
  const isMobileFlat = mobileSurface === "flat" || mobileSurface === "flush";

  return (
    <Card
      mobileSurface={mobileSurface}
      className={cn("min-w-0 overflow-hidden", containerClassName, className)}
      data-slot="titled-card"
    >
      {/* One header, with or without actions: the title keeps the same
          heading element and style either way. */}
      {hasHeader && (
        <CardHeader
          className={cn(
            "flex flex-col gap-3 border-b border-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4",
            !hasContent && "border-b-0",
            isMobileFlat && "max-sm:border-b-0 max-sm:px-0 max-sm:pb-3",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
            <div className="min-w-0 flex-1">
              {title && (
                <CardHeadingTitle level={headingLevel} className={cn("truncate", titleClassName)}>
                  {title}
                </CardHeadingTitle>
              )}
              {subtitle && (
                <CardDescription className="mt-0.5 max-w-3xl">{subtitle}</CardDescription>
              )}
            </div>
          </div>
          {actionButtons && (
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
              {actionButtons}
            </div>
          )}
        </CardHeader>
      )}
      {children && (
        <CardContent
          className={cn(
            contentPaddingClassName,
            "min-w-0",
            isMobileFlat && "max-sm:px-0",
            contentClassName,
          )}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}

TitledCard.displayName = "TitledCard";

export { TitledCard, type TitledCardProps };
