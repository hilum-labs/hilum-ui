"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type ChevronOrientation = "left" | "right" | "up" | "down";

/**
 * Navigation chevron with a single source of truth for RTL mirroring.
 *
 * react-day-picker is inconsistent about direction: its default `Nav`
 * (navLayout undefined / "after") always passes `orientation="left"` for
 * "previous" and `"right"` for "next", but with `navLayout="around"` it swaps
 * them itself when the `dir="rtl"` *prop* is set (and only then — an inherited
 * `dir` from an ancestor is invisible to it). Mirroring on top of that
 * double-flips the icon. So we undo rdp's swap to recover the logical
 * orientation ("left" = previous, "right" = next), then mirror purely in CSS
 * via `:dir(rtl)`, which resolves the *nearest* `dir` (prop or ancestor, and a
 * nested `dir="ltr"` inside an RTL page correctly cancels it — unlike
 * Tailwind's `rtl:` variant, which also matches `[dir=rtl] *`).
 */
function CalendarChevron({
  orientation = "left",
  className,
  rdpMirrored,
}: {
  orientation?: ChevronOrientation | undefined;
  className?: string | undefined;
  rdpMirrored: boolean;
}) {
  if (orientation === "up") return <ChevronUp size={14} className={className} />;
  if (orientation === "down") return <ChevronDown size={14} className={className} />;
  const logical = rdpMirrored ? (orientation === "left" ? "right" : "left") : orientation;
  const Icon = logical === "left" ? ChevronLeft : ChevronRight;
  return (
    <Icon
      size={14}
      data-direction={logical === "left" ? "previous" : "next"}
      className={cn("[&:dir(rtl)]:-scale-x-100", className)}
    />
  );
}

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const rdpMirrored = props.navLayout === "around" && props.dir === "rtl";
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "body font-semibold text-foreground",
        nav: "flex items-center justify-between absolute inset-x-0 top-1",
        button_previous: cn(
          "absolute start-0 flex h-9 w-9 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors",
        ),
        button_next: cn(
          "absolute end-0 flex h-9 w-9 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors",
        ),
        month_grid: "w-full border-collapse mt-1",
        weekdays: "flex",
        weekday: "flex h-9 w-9 items-center justify-center label text-muted-foreground font-normal",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center",
        day_button: cn(
          "flex h-9 w-9 items-center justify-center rounded-full body font-normal",
          "text-foreground hover:bg-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ),
        // White on the brand (4.6:1): text-background was 3.9:1 in dark mode.
        selected:
          "[&>button]:bg-brand-primary [&>button]:text-primary-foreground [&>button]:hover:bg-brand-primary/90",
        today: "[&>button]:font-semibold [&>button]:text-brand-text",
        // Outside days are selectable, so they stay ≥ 4.5:1 (opacity-40 was 1.7:1).
        outside: "[&>button]:text-muted-foreground",
        disabled: "opacity-30 [&>button]:cursor-not-allowed",
        range_start:
          "[&>button]:bg-brand-primary [&>button]:text-primary-foreground [&>button]:rounded-full",
        range_end:
          "[&>button]:bg-brand-primary [&>button]:text-primary-foreground [&>button]:rounded-full",
        range_middle:
          "[&>button]:bg-brand-primary/15 [&>button]:text-foreground [&>button]:rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) => (
          <CalendarChevron
            orientation={orientation}
            className={chevronClassName}
            rdpMirrored={rdpMirrored}
          />
        ),
        ...components,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
