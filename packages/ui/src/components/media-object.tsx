import * as React from "react";
import { cn } from "../lib/utils";

interface MediaObjectProps {
  media: React.ReactNode;
  children: React.ReactNode;
  mediaPosition?: "left" | "right";
  align?: "top" | "center" | "bottom";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const alignMap = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

const gapMap = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

function MediaObject({
  media,
  children,
  mediaPosition = "left",
  align = "top",
  gap = "md",
  className,
}: MediaObjectProps) {
  return (
    <div
      className={cn(
        "flex",
        mediaPosition === "right" && "flex-row-reverse",
        alignMap[align],
        gapMap[gap],
        className,
      )}
    >
      <div className="shrink-0">{media}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

MediaObject.displayName = "MediaObject";

export { MediaObject };
