"use client";

import * as React from "react";
import { File, Image } from "lucide-react";
import { cn } from "../lib/utils";

interface MediaAssetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  src?: string | null;
  alt?: string;
  meta?: React.ReactNode;
  details?: React.ReactNode;
  actions?: React.ReactNode;
  selected?: boolean;
  mediaType?: "image" | "file" | "video" | "unknown";
  orientation?: "responsive" | "grid" | "list";
  onSelect?: () => void;
}

function MediaAssetCard({
  name,
  src,
  alt = "",
  meta,
  details,
  actions,
  selected,
  mediaType = src ? "image" : "file",
  orientation = "responsive",
  onSelect,
  className,
  onClick,
  ...props
}: MediaAssetCardProps) {
  const isInteractive = Boolean(onSelect || onClick);
  const Wrapper = isInteractive ? "button" : "div";
  const isList = orientation === "list";
  const isGrid = orientation === "grid";
  const showImage = Boolean(src && mediaType === "image");

  const fallbackIcon =
    mediaType === "image" ? (
      <Image className="size-6 text-muted-foreground" aria-hidden="true" />
    ) : (
      <File className="size-6 text-muted-foreground" aria-hidden="true" />
    );

  return (
    <div
      className={cn(
        "group min-w-0",
        isGrid && "overflow-hidden rounded-xl border border-border bg-card shadow-natural",
        isList && "flex gap-3 border-b border-border py-3 last:border-b-0",
        orientation === "responsive" &&
          "flex gap-3 border-b border-border py-3 last:border-b-0 sm:block sm:overflow-hidden sm:rounded-xl sm:border sm:bg-card sm:py-0 sm:shadow-natural",
        selected && "ring-2 ring-brand-primary/35",
        className,
      )}
      data-slot="media-asset-card"
      data-selected={selected ? "true" : "false"}
      {...props}
    >
      <Wrapper
        type={Wrapper === "button" ? "button" : undefined}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted text-left",
          "transition-[background-color,box-shadow,scale] duration-150",
          isInteractive &&
            "cursor-pointer active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
          isList && "size-16 rounded-lg",
          isGrid && "aspect-square w-full",
          orientation === "responsive" &&
            "size-16 rounded-lg sm:aspect-square sm:size-auto sm:w-full sm:rounded-none",
        )}
        onClick={(event) => {
          onClick?.(event as React.MouseEvent<HTMLDivElement>);
          if (!event.defaultPrevented) onSelect?.();
        }}
        aria-label={isInteractive && typeof name === "string" ? name : undefined}
      >
        {showImage ? (
          <img
            src={src ?? undefined}
            alt={alt}
            className="size-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          />
        ) : (
          fallbackIcon
        )}
      </Wrapper>

      <div
        className={cn(
          "min-w-0 flex-1",
          isGrid && "p-3",
          isList && "py-0.5",
          orientation === "responsive" && "py-0.5 sm:p-3",
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 break-words text-sm font-medium leading-5 text-foreground sm:truncate">
              {name}
            </p>
            {meta && <p className="caption mt-0.5 truncate text-muted-foreground">{meta}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {details && <div className="caption mt-2 text-pretty text-muted-foreground">{details}</div>}
      </div>
    </div>
  );
}

MediaAssetCard.displayName = "MediaAssetCard";

export { MediaAssetCard };
export type { MediaAssetCardProps };
