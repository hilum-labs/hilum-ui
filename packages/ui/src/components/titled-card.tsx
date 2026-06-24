"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { CardHeading } from "./card-heading";

interface TitledCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
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
  className,
  contentClassName,
  containerClassName,
  titleClassName,
}: TitledCardProps) {
  const hasHeader = Boolean(title || subtitle || actionButtons);
  const canUseCardHeading = Boolean(title) && !actionButtons && !titleClassName;

  return (
    <Card
      className={cn(
        "min-w-0 overflow-hidden border border-border bg-card shadow-natural",
        "max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:shadow-none",
        containerClassName,
        className,
      )}
      data-slot="titled-card"
    >
      {canUseCardHeading ? (
        <CardHeading
          title={title!}
          {...(subtitle ? { description: subtitle } : {})}
          className="max-sm:border-b-0 max-sm:px-0 max-sm:pb-3"
        >
          {Icon && <Icon className="size-5 shrink-0 text-muted-foreground" />}
        </CardHeading>
      ) : hasHeader ? (
        <CardHeader className="flex flex-col gap-3 border-b border-border p-4 max-sm:border-b-0 max-sm:px-0 max-sm:pb-3 sm:flex-row sm:items-start sm:justify-between sm:p-5">
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
            hasHeader ? "p-4 sm:p-5" : "p-0 sm:p-5",
            "min-w-0 max-sm:px-0",
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
