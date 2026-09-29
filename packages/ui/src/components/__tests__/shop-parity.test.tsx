import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  FormatProvider,
  formatCurrency,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  pluralize,
  toDate,
  toISODate,
  useFormatter,
} from "../../lib/format";
import { DateText, RelativeTime } from "../date-text";
import {
  StatusBadge,
  statusBadgeVariantFor,
  statusToneFor,
  DEFAULT_STATUS_TONE,
} from "../status-badge";
import { Badge, STATUS_TONE_BADGE } from "../badge";
import { StatusTile } from "../status-tile";
import { StatCard, StatCardGrid, StatGrid } from "../stat-card";
import { EmptyState } from "../empty-state";
import { ContextualSaveBar, useUnsavedChangesWarning } from "../contextual-save-bar";
import { SearchInput } from "../search-input";
import { ConfirmDialog } from "../alert-dialog";
import { PaginationBar } from "../pagination";
import { ResourceCell, ResourceItem } from "../resource-item";
import { DataTable, type ColumnDef } from "../data-table";
import { DatePicker, DateRangePicker, DEFAULT_DATE_RANGE_PRESETS } from "../date-picker";
import { Tabs, TabsList, TabItem, TabPanel } from "../tabs";
import { Toaster, toast } from "../sonner";
import { SearchableTable } from "../searchable-table";
import { FilterBar } from "../filter-bar";
import { Rating } from "../rating";
import { CodeBlock } from "../code-block";

/* ------------------------------------------------------------------ */
/* Format helpers                                                       */
/* ------------------------------------------------------------------ */

