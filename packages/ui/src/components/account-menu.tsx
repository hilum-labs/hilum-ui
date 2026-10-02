"use client";

import * as React from "react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "../lib/utils";

function AccountMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="account-menu-content"
      sideOffset={sideOffset}
      className={cn(
        "w-72 overflow-hidden rounded-xl border border-border bg-card p-0 text-foreground shadow-elevated",
        className,
      )}
      {...props}
    />
  );
}
AccountMenuContent.displayName = "AccountMenuContent";

interface AccountMenuHeaderProps extends React.ComponentProps<"div"> {
  name: React.ReactNode;
  email?: React.ReactNode;
  avatarSrc?: string | null;
  avatarAlt?: string;
  fallback?: React.ReactNode;
}

function AccountMenuHeader({
  name,
  email,
  avatarSrc,
  avatarAlt,
  fallback,
  className,
  ...props
}: AccountMenuHeaderProps) {
  return (
    <div
      data-slot="account-menu-header"
      className={cn(
        "flex flex-col items-center px-5 py-5 text-center normal-case tracking-normal",
        className,
      )}
      {...props}
    >
      <Avatar size="lg" className="mb-3">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={avatarAlt ?? ""} />}
        <AvatarFallback className="bg-brand-primary text-primary-foreground">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <p className="body font-medium leading-tight text-foreground">{name}</p>
      {email && <p className="caption text-muted-foreground">{email}</p>}
    </div>
  );
}
AccountMenuHeader.displayName = "AccountMenuHeader";

function AccountMenuSection({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="account-menu-section" className={cn("p-2", className)} {...props} />;
}
AccountMenuSection.displayName = "AccountMenuSection";

interface AccountMenuItemProps extends React.ComponentProps<typeof DropdownMenuItem> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
}

function AccountMenuItem({
  icon,
  trailing,
  description,
  destructive,
  children,
  className,
  ...props
}: AccountMenuItemProps) {
  return (
    <DropdownMenuItem
      data-slot="account-menu-item"
      className={cn(
        "min-h-10 rounded-md px-2.5 py-2",
        "group",
        destructive
          ? "text-destructive-text focus:bg-destructive/10 focus:text-destructive-text"
          : "text-foreground focus:bg-active focus:text-foreground",
        "data-[disabled]:opacity-40",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="body truncate font-medium leading-tight">{children}</span>
        {description && (
          <span className="caption truncate font-normal text-muted-foreground group-focus:text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {trailing && <span className="caption ms-3 shrink-0 text-muted-foreground">{trailing}</span>}
    </DropdownMenuItem>
  );
}
AccountMenuItem.displayName = "AccountMenuItem";

function AccountMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      data-slot="account-menu-separator"
      className={cn("m-0 bg-border", className)}
      {...props}
    />
  );
}
AccountMenuSeparator.displayName = "AccountMenuSeparator";

export {
  AccountMenuContent,
  AccountMenuHeader,
  AccountMenuSection,
  AccountMenuItem,
  AccountMenuSeparator,
};
