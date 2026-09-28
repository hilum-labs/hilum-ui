import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { useState } from "react";
import { DateTimePicker, formatDateTime } from "@hilum/ui";

const CODE = `import { DateTimePicker } from "@hilum/ui"

const [publishAt, setPublishAt] = useState<Date | undefined>()

<DateTimePicker
  aria-label="Publish at"
  value={publishAt}
  onChange={setPublishAt}
  min={new Date()}            // no past days; no past times today
  step={15}
  defaultTime="09:00"
/>`;

function Demo() {
  const [value, setValue] = useState<Date | undefined>();
  const [min] = useState(() => new Date());
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <DateTimePicker
        aria-label="Publish at"
        value={value}
        onChange={setValue}
        min={min}
        step={15}
        clearable
      />
      <p className="caption text-muted-foreground">
        {value ? `Publishes ${formatDateTime(value)}` : "Not scheduled"}
      </p>
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

function DateTimePickerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Date Time Picker</span>
        </div>
        <h1 className="display mb-2 text-foreground">Date Time Picker</h1>
        <p className="body max-w-lg text-muted-foreground">
          One local Date from a DatePicker and a TimePicker side by side. Picking a day keeps the
          time; editing the time keeps the day. Min/max bound both.
        </p>
      </div>

      <PageDocs path="/molecules/date-time-picker/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Schedule" />
          <PreviewBlock
            title="Publish at"
            description="Composes the existing DatePicker with the new TimePicker."
            code={CODE}
            previewClassName="flex-col items-stretch"
          >
            <Demo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/date-time-picker/")({
  head: () => createCatalogPageHead("/molecules/date-time-picker/"),
  component: DateTimePickerPage,
});
