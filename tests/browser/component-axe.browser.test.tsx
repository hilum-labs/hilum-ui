/**
 * axe (every WCAG 2.2 A/AA rule plus best practices) on the components an
 * audit of the catalog's demos flagged, rendered as apps use them, with the
 * real tokens.css in light, mid and dark. Real-browser only: colour contrast,
 * target size and scrollable regions need layout.
 *
 * Flagged before: Alert and StatCard text on their tints, Calendar selected /
 * today / outside days, the FileThumbnail placeholder, SliderComfortable
 * labels on the track, collapsed SidebarMenuButton names, CheckboxGroup's
 * nested checkbox, TimePicker segment size, CommandList's name, PropertyRow
 * labels, SearchableTable's href-less page links, ScrollArea and Table
 * scroll containers without keyboard access.
 */
import axe from "axe-core";
import * as React from "react";
import { render } from "@testing-library/react";
import { Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Calendar,
  CheckboxGroup,
  CheckboxItem,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  FileDropzone,
  FileThumbnail,
  InputCopy,
  InputNumber,
  PropertyRow,
  ScrollArea,
  SearchableTable,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Slider,
  SliderComfortable,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TimePicker,
} from "@hilum/ui";

const THEMES = ["light", "mid", "dark"] as const;
const noop = () => {};

async function expectNoViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
    },
    // Page-level rules: these are fragments, not documents.
    rules: {
      region: { enabled: false },
      "landmark-one-main": { enabled: false },
      "page-has-heading-one": { enabled: false },
    },
    resultTypes: ["violations"],
  });
  expect(
    results.violations.flatMap((v) =>
      v.nodes.map((n) => `${v.id}: ${n.target.join(" ")}: ${n.failureSummary}`),
    ),
  ).toEqual([]);
}

function Themed({ theme, children }: { theme: string; children: React.ReactNode }) {
  return (
    <div data-theme={theme} className="bg-background p-4 text-foreground">
      {children}
    </div>
  );
}

const ROWS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `Campaign ${i + 1}`,
  owner: i % 2 ? "Ada" : "Grace",
}));

describe("component axe audit (real browser)", () => {
  test.each(THEMES)("Alert, every variant, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <div className="flex flex-col gap-3">
          {(["default", "info", "success", "warning", "destructive"] as const).map((variant) => (
            <Alert key={variant} variant={variant}>
              <Info aria-hidden="true" />
              <AlertTitle>{variant} title</AlertTitle>
              <AlertDescription>Something to know about your store.</AlertDescription>
            </Alert>
          ))}
        </div>
      </Themed>,
    );
    await expectNoViolations(container);
  });

  test.each(THEMES)("StatCard trends and FileThumbnail, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Revenue" value="$48,200" trend={{ value: "+12.5%", direction: "up" }} />
          <StatCard label="Churn" value="3.2%" trend={{ value: "-0.4%", direction: "down" }} />
          <StatCard label="Visits" value="1,204" trend={{ value: "0%", direction: "neutral" }} />
        </div>
        <FileThumbnail name="brand-guidelines.pdf" type="PDF" />
      </Themed>,
    );
    await expectNoViolations(container);
  });

  test.each(THEMES)("Calendar with selected, today and outside days, %s", async (theme) => {
    const today = new Date();
    const selected = new Date(today.getFullYear(), today.getMonth(), 12);
    const { container } = render(
      <Themed theme={theme}>
        <div className="inline-block rounded-xl bg-card p-3">
          <Calendar mode="single" selected={selected} showOutsideDays />
        </div>
      </Themed>,
    );
    await expectNoViolations(container);
  });

  test.each(THEMES)("sliders, PropertyRow and TimePicker, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <div className="flex max-w-md flex-col gap-4 bg-card p-4">
          <SliderComfortable label="Roundness" value={2} min={0} max={5} step={1} onChange={noop} />
          <SliderComfortable label="Volume" value={50} variant="scrubber" onChange={noop} />
          <PropertyRow layout="inline" label="Opacity">
            <Slider value={[40]} min={0} max={100} />
            <InputNumber
              value={40}
              onChange={noop}
              unit="%"
              min={0}
              max={100}
              className="w-[72px] shrink-0"
            />
          </PropertyRow>
          <PropertyRow label="Width">
            <InputNumber value={320} onChange={noop} unit="px" />
          </PropertyRow>
          <TimePicker aria-label="Opens at" defaultValue="09:00" clearable />
        </div>
      </Themed>,
    );
    await expectNoViolations(container);
  });

  test.each(THEMES)("CheckboxGroup, Command and a collapsed sidebar, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <CheckboxGroup checkedIndices={new Set([0])}>
          {["Apples", "Bananas"].map((label, index) => (
            <CheckboxItem
              key={label}
              index={index}
              label={label}
              checked={index === 0}
              onToggle={() => {}}
            />
          ))}
        </CheckboxGroup>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem value="calendar">Calendar</CommandItem>
            <CommandItem value="settings">Settings</CommandItem>
          </CommandList>
        </Command>
        <nav aria-label="Collapsed" className="w-12 bg-card">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton data-state="collapsed">
                <Info aria-hidden="true" />
                <span>Inbox</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </nav>
      </Themed>,
    );
    await expectNoViolations(container);
  });

  test.each(THEMES)("SearchableTable paging and scroll containers, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <SearchableTable
          data={ROWS}
          searchTerm=""
          onSearchChange={noop}
          columns={[
            { key: "name", label: "Campaign" },
            { key: "owner", label: "Owner" },
          ]}
          pagination={{ pageSize: 5, currentPage: 1, onPageChange: () => {} }}
        />
        <ScrollArea data-testid="notes" className="h-24 w-64 rounded-md border">
          <p className="p-3">
            {"Long release notes that scroll inside a fixed-height area. ".repeat(12)}
          </p>
        </ScrollArea>
        <Table data-testid="orders" containerClassName="max-h-28 overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Themed>,
    );
    // The overflowing, control-free containers joined the tab order.
    await expect
      .poll(
        () =>
          container.querySelector<HTMLElement>(
            "[data-testid=notes] [data-slot=scroll-area-viewport]",
          )?.tabIndex,
      )
      .toBe(0);
    await expect
      .poll(
        () =>
          container
            .querySelector("[data-testid=orders]")
            ?.closest<HTMLElement>("[data-slot=table-container]")?.tabIndex,
      )
      .toBe(0);
    await expectNoViolations(container);
  });

  test.each(THEMES)("disabled FileDropzone and InputCopy, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <FileDropzone disabled label="Upload files" description="Enable editing first." />
        <InputCopy disabled label="Invite code" value="HILUM-2026" />
      </Themed>,
    );
    await expectNoViolations(container);
  });
});
