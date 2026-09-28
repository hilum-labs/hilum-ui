import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { TreeView, type TreeNode } from "../tree-view";
import { SortableList, SortableItem, SortableHandle } from "../sortable";
import { TimePicker, parseTime, resolveHourCycle } from "../time-picker";
import { DateTimePicker } from "../date-time-picker";
import { PageLayout, AnnotatedSection } from "../layout";
import { FormLayout } from "../form-layout";
import {
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonThumbnail,
} from "../skeleton-page";

/* ------------------------------------------------------------------ */
/* TreeView                                                             */
/* ------------------------------------------------------------------ */

const tree: TreeNode[] = [
  {
    id: "apparel",
    label: "Apparel",
    children: [
      { id: "shirts", label: "Shirts" },
      { id: "pants", label: "Pants" },
    ],
  },
  { id: "books", label: "Books", children: [{ id: "fiction", label: "Fiction" }] },
  { id: "gifts", label: "Gifts" },
];

describe("TreeView", () => {
  it("exposes tree semantics", () => {
    render(<TreeView items={tree} aria-label="Categories" defaultExpanded={["apparel"]} />);
    const root = screen.getByRole("tree", { name: "Categories" });
    const apparel = within(root).getByRole("treeitem", { name: /Apparel/ });
    expect(apparel).toHaveAttribute("aria-expanded", "true");
    expect(apparel).toHaveAttribute("aria-level", "1");
    expect(apparel).toHaveAttribute("aria-setsize", "3");
    expect(apparel).toHaveAttribute("aria-posinset", "1");
    const shirts = screen.getByRole("treeitem", { name: "Shirts" });
    expect(shirts).toHaveAttribute("aria-level", "2");
    expect(shirts.closest("[role='group']")).not.toBeNull();
    expect(screen.getByRole("treeitem", { name: "Gifts" })).not.toHaveAttribute("aria-expanded");
  });

  it("supports arrow keys, Home/End, expand/collapse and typeahead", () => {
    const onExpandedChange = vi.fn();
    render(<TreeView items={tree} aria-label="Categories" onExpandedChange={onExpandedChange} />);
    const treeEl = screen.getByRole("tree");
    const apparel = screen.getByRole("treeitem", { name: /Apparel/ });
    expect(apparel).toHaveAttribute("tabindex", "0");
    apparel.focus();
    fireEvent.keyDown(treeEl, { key: "ArrowRight" });
    expect(onExpandedChange).toHaveBeenLastCalledWith(["apparel"]);
    fireEvent.keyDown(treeEl, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("treeitem", { name: "Shirts" }));
    fireEvent.keyDown(treeEl, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(apparel);
    fireEvent.keyDown(treeEl, { key: "End" });
    expect(document.activeElement).toBe(screen.getByRole("treeitem", { name: "Gifts" }));
    fireEvent.keyDown(treeEl, { key: "Home" });
    expect(document.activeElement).toBe(apparel);
    fireEvent.keyDown(treeEl, { key: "b" });
    expect(document.activeElement).toBe(screen.getByRole("treeitem", { name: /Books/ }));
    fireEvent.keyDown(treeEl, { key: "*" });
    expect(onExpandedChange).toHaveBeenLastCalledWith(["apparel", "books"]);
  });

  it("single selection with Enter/Space and onAction", () => {
    const onSelectedChange = vi.fn();
    const onAction = vi.fn();
    render(
      <TreeView
        items={tree}
        aria-label="Categories"
        onSelectedChange={onSelectedChange}
        onAction={onAction}
      />,
    );
    const treeEl = screen.getByRole("tree");
    screen.getByRole("treeitem", { name: /Apparel/ }).focus();
    fireEvent.keyDown(treeEl, { key: "ArrowDown" });
    fireEvent.keyDown(treeEl, { key: "Enter" });
    expect(onSelectedChange).toHaveBeenLastCalledWith(["books"]);
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: "books" }));
    expect(screen.getByRole("treeitem", { name: /Books/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("multi-select checkboxes cascade with a mixed parent state", () => {
    render(
      <TreeView items={tree} aria-label="Categories" checkboxes defaultExpanded={["apparel"]} />,
    );
    expect(screen.getByRole("tree")).toHaveAttribute("aria-multiselectable", "true");
    fireEvent.click(screen.getByText("Shirts"));
    const apparel = screen.getByRole("treeitem", { name: /Apparel/ });
    expect(apparel).toHaveAttribute("aria-checked", "mixed");
    fireEvent.click(screen.getByText("Pants"));
    expect(apparel).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByText("Apparel"));
    expect(apparel).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("treeitem", { name: "Shirts" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("lazy-loads children", async () => {
    const loadChildren = vi.fn(async () => [{ id: "late", label: "Loaded child" }]);
    render(
      <TreeView
        items={[{ id: "remote", label: "Remote", hasChildren: true }]}
        aria-label="Remote"
        loadChildren={loadChildren}
      />,
    );
    const remote = screen.getByRole("treeitem", { name: /Remote/ });
    expect(remote).toHaveAttribute("aria-expanded", "false");
    remote.focus();
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("tree"), { key: "ArrowRight" });
    });
    expect(await screen.findByRole("treeitem", { name: "Loaded child" })).toBeInTheDocument();
    expect(loadChildren).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/* Sortable                                                             */
/* ------------------------------------------------------------------ */

describe("SortableList", () => {
  const items = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Bravo" },
    { id: "c", name: "Charlie" },
  ];

  it("renders handles with accessible names and dnd-kit attributes", () => {
    render(
      <SortableList
        items={items}
        getItemId={(item) => item.id}
        getItemLabel={(item) => item.name}
        onReorder={() => {}}
        aria-label="Menu items"
      >
        {(item) => (
          <SortableItem id={item.id} handle>
            <SortableHandle />
            {item.name}
          </SortableItem>
        )}
      </SortableList>,
    );
    expect(screen.getByRole("list", { name: "Menu items" })).toBeInTheDocument();
    const handle = screen.getByRole("button", { name: "Reorder Bravo" });
    expect(handle).toHaveAttribute("aria-roledescription", "sortable");
    expect(handle).toHaveAttribute("aria-describedby");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("whole-item mode makes the item the drag target", () => {
    render(
      <SortableList
        items={items}
        getItemId={(item) => item.id}
        getItemLabel={(item) => item.name}
        onReorder={() => {}}
        orientation="horizontal"
      >
        {(item) => <SortableItem id={item.id}>{item.name}</SortableItem>}
      </SortableList>,
    );
    const activator = screen.getByRole("button", { name: "Reorder Alpha" });
    expect(activator).toHaveAttribute("tabindex", "0");
    expect(activator.closest("li")).toHaveAttribute("data-slot", "sortable-item");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "horizontal");
  });
});

/* ------------------------------------------------------------------ */
/* TimePicker / DateTimePicker                                          */
/* ------------------------------------------------------------------ */

describe("TimePicker", () => {
  it("helpers parse and detect hour cycles", () => {
    expect(parseTime("09:30")).toBe(570);
    expect(parseTime("24:00")).toBeNull();
    expect(resolveHourCycle("en-US")).toBe("h12");
    expect(resolveHourCycle("de-DE")).toBe("h23");
  });

  it("renders 24h spinbuttons and steps with arrows", () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        aria-label="Opens at"
        locale="de-DE"
        defaultValue="09:30"
        step={15}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("group", { name: "Opens at" })).toBeInTheDocument();
    const hour = screen.getByRole("spinbutton", { name: "Hour" });
    const minute = screen.getByRole("spinbutton", { name: "Minute" });
    expect(screen.queryByRole("spinbutton", { name: "AM/PM" })).not.toBeInTheDocument();
    expect(hour).toHaveAttribute("aria-valuenow", "9");
    fireEvent.keyDown(minute, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("09:45");
    fireEvent.keyDown(hour, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("08:45");
  });

  it("12h mode with typed digits and day period", () => {
    const onChange = vi.fn();
    render(<TimePicker aria-label="Time" hourCycle="h12" locale="en-US" onChange={onChange} />);
    const hour = screen.getByRole("spinbutton", { name: "Hour" });
    const period = screen.getByRole("spinbutton", { name: "AM/PM" });
    fireEvent.keyDown(hour, { key: "3" });
    const minute = screen.getByRole("spinbutton", { name: "Minute" });
    expect(document.activeElement).toBe(minute);
    fireEvent.keyDown(minute, { key: "4" });
    fireEvent.keyDown(minute, { key: "5" });
    expect(onChange).toHaveBeenLastCalledWith("03:45");
    fireEvent.keyDown(period, { key: "p" });
    expect(onChange).toHaveBeenLastCalledWith("15:45");
    expect(period).toHaveAttribute("aria-valuetext", "PM");
  });

  it("clamps to min/max and clears", () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        aria-label="Time"
        hourCycle="h23"
        value="09:00"
        min="08:00"
        max="18:00"
        clearable
        onChange={onChange}
      />,
    );
    const hour = screen.getByRole("spinbutton", { name: "Hour" });
    fireEvent.keyDown(hour, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("18:00");
    fireEvent.click(screen.getByRole("button", { name: "Clear time" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("DateTimePicker keeps the day when the time changes", () => {
    const onChange = vi.fn();
    const value = new Date(2026, 8, 28, 9, 0);
    render(
      <DateTimePicker aria-label="Publish at" value={value} onChange={onChange} hourCycle="h23" />,
    );
    expect(screen.getByRole("group", { name: "Publish at" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("spinbutton", { name: "Hour" }), { key: "ArrowUp" });
    const next = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(next.getDate()).toBe(28);
    expect(next.getHours()).toBe(10);
    expect(screen.getByRole("button", { name: "Date" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Layouts & skeletons                                                  */
/* ------------------------------------------------------------------ */

describe("PageLayout / FormLayout / SkeletonPage", () => {
  it("PageLayout sections and AnnotatedSection", () => {
    const { container } = render(
      <PageLayout>
        <PageLayout.Section>Main</PageLayout.Section>
        <PageLayout.Section variant="secondary">Side</PageLayout.Section>
        <AnnotatedSection title="Store details" description="Shown on invoices.">
          <div>Card</div>
        </AnnotatedSection>
      </PageLayout>,
    );
    const sections = container.querySelectorAll("[data-slot='page-layout-section']");
    expect(sections[0]).toHaveAttribute("data-variant", "primary");
    expect(sections[1]).toHaveAttribute("data-variant", "secondary");
    expect(screen.getByRole("region", { name: "Store details" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Store details" })).toBeInTheDocument();
  });

  it("FormLayout.Group is a labelled group", () => {
    render(
      <FormLayout>
        <FormLayout.Group condensed title="Dimensions" helpText="In centimetres">
          <input aria-label="Width" />
          <input aria-label="Height" />
        </FormLayout.Group>
      </FormLayout>,
    );
    const group = screen.getByRole("group", { name: "Dimensions" });
    expect(group).toHaveAccessibleDescription("In centimetres");
    expect(group).toHaveAttribute("data-condensed", "true");
  });

  it("SkeletonPage is busy and announces loading", () => {
    render(
      <SkeletonPage primaryAction backAction>
        <SkeletonDisplayText />
        <SkeletonBodyText lines={4} />
        <SkeletonThumbnail size="sm" />
      </SkeletonPage>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading page");
    expect(document.querySelector("[data-slot='skeleton-page']")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      document.querySelectorAll("[data-slot='skeleton-body-text'] [data-slot='skeleton']"),
    ).toHaveLength(4);
  });
});

void React;
void waitFor;
