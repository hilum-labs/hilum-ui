import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { useState } from "react";
import { Field, FormatProvider, TimePicker } from "@hilum/ui";

const BASIC_CODE = `import { TimePicker } from "@hilum/ui"

const [opensAt, setOpensAt] = useState<string | null>("09:00")

<TimePicker aria-label="Opens at" value={opensAt} onChange={setOpensAt} step={15} clearable />`;

function BasicDemo() {
  const [value, setValue] = useState<string | null>("09:00");
  return (
    <div className="flex flex-col gap-3">
      <TimePicker aria-label="Opens at" value={value} onChange={setValue} step={15} clearable />
      <p className="caption text-muted-foreground">Value: {value ?? "null"}</p>
    </div>
  );
}

const LOCALE_CODE = `// en-US → 12-hour with AM/PM · de-DE → 24-hour
<FormatProvider locale="de-DE">
  <TimePicker aria-label="Abholzeit" defaultValue="14:30" />
</FormatProvider>

<TimePicker aria-label="Pickup" hourCycle="h12" defaultValue="14:30" />  // force 12h`;

function LocaleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FormatProvider locale="en-US">
        <TimePicker aria-label="Pickup time (en-US)" defaultValue="14:30" />
      </FormatProvider>
      <FormatProvider locale="de-DE">
        <TimePicker aria-label="Abholzeit (de-DE)" defaultValue="14:30" />
      </FormatProvider>
      <FormatProvider locale="ja-JP">
        <TimePicker aria-label="受け取り時間 (ja-JP)" defaultValue="14:30" hourCycle="h12" />
      </FormatProvider>
    </div>
  );
}

const RANGE_CODE = `<Field label="Delivery window start" hint="Between 08:00 and 18:00">
  <TimePicker min="08:00" max="18:00" step={30} />
</Field>`;

function RangeDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-full max-w-xs">
      <Field label="Delivery window start" hint="Between 08:00 and 18:00, in 30-minute steps">
        <TimePicker
          aria-label="Delivery window start"
          value={value}
          onChange={setValue}
          min="08:00"
          max="18:00"
          step={30}
          className="w-full"
        />
      </Field>
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function TimePickerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Time Picker</span>
        </div>
        <h1 className="display mb-2 text-foreground">Time Picker</h1>
        <p className="body max-w-lg text-muted-foreground">
          Segmented time field with hour, minute and AM/PM spinbuttons. 12- or 24-hour display
          follows the locale; values are always “HH:mm”. Supports minute steps and min/max.
        </p>
      </div>

      <PageDocs path="/atoms/time-picker/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Basic" />
          <PreviewBlock
            title="Store hours"
            description="Arrow keys step, digits type, Backspace clears, Home/End jump to the range ends."
            code={BASIC_CODE}
            previewClassName="flex-col items-stretch"
          >
            <BasicDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Locale" />
          <PreviewBlock
            title="12h / 24h from Intl"
            description="The hour cycle and AM/PM labels come from Intl for the active locale."
            code={LOCALE_CODE}
            previewClassName="flex-col items-stretch"
          >
            <LocaleDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Range and step" />
          <PreviewBlock
            title="Clamped window"
            description="Values outside min/max are clamped; typed minutes snap to the step."
            code={RANGE_CODE}
            previewClassName="flex-col items-stretch"
          >
            <RangeDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/time-picker/")({
  head: () => createCatalogPageHead("/atoms/time-picker/"),
  component: TimePickerPage,
});