describe("format helpers", () => {
  const date = new Date(2026, 8, 26, 15, 4);

  it("formats dates with one consistent medium style", () => {
    expect(formatDate(date, { locale: "en-US" })).toBe("Sep 26, 2026");
    expect(formatDate("2026-09-26", { locale: "en-US" })).toBe("Sep 26, 2026");
    expect(formatDate(date, { locale: "en-US", style: "long" })).toBe("September 26, 2026");
    expect(formatDate(date, { locale: "en-US", style: "short" })).toBe("Sep 26, 2026");
    expect(formatDate(date, { locale: "en-US", style: "monthDay" })).toBe("Sep 26");
    expect(formatDate(date, { style: "iso" })).toBe("2026-09-26");
    expect(formatDateTime(date, { locale: "en-US" })).toMatch(/Sep 26, 2026.*3:04/);
  });

  it("localises dates", () => {
    const es = formatDate(date, { locale: "es-PE" });
    expect(es).toMatch(/^26 .*2026$/);
    expect(es).not.toBe(formatDate(date, { locale: "en-US" }));
  });

  it("returns the fallback for empty or invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("", { fallback: "n/a" })).toBe("n/a");
    expect(formatDate("not a date")).toBe("—");
    expect(toDate(undefined)).toBeNull();
  });

  it("reads date-only strings as local calendar dates", () => {
    const parsed = toDate("2026-01-05");
    expect(parsed?.getDate()).toBe(5);
    expect(toISODate(parsed)).toBe("2026-01-05");
    expect(toISODate(null)).toBe("");
  });

  it("formats date ranges", () => {
    const text = formatDateRange(new Date(2026, 8, 1), date, { locale: "en-US" });
    expect(text).toContain("Sep");
    expect(text).toContain("2026");
    expect(formatDateRange(null, null)).toBe("—");
    expect(formatDateRange(date, null, { locale: "en-US" })).toBe("Sep 26, 2026");
  });

  it("formats relative time and falls back to a date after a week", () => {
    const now = new Date(2026, 8, 26, 12, 0);
    expect(formatRelativeTime(new Date(2026, 8, 26, 11, 55), { now, locale: "en-US" })).toBe(
      "5 minutes ago",
    );
    expect(formatRelativeTime(new Date(2026, 8, 26, 11, 59, 50), { now, locale: "en-US" })).toBe(
      "now",
    );
    expect(formatRelativeTime(new Date(2026, 8, 28, 12), { now, locale: "en-US" })).toBe(
      "in 2 days",
    );
    expect(formatRelativeTime(new Date(2026, 7, 1), { now, locale: "en-US" })).toBe("Aug 1, 2026");
    expect(formatRelativeTime(undefined)).toBe("—");
  });

  it("formats numbers, currency and percent", () => {
    expect(formatNumber(1204, { locale: "en-US" })).toBe("1,204");
    expect(formatNumber("12.5", { locale: "en-US" })).toBe("12.5");
    expect(formatNumber(null)).toBe("—");
    expect(formatCurrency(48.2, { locale: "en-US" })).toBe("$48.20");
    expect(formatCurrency(4820, { locale: "en-US", minorUnits: true })).toBe("$48.20");
    expect(formatCurrency(4820, { locale: "en-US", currency: "PEN", minorUnits: true })).toMatch(
      /48\.20/,
    );
    expect(formatCurrency(1000, { locale: "en-US", currency: "JPY", minorUnits: true })).toBe(
      "¥1,000",
    );
    expect(formatPercent(0.125, { locale: "en-US" })).toBe("12.5%");
  });

  it("pluralizes with Intl.PluralRules", () => {
    expect(pluralize(1, "item")).toBe("1 item");
    expect(pluralize(0, "item")).toBe("0 items");
    expect(pluralize(2, "item")).toBe("2 items");
    expect(pluralize(1204, "order", { locale: "en-US" })).toBe("1,204 orders");
    expect(pluralize(3, "category", { plural: "categories" })).toBe("3 categories");
    expect(pluralize(1, "row", { hideCount: true })).toBe("row");
  });

  it("binds formatters to FormatProvider defaults", () => {
    function Probe() {
      const fmt = useFormatter();
      return (
        <p>
          {fmt.currency(10)} · {fmt.date(new Date(2026, 8, 26))} · {fmt.pluralize(2, "item")} ·{" "}
          {fmt.number(1000)} · {fmt.percent(0.5)} · {fmt.currencyCode}
        </p>
      );
    }
    render(
      <FormatProvider locale="en-US" currency="EUR">
        <Probe />
      </FormatProvider>,
    );
    expect(
      screen.getByText(/€10\.00 · Sep 26, 2026 · 2 items · 1,000 · 50% · EUR/),
    ).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DateText / RelativeTime                                              */
/* ------------------------------------------------------------------ */

describe("DateText", () => {
  it("renders a semantic <time> with an ISO datetime and full title", () => {
    render(<DateText value="2026-09-26T15:04:00Z" locale="en-US" timeZone="UTC" />);
    const time = screen.getByText("Sep 26, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-09-26T15:04:00.000Z");
    expect(time.getAttribute("title")).toMatch(/3:04/);
  });

  it("renders the fallback for empty values", () => {
    render(<DateText value={null} fallback="Never" />);
    expect(screen.getByText("Never")).toBeInTheDocument();
  });

  it("uses the FormatProvider locale", () => {
    render(
      <FormatProvider locale="en-GB">
        <DateText value={new Date(2026, 8, 26)} />
      </FormatProvider>,
    );
    expect(screen.getByText("26 Sept 2026")).toBeInTheDocument();
  });

  it("RelativeTime refreshes on an interval", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 8, 26, 12, 0, 0));
      render(<RelativeTime value={new Date(2026, 8, 26, 11, 58)} locale="en-US" />);
      expect(screen.getByText("2 minutes ago")).toBeInTheDocument();
      act(() => {
        vi.setSystemTime(new Date(2026, 8, 26, 12, 2, 0));
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

/* ------------------------------------------------------------------ */
/* StatusBadge tones                                                    */
/* ------------------------------------------------------------------ */

describe("StatusBadge tones", () => {
  it("maps commerce statuses to one convention", () => {
    expect(statusToneFor("paid")).toBe("success");
    expect(statusToneFor("Partially Fulfilled")).toBe("attention");
    expect(statusToneFor("unfulfilled")).toBe("attention");
    expect(statusToneFor("processing")).toBe("info");
    expect(statusToneFor("pending")).toBe("warning");
    expect(statusToneFor("refunded")).toBe("neutral");
    expect(statusToneFor("canceled")).toBe("critical");
    expect(statusToneFor("something-new")).toBe("neutral");
    expect(statusToneFor("queued", { queued: "info" })).toBe("info");
  });

  it("keeps statusBadgeVariantFor in sync with the tone map", () => {
    for (const [status, tone] of Object.entries(DEFAULT_STATUS_TONE)) {
      expect(statusBadgeVariantFor(status)).toBe(STATUS_TONE_BADGE[tone].variant);
    }
  });

  it("renders data-tone and honours explicit tone", () => {
    const { rerender } = render(<StatusBadge status="shipped" />);
    expect(screen.getByText("Shipped").closest("[data-tone]")).toHaveAttribute("data-tone", "info");
    rerender(<StatusBadge status="shipped" tone="success" />);
    expect(screen.getByText("Shipped").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "success",
    );
    rerender(<StatusBadge status="custom" toneMap={{ custom: "critical" }} />);
    expect(screen.getByText("Custom").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "critical",
    );
  });

  it("Badge and StatusTile accept tone", () => {
    render(
      <>
        <Badge tone="info">Info badge</Badge>
        <StatusTile
          title="Payments"
          status="custom_state"
          toneMap={{ custom_state: "attention" }}
        />
      </>,
    );
    expect(screen.getByText("Info badge")).toHaveAttribute("data-tone", "info");
    expect(screen.getByText("Custom state").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "attention",
    );
  });

  it("lets an explicit variant opt out of tones", () => {
    render(<StatusBadge status="paid" variant="outline" />);
    expect(screen.getByText("Paid").closest("span[data-tone]")).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* StatCard / StatGrid                                                  */
/* ------------------------------------------------------------------ */

describe("StatCard extensions", () => {
  it("renders description and tone-aware trend", () => {
    render(
      <StatCard
        label="Refunds"
        value="$1,204"
        description="Last 30 days"
        trend={{ value: "+4%", direction: "up", tone: "negative", label: "vs previous period" }}
      />,
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("+4%").parentElement).toHaveAttribute("data-tone", "negative");
    expect(screen.getByText("vs previous period")).toHaveClass("sr-only");
  });

  it("defaults trend tone from direction", () => {
    render(<StatCard label="Sales" value="1" trend={{ value: "+1", direction: "up" }} />);
    expect(screen.getByText("+1").parentElement).toHaveAttribute("data-tone", "positive");
  });

  it("shows skeletons while loading", () => {
    const { container } = render(<StatCard label="Orders" value="12" loading />);
    expect(screen.queryByText("12")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("renders as a link with href and plain variant", () => {
    render(<StatCard label="Orders" value="12" href="/orders" variant="plain" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/orders");
  });

  it("StatGrid is an alias with column presets", () => {
    expect(StatGrid).toBe(StatCardGrid);
    const { container } = render(
      <StatGrid columns={4}>
        <StatCard label="A" value="1" />
      </StatGrid>,
    );
    expect(container.firstChild).toHaveClass("lg:grid-cols-4");
  });
});

/* ------------------------------------------------------------------ */
/* EmptyState                                                           */
/* ------------------------------------------------------------------ */

describe("EmptyState actions", () => {
  it("renders primary and secondary actions", () => {
    const onAdd = vi.fn();
    render(
      <EmptyState
        title="No products yet"
        description="Add your first product."
        action={{ label: "Add product", onClick: onAdd }}
        secondaryAction={{ label: "Import CSV", href: "/import" }}
        variant="card"
        size="sm"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Add product" }));
    expect(onAdd).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Import CSV" })).toHaveAttribute("href", "/import");
  });

  it("accepts an element as the action (router links)", () => {
    render(<EmptyState title="Empty" action={<a href="/new">Create</a>} />);
    expect(screen.getByRole("link", { name: "Create" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ContextualSaveBar                                                    */
/* ------------------------------------------------------------------ */

describe("ContextualSaveBar", () => {
  it("is hidden when not dirty", () => {
    render(<ContextualSaveBar open={false} onSave={() => {}} />);
    expect(screen.queryByRole("region", { name: "Unsaved changes" })).not.toBeInTheDocument();
  });

  it("renders save and discard actions", () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();
    render(<ContextualSaveBar open onSave={onSave} onDiscard={onDiscard} />);
    expect(screen.getByRole("region", { name: "Unsaved changes" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onDiscard).toHaveBeenCalled();
    expect(onSave).toHaveBeenCalled();
  });

  it("binds Cmd/Ctrl+S to save while open", () => {
    const onSave = vi.fn();
    render(<ContextualSaveBar open onSave={onSave} />);
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("submits a form by id", () => {
    render(<ContextualSaveBar open formId="product-form" />);
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toHaveAttribute("type", "submit");
    expect(save).toHaveAttribute("form", "product-form");
  });

  it("disables actions while saving", () => {
    render(<ContextualSaveBar open saving onSave={() => {}} onDiscard={() => {}} />);
    expect(screen.getByRole("button", { name: "Discard" })).toBeDisabled();
  });

  it("useUnsavedChangesWarning blocks unload only while dirty", () => {
    function Probe({ dirty }: { dirty: boolean }) {
      useUnsavedChangesWarning(dirty);
      return null;
    }
    const { rerender } = render(<Probe dirty />);
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    rerender(<Probe dirty={false} />);
    const clean = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(clean);
    expect(clean.defaultPrevented).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* SearchInput                                                          */
/* ------------------------------------------------------------------ */

describe("SearchInput", () => {
  it("emits string values, clears with the button and Escape", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SearchInput value="" onValueChange={onValueChange} placeholder="Search orders" />,
    );
    const input = screen.getByRole("searchbox", { name: "Search orders" });
    fireEvent.change(input, { target: { value: "1042" } });
    expect(onValueChange).toHaveBeenLastCalledWith("1042");
    rerender(
      <SearchInput value="1042" onValueChange={onValueChange} placeholder="Search orders" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onValueChange).toHaveBeenCalledTimes(3);
  });

  it("shows a spinner while loading", () => {
    render(<SearchInput value="x" onValueChange={() => {}} loading />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Searching")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ConfirmDialog                                                        */
/* ------------------------------------------------------------------ */

describe("ConfirmDialog", () => {
  it("opens from the trigger and confirms", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        trigger={<button type="button">Delete</button>}
        title="Delete product?"
        description="This can't be undone."
        confirmLabel="Delete product"
        destructive
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("Delete product?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete product" }));
    expect(onConfirm).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText("Delete product?")).not.toBeInTheDocument());
  }, 20_000);

  it("stays open until an async confirm resolves and on rejection", async () => {
    let reject: (reason?: unknown) => void = () => {};
    const onConfirm = vi.fn(() => new Promise((_, r) => (reject = r)));
    render(<ConfirmDialog open title="Archive?" confirmLabel="Archive" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.getByRole("button", { name: "Archive" })).toBeDisabled();
    await act(async () => {
      reject(new Error("nope"));
    });
    expect(screen.getByRole("button", { name: "Archive" })).not.toBeDisabled();
    expect(screen.getByText("Archive?")).toBeInTheDocument();
  }, 20_000);
});

/* ------------------------------------------------------------------ */
/* PaginationBar                                                        */
/* ------------------------------------------------------------------ */

describe("PaginationBar", () => {
  it("summarises the range with pluralized nouns", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationBar
        page={2}
        pageSize={20}
        total={124}
        itemLabel="order"
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("Showing 21–40 of 124 orders")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to previous page" }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 3);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 1);
  });

  it("disables navigation at the edges and supports cursor mode", () => {
    const { rerender } = render(
      <PaginationBar page={1} pageSize={20} total={1} itemLabel="item" onPageChange={() => {}} />,
    );
    expect(screen.getByText("Showing 1–1 of 1 item")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    rerender(<PaginationBar page={1} pageSize={20} hasNextPage onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Go to next page" })).not.toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/* ResourceCell / ResourceItem                                          */
/* ------------------------------------------------------------------ */

describe("ResourceCell and ResourceItem", () => {
  it("ResourceCell renders primary above secondary", () => {
    render(<ResourceCell title="Linen shirt" subtitle="SKU-1042" href="/products/1" />);
    const title = screen.getByRole("link", { name: "Linen shirt" });
    const subtitle = screen.getByText("SKU-1042");
    expect(title.compareDocumentPosition(subtitle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(subtitle).toHaveClass("text-muted-foreground");
  });

  it("ResourceItem renders an interactive row", () => {
    const onClick = vi.fn();
    render(
      <ul>
        <ResourceItem title="#1042" subtitle="Ada Lovelace" trailing="$48.20" onClick={onClick} />
        <ResourceItem title="#1043" href="/orders/1043" />
        <ResourceItem title="#1044" />
      </ul>,
    );
    fireEvent.click(screen.getByRole("button", { name: /#1042/ }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /#1043/ })).toHaveAttribute("href", "/orders/1043");
    expect(screen.getByText("#1044")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DataTable                                                            */
/* ------------------------------------------------------------------ */

describe("DataTable extensions", () => {
  type Row = { id: string; name: string };
  const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }];

  it("renders a custom empty state and pluralized count", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        itemLabel="order"
        emptyState={<EmptyState title="No orders yet" />}
      />,
    );
    expect(screen.getByText("No orders yet")).toBeInTheDocument();
    expect(screen.getByText("0 orders")).toBeInTheDocument();
  });

  it("makes rows clickable and keyboard-activatable", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable columns={columns} data={[{ id: "1", name: "Ada" }]} onRowClick={onRowClick} />,
    );
    const row = screen.getByText("Ada").closest("tr")!;
    fireEvent.click(row);
    fireEvent.keyDown(row, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(screen.getByText("1 result")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DatePicker / DateRangePicker                                         */
/* ------------------------------------------------------------------ */

describe("DatePicker and DateRangePicker", () => {
  it("DatePicker shows the formatted value and clears", () => {
    const onChange = vi.fn();
    render(
      <DatePicker value={new Date(2026, 8, 26)} onChange={onChange} clearable locale="en-US" />,
    );
    expect(screen.getByText("September 26, 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("DateRangePicker shows a collapsed range and applies presets", async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2026, 8, 1), to: new Date(2026, 8, 26) }}
        onChange={onChange}
        locale="en-US"
      />,
    );
    expect(screen.getByText(/Sep 1\s*–\s*26, 2026/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Sep 1/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Last 7 days" }));
    const range = onChange.mock.calls[0]![0];
    expect(range.to.getTime() - range.from.getTime()).toBe(6 * 24 * 60 * 60 * 1000);
  }, 20_000);

  it("DateRangePicker shows the placeholder when empty", () => {
    render(<DateRangePicker presets={[]} />);
    expect(screen.getByText("Pick a date range")).toBeInTheDocument();
    expect(DEFAULT_DATE_RANGE_PRESETS.length).toBeGreaterThan(3);
  });
});

/* ------------------------------------------------------------------ */
/* Tabs overflow                                                        */
/* ------------------------------------------------------------------ */

describe("Tabs overflow", () => {
  it("TabsList scrolls instead of clipping by default", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabItem value="a">General</TabItem>
          <TabItem value="b">Checkout</TabItem>
        </TabsList>
        <TabPanel value="a">A</TabPanel>
      </Tabs>,
    );
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-scrollable");
    expect(list).toHaveClass("overflow-x-auto");
  });

  it("can opt out with scrollable={false}", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList scrollable={false}>
          <TabItem value="a">General</TabItem>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).not.toHaveClass("overflow-x-auto");
  });
});

/* ------------------------------------------------------------------ */
/* Toast re-export / SearchableTable empty action                       */
/* ------------------------------------------------------------------ */

describe("toast re-export", () => {
  it("exposes sonner's toast API from @hilum/ui", () => {
    expect(typeof toast).toBe("function");
    expect(typeof toast.success).toBe("function");
    expect(typeof toast.promise).toBe("function");
    render(<Toaster />);
  });
});

describe("SearchableTable empty-state actions", () => {
  it("passes primary and secondary actions to EmptyState", () => {
    render(
      <SearchableTable<{ id: string; name: string }>
        data={[]}
        columns={[{ key: "name", label: "Name", render: (row) => row.name }]}
        searchTerm=""
        onSearchChange={() => {}}
        emptyState={{
          title: "No products yet",
          action: { label: "Add product", href: "/products/new" },
          secondaryAction: { label: "Import", href: "/import" },
        }}
      />,
    );
    expect(screen.getAllByRole("link", { name: "Add product" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Import" }).length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/* FilterBar / Rating / CodeBlock / DateRangePicker shorthand           */
/* ------------------------------------------------------------------ */

describe("FilterBar", () => {
  it("renders search, filters, clear (only when active), actions and summary", () => {
    const onClear = vi.fn();
    const onSearch = vi.fn();
    const { rerender } = render(
      <FilterBar
        search={{ value: "", onValueChange: onSearch, placeholder: "Search merchants" }}
        onClear={onClear}
        actions={<button type="button">Export</button>}
        summary="24 merchants"
      >
        <button type="button">Status</button>
      </FilterBar>,
    );
    expect(screen.getByRole("group", { name: "Filters" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search merchants" }), {
      target: { value: "acme" },
    });
    expect(onSearch).toHaveBeenCalledWith("acme");
    rerender(
      <FilterBar search={{ value: "acme", onValueChange: onSearch }} onClear={onClear} active>
        <button type="button">Status</button>
      </FilterBar>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalled();
  });
});

describe("Rating", () => {
  it("renders a read-only accessible summary with partial stars", () => {
    render(<Rating value={4.5} showValue count={128} />);
    expect(screen.getByRole("img", { name: "4.5 out of 5 stars" })).toBeInTheDocument();
    expect(screen.getByText("4.5 (128)")).toBeInTheDocument();
  });

  it("works as a radio-group input", () => {
    const onValueChange = vi.fn();
    render(<Rating value={2} onValueChange={onValueChange} label="Your rating" />);
    expect(screen.getByRole("radiogroup", { name: "Your rating" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "2 stars" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "4 stars" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
  });
});

describe("CodeBlock", () => {
  it("renders code with a label, max height and copy button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(
      <CodeBlock language="json" maxHeight={200}>
        {'{ "ok": true }'}
      </CodeBlock>,
    );
    expect(screen.getByText("json")).toBeInTheDocument();
    expect(screen.getByText('{ "ok": true }').closest("pre")).toHaveStyle({ maxHeight: "200px" });
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith('{ "ok": true }');
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("can hide the copy button", () => {
    render(<CodeBlock copy={false}>x</CodeBlock>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("DateRangePicker from/to shorthand and DatePicker width", () => {
  it("accepts from/to props", () => {
    render(
      <DateRangePicker from={new Date(2026, 8, 1)} to={new Date(2026, 8, 26)} locale="en-US" />,
    );
    expect(screen.getByText(/Sep 1\s*–\s*26, 2026/)).toBeInTheDocument();
  });

  it("DatePicker is full width by default and inline on request", () => {
    const { container, rerender } = render(<DatePicker />);
    expect(container.firstChild).toHaveClass("w-full");
    rerender(<DatePicker fullWidth={false} />);
    expect(container.firstChild).toHaveClass("w-60");
  });
});
