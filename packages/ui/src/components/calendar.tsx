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
        caption_label: "body font-semibold text-ground-900",
        nav: "flex items-center justify-between absolute inset-x-0 top-1",
        button_previous: cn(
          "absolute left-0 h-7 w-7 flex items-center justify-center rounded-md",
          "text-ground-400 hover:bg-ground-100 hover:text-ground-700 transition-colors",
        ),
        button_next: cn(
          "absolute right-0 h-7 w-7 flex items-center justify-center rounded-md",
          "text-ground-400 hover:bg-ground-100 hover:text-ground-700 transition-colors",
        ),
        month_grid: "w-full border-collapse mt-1",
        weekdays: "flex",
        weekday: "w-9 h-9 flex items-center justify-center label text-ground-400 font-normal",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center",
        day_button: cn(
          "h-9 w-9 flex items-center justify-center rounded-full body font-normal",
          "text-ground-900 hover:bg-ground-100 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
        ),
        selected:
          "[&>button]:bg-brand-primary [&>button]:text-white [&>button]:hover:bg-brand-primary/90",
        today: "[&>button]:font-semibold [&>button]:text-brand-primary",
        outside: "opacity-40 [&>button]:text-ground-400",
        disabled: "opacity-30 [&>button]:cursor-not-allowed",
        range_start: "[&>button]:bg-brand-primary [&>button]:text-white [&>button]:rounded-full",
        range_end: "[&>button]:bg-brand-primary [&>button]:text-white [&>button]:rounded-full",
        range_middle:
          "[&>button]:bg-brand-primary/15 [&>button]:text-ground-900 [&>button]:rounded-none",
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
