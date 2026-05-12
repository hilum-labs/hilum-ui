"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

const sizeMap = {
  xs: "size-5 caption-xs",
  sm: "size-7 caption",
  md: "size-8 body",
  lg: "size-10 body-lg",
  xl: "size-12 subheading",
} as const;

type AvatarSize = keyof typeof sizeMap;

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeMap[size],
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-taupe-100 body font-semibold text-taupe-600",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const statusColorMap = {
  online: "bg-brand-secondary",
  offline: "bg-taupe-300",
  busy: "bg-red-500",
  away: "bg-brand-secondary",
};

const statusSizeMap = {
  xs: "size-1.5 ring-1",
  sm: "size-2 ring-1",
  md: "size-2.5 ring-[1.5px]",
  lg: "size-3 ring-2",
  xl: "size-3.5 ring-2",
};

interface AvatarWithStatusProps extends AvatarProps {
  status?: keyof typeof statusColorMap;
}

const AvatarWithStatus = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarWithStatusProps & { children?: React.ReactNode }
>(({ status, size = "md", className, children, ...props }, ref) => (
  <div className="relative inline-flex shrink-0">
    <Avatar ref={ref} size={size} className={className} {...props}>
      {children}
    </Avatar>
    {status && (
      <span
        className={cn(
          "absolute bottom-0 right-0 rounded-full ring-white",
          statusColorMap[status],
          statusSizeMap[size],
        )}
      />
    )}
  </div>
));
AvatarWithStatus.displayName = "AvatarWithStatus";

export { Avatar, AvatarImage, AvatarFallback, AvatarWithStatus };
