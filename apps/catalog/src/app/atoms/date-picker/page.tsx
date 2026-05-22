import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import * as React from "react";
import { DatePicker, formatDate } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

const CODE = {
  single: `import { DatePicker } from "@hilum/ui"

const [date, setDate] = React.useState<Date | undefined>()

<DatePicker value={date} onChange={setDate} />`,

  range: `import { DatePicker } from "@hilum/ui"

const [from, setFrom] = React.useState<Date | undefined>()
const [to, setTo] = React.useState<Date | undefined>()

<div className="flex items-end gap-3">
  <div className="flex flex-col gap-1.5">
    <span className="label text-ground-400">From</span>
    <DatePicker value={from} onChange={setFrom} placeholder="Start date" />
  </div>
  <span className="body text-ground-400 pb-1.5">—</span>
  <div className="flex flex-col gap-1.5">
    <span className="label text-ground-400">To</span>
    <DatePicker value={to} onChange={setTo} placeholder="End date" />
  </div>
</div>`,

  disabled: `import { DatePicker } from "@hilum/ui"

<DatePicker disabled={true} placeholder="Pick a date" />`,
};

function DatePickerPage() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [from, setFrom] = React.useState<Date | undefined>();
  const [to, setTo] = React.useState<Date | undefined>();

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Date Picker</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Date Picker</h1>
        <p className="body max-w-lg text-ground-500">
          A composable date picker combining Calendar with a Popover trigger.
          Supports single dates, date ranges, and disabled states.
        </p>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Date Picker · Single" />
          <PreviewBlock
            title="Single date picker"
            description="Click the button to open a calendar popover and select a date."
            code={CODE.single}
          >
            <div className="flex flex-col items-center gap-3">
              <DatePicker value={date} onChange={setDate} />
              <p className="caption text-ground-400">
                Selected:{" "}
                <span className="text-ground-700">
                  {date ? formatDate(date) : "None"}
                </span>
              </p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Date Picker · Range" />
          <PreviewBlock
            title="Date range picker"
            description="Two date pickers side by side for selecting a start and end date."
            code={CODE.range}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-end gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="label text-ground-400">From</span>
                  <DatePicker
                    value={from}
                    onChange={setFrom}
                    placeholder="Start date"
                  />
                </div>
                <span className="body text-ground-400 pb-1.5">—</span>
                <div className="flex flex-col gap-1.5">
                  <span className="label text-ground-400">To</span>
                  <DatePicker
                    value={to}
                    onChange={setTo}
                    placeholder="End date"
                  />
                </div>
              </div>
              <p className="caption text-ground-400">
                From:{" "}
                <span className="text-ground-700">
                  {from ? formatDate(from) : "—"}
                </span>
                {"  ·  "}
                To:{" "}
                <span className="text-ground-700">
                  {to ? formatDate(to) : "—"}
                </span>
              </p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Date Picker · Disabled" />
          <PreviewBlock
            title="Disabled state"
            description="Set disabled={true} to prevent interaction entirely."
            code={CODE.disabled}
          >
            <div className="flex flex-col items-center gap-3">
              <DatePicker disabled placeholder="Pick a date" />
              <p className="caption text-ground-400">
                This field is currently unavailable.
              </p>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/date-picker/")({
  head: () => createCatalogPageHead("/atoms/date-picker/"),
  component: DatePickerPage,
});
