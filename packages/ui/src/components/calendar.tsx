"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center px-10",
        caption_label: "body font-semibold text-foreground",
        nav: "flex items-center justify-between absolute inset-x-0 top-1",
        button_previous: cn(
          "absolute left-0 flex size-10 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors",
        ),
        button_next: cn(
          "absolute right-0 flex size-10 items-center justify-center rounded-md",
          "text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors",
        ),
        month_grid: "w-full border-collapse mt-1",
        weekdays: "flex",
        weekday: "flex size-10 items-center justify-center label text-muted-foreground font-normal",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center",
        day_button: cn(
          "flex size-10 items-center justify-center rounded-full body font-normal",
          "text-foreground hover:bg-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
        ),
        selected:
          "[&>button]:bg-brand-primary [&>button]:text-background [&>button]:hover:bg-brand-primary/90",
        today: "[&>button]:font-semibold [&>button]:text-brand-primary",
        outside: "opacity-40 [&>button]:text-muted-foreground",
        disabled: "opacity-30 [&>button]:cursor-not-allowed",
        range_start:
          "[&>button]:bg-brand-primary [&>button]:text-background [&>button]:rounded-full",
        range_end: "[&>button]:bg-brand-primary [&>button]:text-background [&>button]:rounded-full",
        range_middle:
          "[&>button]:bg-brand-primary/15 [&>button]:text-foreground [&>button]:rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft size={14} /> : <ChevronRight size={14} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
