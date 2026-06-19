"use client";

import * as React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "../lib/utils";

const AccountMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "w-80 overflow-hidden rounded-3xl bg-ground-900 p-0 text-ground-50 shadow-elevated",
      "ring-1 ring-ground-800",
      className,
    )}
    {...props}
  />
));
AccountMenuContent.displayName = "AccountMenuContent";

interface AccountMenuHeaderProps extends React.ComponentProps<"div"> {
  name: React.ReactNode;
  email?: React.ReactNode;
  avatarSrc?: string | null;
  avatarAlt?: string;
  fallback?: React.ReactNode;
}

const AccountMenuHeader = React.forwardRef<HTMLDivElement, AccountMenuHeaderProps>(
  ({ name, email, avatarSrc, avatarAlt, fallback, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center px-6 py-8 text-center", className)}
      {...props}
    >
      <Avatar size="xl" className="mb-4 size-16">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={avatarAlt ?? ""} />}
        <AvatarFallback className="bg-brand-primary text-2xl text-primary-foreground">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <p className="body-lg font-medium leading-tight text-ground-50">{name}</p>
      {email && <p className="body text-ground-400">{email}</p>}
    </div>
  ),
);
AccountMenuHeader.displayName = "AccountMenuHeader";

const AccountMenuSection = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-3", className)} {...props} />
  ),
);
AccountMenuSection.displayName = "AccountMenuSection";

interface AccountMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  description?: React.ReactNode;
}

const AccountMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuItem>,
  AccountMenuItemProps
>(({ icon, trailing, description, children, className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      "min-h-11 rounded-lg px-3 py-2.5 text-ground-50",
      "group",
      "focus:bg-primary focus:text-primary-foreground",
      "data-[disabled]:opacity-40",
      "[&_svg:not([class*='size-'])]:size-5",
      className,
    )}
    {...props}
  >
    {icon && <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>}
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="body-lg truncate font-medium leading-tight">{children}</span>
      {description && (
        <span className="body truncate font-normal text-ground-400 group-focus:text-primary-foreground/80">
          {description}
        </span>
      )}
    </span>
    {trailing && <span className="ml-3 shrink-0 text-ground-400">{trailing}</span>}
  </DropdownMenuItem>
));
AccountMenuItem.displayName = "AccountMenuItem";

const AccountMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator ref={ref} className={cn("m-0 bg-ground-800", className)} {...props} />
));
AccountMenuSeparator.displayName = "AccountMenuSeparator";

export {
  AccountMenuContent,
  AccountMenuHeader,
  AccountMenuSection,
  AccountMenuItem,
  AccountMenuSeparator,
};
