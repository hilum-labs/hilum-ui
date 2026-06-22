import * as React from "react";
import { cn } from "../lib/utils";

export interface AvatarStackItem {
  src?: string;
  name: string;
  fallback?: string;
  colorClass?: string;
}

interface AvatarStackProps {
  avatars: AvatarStackItem[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { wrapper: "size-6 ring-[1.5px]", text: "caption-xs" },
  md: { wrapper: "size-8 ring-2", text: "caption" },
  lg: { wrapper: "size-10 ring-2", text: "body" },
};

function AvatarStack({ avatars, max, size = "md", className }: AvatarStackProps) {
  const shown = max ? avatars.slice(0, max) : avatars;
  const overflow = max && avatars.length > max ? avatars.length - max : 0;
  const s = sizeMap[size];

  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((avatar, i) => (
        <span
          key={i}
          title={avatar.name}
          className={cn(
            "relative inline-flex shrink-0 overflow-hidden rounded-full ring-background",
            s.wrapper,
          )}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.name}
              className="size-full object-cover outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            />
          ) : (
            <span
              className={cn(
                "flex size-full items-center justify-center font-medium",
                s.text,
                avatar.colorClass ?? "bg-muted text-muted-foreground",
              )}
            >
              {avatar.fallback ?? avatar.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center rounded-full ring-background bg-muted font-medium text-muted-foreground",
            s.wrapper,
            s.text,
            "tabular-nums",
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}

export { AvatarStack };
