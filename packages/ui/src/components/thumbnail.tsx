"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useIcon, type IconComponent } from "../lib/icon-context";

/**
 * Sizes match `SkeletonThumbnail`, so a loading row swaps in without a shift:
 * xs 24px, sm 32px, md 40px (index rows), lg 80px (detail pages, media).
 */
const thumbnailSizeClasses = {
  xs: "size-6 rounded-md [&_svg]:size-3",
  sm: "size-8 rounded-md [&_svg]:size-4",
  md: "size-10 rounded-lg [&_svg]:size-5",
  lg: "size-20 rounded-xl [&_svg]:size-8",
} as const;

type ThumbnailSize = keyof typeof thumbnailSizeClasses;

interface ThumbnailProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Image URL. Without one (or if it fails to load) a neutral placeholder icon shows. */
  src?: string | null;
  /**
   * Alternative text for the image, e.g. the product title. Pass "" when the
   * thumbnail sits next to text that already names the item.
   */
  alt: string;
  /** Default "md" (40px). */
  size?: ThumbnailSize;
  /** `cover` crops to fill the square (default); `contain` letterboxes. */
  fit?: "cover" | "contain";
  /** Placeholder icon. Default: the image icon from the active icon library. */
  placeholderIcon?: IconComponent;
  /** Forwarded to the <img>, e.g. "eager" for above-the-fold media. Default "lazy". */
  loading?: "lazy" | "eager";
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * Square product / resource image (Polaris Thumbnail): a bordered, rounded
 * tile at a fixed size with `object-fit`, and a neutral placeholder when there
 * is no image.
 */
function Thumbnail({
  src,
  alt,
  size = "md",
  fit = "cover",
  placeholderIcon,
  loading = "lazy",
  className,
  ref,
  ...props
}: ThumbnailProps) {
  const DefaultIcon = useIcon("image");
  const Icon = placeholderIcon ?? DefaultIcon;
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      ref={ref}
      data-slot="thumbnail"
      data-size={size}
      data-empty={showImage ? undefined : ""}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        "border border-border bg-muted text-muted-foreground",
        // A hairline inside the image edge keeps white product shots visible on white cards.
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_6%,transparent)]",
        thumbnailSizeClasses[size],
        fit === "contain" && showImage && "bg-background",
        className,
      )}
      {...(!showImage && alt ? { role: "img", "aria-label": alt } : {})}
      {...props}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          onError={() => setFailedSrc(src ?? null)}
          className={cn("size-full", fit === "contain" ? "object-contain" : "object-cover")}
        />
      ) : (
        <Icon aria-hidden="true" strokeWidth={1.5} />
      )}
    </span>
  );
}

Thumbnail.displayName = "Thumbnail";

export { Thumbnail };
export type { ThumbnailProps, ThumbnailSize };
