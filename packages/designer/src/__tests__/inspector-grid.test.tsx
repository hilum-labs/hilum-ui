import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Link2, MousePointer2, Plus } from "lucide-react";
import { Button, InputNumber } from "@hilum/ui";
import { DesignerPane, DesignerPaneContent, DesignerPaneTitle } from "../components/DesignerPane";
import {
  DesignerPropertyControls,
  DesignerPropertyField,
  DesignerPropertyLabel,
  DesignerPropertyRow,
} from "../components/DesignerPropertyRow";
import { DesignerSidebar } from "../components/DesignerSidebar";
import { DesignerToolbarButton, DesignerToolbarSeparator } from "../components/DesignerToolbar";

const noop = () => {};

describe("DesignerPropertyRow layout=grid", () => {
  it("is two field columns plus the density-sized action column", () => {
    const { container } = render(
      <DesignerPropertyRow layout="grid" label="Position">
        <InputNumber label="X" value={0} onChange={noop} />
        <InputNumber label="Y" value={0} onChange={noop} />
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild!;
    expect(row).toHaveAttribute("data-layout", "grid");
    expect(row).toHaveClass(
      "grid",
      "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_var(--designer-action-col)]",
      "gap-x-2",
      "gap-y-1",
      "[--designer-action-col:32px]",
      "compact:[--designer-action-col:24px]",
      "compact:py-0",
    );
    expect(row).not.toHaveClass("flex");
  });

  it("gives the label the full first row and stretches the fields over their cells", () => {
    const { container } = render(
      <DesignerPropertyRow layout="grid" label="Position" labelFor="pos-x">
        <InputNumber id="pos-x" label="X" value={0} onChange={noop} />
        <InputNumber label="Y" value={0} onChange={noop} />
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild!;
    expect(row).toHaveClass(
      "[&>label]:col-span-full",
      "[&>label]:row-start-1",
      "[&>*]:min-w-0",
      "[&>:not(label,[data-icon-only],[data-slot=designer-property-action])]:w-full",
      // A lone field spans both columns; here there are two, so each keeps one.
      "[&:not(:has(>:not(label,[data-icon-only],[data-slot=designer-property-action])~:not(label,[data-icon-only],[data-slot=designer-property-action])))>:not(label,[data-icon-only],[data-slot=designer-property-action],[data-span='1'])]:col-span-2",
    );
    // The label and the fields are direct grid items (no controls wrapper).
    const label = screen.getByText("Position");
    expect(label.tagName).toBe("LABEL");
    expect(label.parentElement).toBe(row);
    expect(screen.getByLabelText("Position")).toHaveAttribute("id", "pos-x");
    const fields = row.querySelectorAll(':scope > [data-slot="input-number"]');
    expect(fields).toHaveLength(2);
    expect(row.querySelector('[data-slot="designer-property-controls"]')).toBeNull();
  });

  it("puts `action` last, in a centred column-3 cell, and icon-only buttons in column 3", () => {
    const { container } = render(
      <DesignerPropertyRow
        layout="grid"
        label="Position"
        action={
          <Button size="icon-xs" variant="ghost" aria-label="Constrain">
            <Link2 />
          </Button>
        }
      >
        <InputNumber label="X" value={0} onChange={noop} />
        <InputNumber label="Y" value={0} onChange={noop} />
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild!;
    const action = row.querySelector('[data-slot="designer-property-action"]')!;
    expect(action.parentElement).toBe(row);
    expect(row.lastElementChild).toBe(action);
    expect(action).toHaveClass("col-start-3", "flex", "items-center", "justify-center");
    expect(action.firstElementChild).toHaveAttribute("data-icon-only", "");
    expect(row).toHaveClass(
      "[&>[data-icon-only]]:col-start-3",
      "[&>[data-icon-only]]:justify-self-center",
    );
  });

  it("renders no action cell without an action (the column stays in the template)", () => {
    const { container } = render(
      <DesignerPropertyRow layout="grid" label="Size">
        <InputNumber label="W" value={0} onChange={noop} />
        <InputNumber label="H" value={0} onChange={noop} />
      </DesignerPropertyRow>,
    );
    expect(container.querySelector('[data-slot="designer-property-action"]')).toBeNull();
    expect(container.firstElementChild).toHaveClass(
      "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_var(--designer-action-col)]",
    );
  });

  it("turns a DesignerPropertyControls into display: contents so its children join the grid", () => {
    const { container } = render(
      <DesignerPropertyRow layout="grid">
        <DesignerPropertyLabel>Rotation</DesignerPropertyLabel>
        <DesignerPropertyControls>
          <InputNumber label="R" value={0} onChange={noop} />
          <Button size="icon-sm" variant="ghost" aria-label="Rotate 90°">
            <Link2 />
          </Button>
        </DesignerPropertyControls>
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild!;
    const controls = row.querySelector('[data-slot="designer-property-controls"]')!;
    expect(controls.parentElement).toBe(row);
    expect(row).toHaveClass(
      "[&>[data-slot=designer-property-controls]]:contents",
      "[&>[data-slot=designer-property-controls]>*]:min-w-0",
      "[&>[data-slot=designer-property-controls]>:not([data-icon-only])]:w-full",
      "[&>[data-slot=designer-property-controls]>[data-icon-only]]:col-start-3",
      "[&>[data-slot=designer-property-controls]>[data-icon-only]]:justify-self-center",
      "[&>[data-slot=designer-property-controls]>[data-span='2']]:col-span-2",
      // Its lone field (icon-only buttons aside) spans both field columns.
      "[&>[data-slot=designer-property-controls]:not(:has(>:not([data-icon-only])~:not([data-icon-only])))>:not([data-icon-only],[data-span='1'])]:col-span-2",
    );
    expect(screen.getByRole("button", { name: "Rotate 90°" })).toHaveAttribute(
      "data-icon-only",
      "",
    );
  });

  it("stretches Select triggers past their default-density minimum", () => {
    const { container } = render(
      <DesignerPropertyRow layout="grid">
        <input aria-label="field" />
      </DesignerPropertyRow>,
    );
    expect(container.firstElementChild).toHaveClass(
      "[&_[data-slot=select-trigger]]:w-full",
      "[&_[data-slot=select-trigger]]:min-w-0",
    );
  });

  it("keeps stacked and inline rows on their flex layouts", () => {
    const { container } = render(
      <>
        <DesignerPropertyRow label="Fill">
          <input />
        </DesignerPropertyRow>
        <DesignerPropertyRow label="Blend" layout="inline">
          <input />
        </DesignerPropertyRow>
      </>,
    );
    const [stacked, inline] = Array.from(container.children);
    expect(stacked).toHaveClass("flex", "flex-col", "py-1.5", "compact:py-0");
    expect(stacked).not.toHaveClass("grid", "compact:py-0.5");
    expect(inline).toHaveClass("flex", "flex-row", "compact:py-0.5");
    expect(inline).not.toHaveClass("compact:py-0");
  });

  it("appends `action` after the controls in the other layouts", () => {
    render(
      <DesignerPropertyRow label="Fill" action={<button type="button">Add</button>}>
        <input aria-label="fill" />
      </DesignerPropertyRow>,
    );
    const action = screen.getByRole("button", { name: "Add" }).parentElement!;
    expect(action).toHaveAttribute("data-slot", "designer-property-action");
    expect(action.parentElement).toHaveAttribute("data-slot", "designer-property-controls");
    expect(action.previousElementSibling).toBe(screen.getByLabelText("fill"));
  });
});

describe("DesignerPropertyField", () => {
  it("spans both field columns with span={2}", () => {
    render(
      <DesignerPropertyRow layout="grid">
        <DesignerPropertyField span={2} data-testid="blend">
          <select aria-label="Blend" />
        </DesignerPropertyField>
      </DesignerPropertyRow>,
    );
    const field = screen.getByTestId("blend");
    expect(field).toHaveAttribute("data-span", "2");
    expect(field).toHaveAttribute("data-slot", "designer-property-field");
    expect(field.parentElement).toHaveClass("[&>[data-span='2']]:col-span-2");
  });

  it("is a one-column cell by default (auto-spanning when alone), or pinned with span={1}", () => {
    const { rerender } = render(
      <DesignerPropertyField data-testid="cell">
        <input aria-label="r" />
      </DesignerPropertyField>,
    );
    const cell = () => screen.getByTestId("cell");
    expect(cell()).not.toHaveAttribute("data-span");
    expect(cell()).toHaveClass(
      "flex",
      "min-w-0",
      "items-center",
      "[&>*]:min-w-0",
      "[&>:not([data-icon-only])]:flex-1",
    );
    rerender(
      <DesignerPropertyField data-testid="cell" span={1} className="gap-0.5">
        <input aria-label="r" />
      </DesignerPropertyField>,
    );
    expect(cell()).toHaveAttribute("data-span", "1");
    expect(cell()).toHaveClass("gap-0.5");
    expect(cell()).not.toHaveClass("gap-2");
  });
});

describe("DesignerPaneTitle", () => {
  it("is a header row whose title button controls the content", () => {
    render(
      <DesignerPane collapsible>
        <DesignerPaneTitle>Layout</DesignerPaneTitle>
        <DesignerPaneContent>
          <span>Body</span>
        </DesignerPaneContent>
      </DesignerPane>,
    );
    const title = screen.getByRole("button", { name: "Layout" });
    expect(title).toHaveAttribute("type", "button");
    expect(title).toHaveAttribute("aria-expanded", "true");
    const content = screen.getByText("Body").parentElement!;
    expect(content.id).not.toBe("");
    expect(title).toHaveAttribute("aria-controls", content.id);
    expect(title).toHaveClass("flex-1", "text-start");
    // The header row is a div, not the button.
    expect(title.parentElement!.tagName).toBe("DIV");

    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body")).toBeNull();
  });

  it("keeps the leading chevron for default density and shows a trailing one in compact", () => {
    render(
      <DesignerPane collapsible>
        <DesignerPaneTitle>Layout</DesignerPaneTitle>
        <DesignerPaneContent>
          <span>Body</span>
        </DesignerPaneContent>
      </DesignerPane>,
    );
    const title = screen.getByRole("button", { name: "Layout" });
    const leading = title.querySelector("svg")!;
    expect(leading).toHaveClass("compact:hidden");

    const header = title.parentElement!;
    const chevron = header.querySelector('[data-slot="designer-pane-chevron"]') as HTMLElement;
    expect(header.lastElementChild).toBe(chevron);
    expect(chevron.tagName).toBe("BUTTON");
    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(chevron).toHaveAttribute("tabindex", "-1");
    expect(chevron).toHaveClass("hidden", "compact:flex", "size-6", "text-muted-foreground");
    expect(chevron.querySelector("svg")).not.toHaveClass("-rotate-90");

    // The trailing chevron toggles the same state and rotates when collapsed.
    fireEvent.click(chevron);
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Body")).toBeNull();
    expect(chevron.querySelector("svg")).toHaveClass("-rotate-90", "rtl:rotate-90");
    expect(leading).toHaveClass("-rotate-90");
    fireEvent.click(chevron);
    expect(title).toHaveAttribute("aria-expanded", "true");
  });

  it("never nests a button in a button when both action and collapsible are set", () => {
    const { container } = render(
      <DesignerPane collapsible>
        <DesignerPaneTitle
          action={
            <Button size="icon-xs" variant="ghost" aria-label="Add fill">
              <Plus />
            </Button>
          }
        >
          Fill
        </DesignerPaneTitle>
        <DesignerPaneContent>…</DesignerPaneContent>
      </DesignerPane>,
    );
    expect(container.querySelectorAll("button button")).toHaveLength(0);
    const title = screen.getByRole("button", { name: "Fill" });
    const add = screen.getByRole("button", { name: "Add fill" });
    // Order: title, actions, then the trailing chevron.
    const header = title.parentElement!;
    const cells = Array.from(header.children);
    expect(cells[0]).toBe(title);
    expect(cells[1]).toContainElement(add);
    expect(cells[2]).toHaveAttribute("data-slot", "designer-pane-chevron");
  });

  it("renders a non-collapsible title without buttons or ARIA state", () => {
    const { container } = render(
      <DesignerPane>
        <DesignerPaneTitle>Layer</DesignerPaneTitle>
        <DesignerPaneContent>…</DesignerPaneContent>
      </DesignerPane>,
    );
    expect(container.querySelector("button")).toBeNull();
    expect(screen.getByText("Layer")).toHaveClass("flex-1", "text-start");
  });

  it("aligns the title with the content padding and spaces compact rows 8px apart", () => {
    render(
      <DesignerPane>
        <DesignerPaneTitle>Layer</DesignerPaneTitle>
        <DesignerPaneContent>
          <span>Body</span>
        </DesignerPaneContent>
      </DesignerPane>,
    );
    expect(screen.getByText("Layer").parentElement).toHaveClass("px-3", "compact:min-h-8");
    const content = screen.getByText("Body").parentElement!;
    expect(content).toHaveClass("px-3", "pb-3", "gap-2");
    expect(content).not.toHaveClass("compact:gap-1.5");
  });

  it("mutes an empty section's title", () => {
    render(
      <DesignerPane>
        <DesignerPaneTitle muted>Fill</DesignerPaneTitle>
        <DesignerPaneTitle>Stroke</DesignerPaneTitle>
      </DesignerPane>,
    );
    const muted = screen.getByText("Fill").parentElement!;
    expect(muted).toHaveClass(
      "text-muted-foreground",
      "font-normal",
      "compact:text-muted-foreground",
    );
    expect(muted).not.toHaveClass("font-semibold", "compact:text-foreground");
    const regular = screen.getByText("Stroke").parentElement!;
    expect(regular).toHaveClass("font-semibold", "compact:text-foreground");
  });
});

describe("toolbar and rail sizing", () => {
  it("toolbar buttons are 32px with 5px radii and 1.5px strokes, keeping the touch size", () => {
    render(
      <>
        <DesignerToolbarButton label="Select" icon={MousePointer2} />
        <DesignerToolbarButton label="Touch" icon={MousePointer2} size="touch" />
        <DesignerToolbarSeparator />
      </>,
    );
    const button = screen.getByRole("button", { name: "Select" });
    expect(button).toHaveClass(
      "h-8",
      "min-w-8",
      "rounded-[5px]",
      "[&_svg]:stroke-[1.5]",
      "[@media(pointer:coarse)]:h-11",
    );
    expect(button).not.toHaveClass(
      "h-9",
      "min-w-9",
      "rounded-md",
      "compact:h-8",
      "compact:rounded-[6px]",
    );
    expect(button.querySelector("svg")).toHaveAttribute("width", "16");
    const touch = screen.getByRole("button", { name: "Touch" });
    expect(touch).toHaveClass("h-11", "min-w-11");
    expect(touch).not.toHaveClass("h-8");
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("h-5");
    expect(separator).not.toHaveClass("compact:h-4");
  });

  it("rail items are 32px with 5px radii in every density, keeping the touch size", () => {
    const items = [{ id: "select", label: "Select", icon: MousePointer2 }];
    const { unmount } = render(<DesignerSidebar items={items} />);
    const item = screen.getByRole("button", { name: "Select" });
    expect(item).toHaveClass("size-8", "rounded-[5px]", "[@media(pointer:coarse)]:size-11");
    expect(item).not.toHaveClass("size-9", "rounded-md", "compact:size-8", "compact:rounded-[6px]");
    expect(item.querySelector("svg")).toHaveAttribute("width", "16");
    unmount();

    render(<DesignerSidebar items={items} variant="bottom" />);
    const touch = screen.getByRole("button", { name: "Select" });
    expect(touch).toHaveClass("size-11");
    expect(touch).not.toHaveClass("size-8");
  });
});
