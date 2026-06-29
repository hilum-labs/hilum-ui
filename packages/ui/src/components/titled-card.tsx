"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardMobileSurface,
} from "./card";
import { CardHeading } from "./card-heading";

interface TitledCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
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
  contentPadding = "default",
  mobileSurface = "flush",
  className,
  contentClassName,
  containerClassName,
  titleClassName,
}: TitledCardProps) {
  const hasHeader = Boolean(title || subtitle || actionButtons);
  const canUseCardHeading = Boolean(title) && !actionButtons && !titleClassName;
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
      className={cn(
        "min-w-0 overflow-hidden border border-border bg-card shadow-natural",
        containerClassName,
        className,
      )}
      data-slot="titled-card"
    >
      {canUseCardHeading ? (
        <CardHeading
          title={title!}
          {...(subtitle ? { description: subtitle } : {})}
          className={cn(isMobileFlat && "max-sm:border-b-0 max-sm:px-0 max-sm:pb-3")}
        >
          {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
        </CardHeading>
      ) : hasHeader ? (
        <CardHeader
          className={cn(
            "flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5",
            isMobileFlat && "max-sm:border-b-0 max-sm:px-0 max-sm:pb-3",
          )}
        >
          <div className="min-w-0 flex-1">
            {title && (
              <CardTitle
                className={cn(
                  "flex min-w-0 items-center gap-2 text-base leading-tight sm:text-lg",
                  titleClassName,
                )}
              >
                {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
                <span className="min-w-0 truncate">{title}</span>
              </CardTitle>
            )}
            {subtitle && (
              <CardDescription className="mt-1 max-w-3xl text-sm leading-5">
                {subtitle}
              </CardDescription>
            )}
          </div>
          {actionButtons && (
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              {actionButtons}
            </div>
          )}
        </CardHeader>
      ) : null}
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
