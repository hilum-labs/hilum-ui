import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import * as React from "react";
import { Calendar } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import type { DateRange } from "react-day-picker";

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const CODE = {
  single: `import { Calendar } from "@hilum/ui"

const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>`,

  range: `import { Calendar } from "@hilum/ui"
import type { DateRange } from "react-day-picker"

const [range, setRange] = React.useState<DateRange | undefined>()

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
/>`,

  multiMonth: `import { Calendar } from "@hilum/ui"

const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  numberOfMonths={2}
  selected={date}
  onSelect={setDate}
/>`,

  disabled: `import { Calendar } from "@hilum/ui"

const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
/>`,
};

function CalendarPage() {
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [multiDate, setMultiDate] = React.useState<Date | undefined>();
  const [disabledDate, setDisabledDate] = React.useState<Date | undefined>();

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Calendar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Calendar</h1>
        <p className="body max-w-lg text-ground-500">
          A date selection component built on react-day-picker v9. Supports
          single dates, ranges, multiple months, and custom disabled states.
        </p>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Calendar · Single" />
          <PreviewBlock
            title="Single date selection"
            description="Pick a single date with click. Selected date highlighted in brand orange."
            code={CODE.single}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block rounded-xl border border-ground-100 bg-white shadow-natural">
                <Calendar
                  mode="single"
                  selected={singleDate}
                  onSelect={setSingleDate}
                />
              </div>
              <p className="caption text-ground-400">
                {singleDate
                  ? `Selected: ${formatDate(singleDate)}`
                  : "No date selected"}
              </p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Calendar · Range" />
          <PreviewBlock
            title="Range selection"
            description="Click a start and end date to select a range."
            code={CODE.range}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block rounded-xl border border-ground-100 bg-white shadow-natural">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                />
              </div>
              <p className="caption text-ground-400">
                From:{" "}
                <span className="text-ground-700">
                  {range?.from ? formatDate(range.from) : "—"}
                </span>
                {"  ·  "}
                To:{" "}
                <span className="text-ground-700">
                  {range?.to ? formatDate(range.to) : "—"}
                </span>
              </p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Calendar · Multiple Months" />
          <PreviewBlock
            title="Two months side by side"
            description="Set numberOfMonths={2} to display a multi-month calendar."
            code={CODE.multiMonth}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block rounded-xl border border-ground-100 bg-white shadow-natural">
                <Calendar
                  mode="single"
                  numberOfMonths={2}
                  selected={multiDate}
                  onSelect={setMultiDate}
                />
              </div>
              <p className="caption text-ground-400">
                {multiDate
                  ? `Selected: ${formatDate(multiDate)}`
                  : "No date selected"}
              </p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Calendar · Disabled Dates" />
          <PreviewBlock
            title="Disabled weekends"
            description="Pass a matcher function to disabled to block specific dates."
            code={CODE.disabled}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block rounded-xl border border-ground-100 bg-white shadow-natural">
                <Calendar
                  mode="single"
                  selected={disabledDate}
                  onSelect={setDisabledDate}
                  disabled={(date) =>
                    date.getDay() === 0 || date.getDay() === 6
                  }
                />
              </div>
              <p className="caption text-ground-400">
                {disabledDate
                  ? `Selected: ${formatDate(disabledDate)}`
                  : "Weekends are unavailable"}
              </p>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/calendar/")({
  head: () => createCatalogPageHead("/atoms/calendar/"),
  component: CalendarPage,
});
