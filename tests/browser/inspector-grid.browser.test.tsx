import { render, screen } from "@testing-library/react";
import { Eye, Link2, Plus } from "lucide-react";
import { Button, InputNumber, Select, SelectContent, SelectItem, SelectTrigger } from "@hilum/ui";
import {
  DesignerPane,
  DesignerPaneContent,
  DesignerPaneTitle,
  DesignerPanel,
  DesignerPropertyControls,
  DesignerPropertyField,
  DesignerPropertyLabel,
  DesignerPropertyRow,
  TwoValueControl,
} from "@hilum/designer";

const noop = () => {};
const rect = (el: Element) => el.getBoundingClientRect();
const field = (name: string) => screen.getByRole("spinbutton", { name }).parentElement!;

/** Left edge of an element's own text (not its box). */
function textLeft(el: Element) {
  const text = Array.from(el.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)!;
  const range = document.createRange();
  range.selectNodeContents(text);
  return range.getBoundingClientRect().left;
}

function Inspector({ density = "compact" }: { density?: "default" | "compact" }) {
  return (
    <DesignerPanel side="right" width={260} density={density}>
      <DesignerPane collapsible>
        <DesignerPaneTitle
          action={
            <Button size="icon-xs" variant="ghost" aria-label="Add">
              <Plus />
            </Button>
          }
        >
          Layout
        </DesignerPaneTitle>
        <DesignerPaneContent>
          <DesignerPropertyRow
            layout="grid"
            label="Position"
            data-testid="position"
            action={
              <Button size="icon-xs" variant="ghost" aria-label="Constrain">
                <Link2 />
              </Button>
            }
          >
            <InputNumber label="X" value={10} onChange={noop} />
            <InputNumber label="Y" value={20} onChange={noop} />
          </DesignerPropertyRow>
          <DesignerPropertyRow layout="grid" data-testid="size">
            <DesignerPropertyLabel>Size</DesignerPropertyLabel>
            <DesignerPropertyControls>
              <InputNumber label="W" value={100} onChange={noop} />
              <InputNumber label="H" value={50} onChange={noop} />
            </DesignerPropertyControls>
          </DesignerPropertyRow>
          <DesignerPropertyRow layout="grid" label="Blend" data-testid="blend">
            <DesignerPropertyField span={2}>
              <Select defaultValue="normal">
                <SelectTrigger aria-label="Blend mode" />
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </DesignerPropertyField>
            <Button size="icon-sm" variant="ghost" aria-label="Hide">
              <Eye />
            </Button>
          </DesignerPropertyRow>
          {/* A lone TwoValueControl spans both field columns, directly or via controls. */}
          <DesignerPropertyRow layout="grid" label="Offset" data-testid="offset">
            <TwoValueControl
              values={{ ox: 1, oy: 2 }}
              items={[
                { key: "ox", label: "X", ariaLabel: "Offset X" },
                { key: "oy", label: "Y", ariaLabel: "Offset Y" },
              ]}
              onChange={noop}
            />
          </DesignerPropertyRow>
          <DesignerPropertyRow layout="grid" data-testid="gap">
            <DesignerPropertyLabel>Gap</DesignerPropertyLabel>
            <DesignerPropertyControls>
              <TwoValueControl
                values={{ gx: 1, gy: 2 }}
                items={[
                  { key: "gx", label: "X", ariaLabel: "Gap X" },
                  { key: "gy", label: "Y", ariaLabel: "Gap Y" },
                ]}
                onChange={noop}
              />
            </DesignerPropertyControls>
          </DesignerPropertyRow>
          <DesignerPropertyRow layout="grid" label="Rotation" data-testid="rotation">
            <DesignerPropertyField span={1}>
              <InputNumber label="R" aria-label="Rotation" value={0} onChange={noop} />
            </DesignerPropertyField>
          </DesignerPropertyRow>
        </DesignerPaneContent>
      </DesignerPane>
    </DesignerPanel>
  );
}

describe("inspector grid rows (real browser)", () => {
  test("field columns and the action column line up across rows", () => {
    render(<Inspector />);
    const x = rect(field("X"));
    const y = rect(field("Y"));
    const w = rect(field("W"));
    const h = rect(field("H"));
    const blend = rect(screen.getByRole("combobox", { name: "Blend mode" }));
    const offsetX = rect(field("Offset X"));
    const offsetY = rect(field("Offset Y"));
    const gapX = rect(field("Gap X"));
    const gapY = rect(field("Gap Y"));
    const rotation = rect(field("Rotation"));

    // Column 1 left edges.
    for (const r of [w, blend, offsetX, gapX, rotation]) expect(r.left).toBe(x.left);
    // Column 2 right edges, with or without an action in the row.
    for (const r of [h, blend, offsetY, gapY]) expect(r.right).toBe(y.right);
    // Column 2 left edges: a spanning TwoValueControl's 8px gap matches the grid's.
    for (const r of [h, offsetY, gapY]) expect(r.left).toBe(y.left);
    // Equal field columns; InputNumber's default w-48 is overridden.
    expect(x.width).toBe(y.width);
    expect(x.width).toBeLessThan(192);
    expect(y.left - x.right).toBe(8);
    // span={1} keeps a lone field in column 1.
    expect(rotation.right).toBe(x.right);

    // The action and an icon-only child share the 24px action column.
    const actionCell = screen
      .getByTestId("position")
      .querySelector('[data-slot="designer-property-action"]')!;
    const cell = rect(actionCell);
    const constrain = rect(screen.getByRole("button", { name: "Constrain" }));
    const hide = rect(screen.getByRole("button", { name: "Hide" }));
    expect(cell.width).toBe(24);
    expect(cell.left - y.right).toBe(8);
    expect(constrain.left + constrain.width / 2).toBe(hide.left + hide.width / 2);
    expect(constrain.top + constrain.height / 2).toBeCloseTo(y.top + y.height / 2, 0);
    expect(hide.top + hide.height / 2).toBeCloseTo(blend.top + blend.height / 2, 0);
    expect(cell.right).toBe(rect(screen.getByTestId("size")).right);

    // 24px fields and uniform 14px icons in icon-only buttons (icon-xs and icon-sm).
    expect(y.height).toBe(24);
    for (const name of ["Constrain", "Hide", "Add"]) {
      const svg = screen.getByRole("button", { name }).querySelector("svg")!;
      expect(rect(svg).width).toBe(14);
    }
  });

  test("labels span the row above the fields, and the pane title shares their left edge", () => {
    render(<Inspector />);
    const label = rect(screen.getByText("Position"));
    const x = rect(field("X"));
    const y = rect(field("Y"));
    expect(label.left).toBe(x.left);
    expect(label.right).toBeGreaterThan(y.right);
    expect(x.top - label.bottom).toBe(4);
    expect(rect(screen.getByText("Size")).left).toBe(x.left);

    const title = screen.getByRole("button", { name: "Layout" });
    expect(Math.abs(textLeft(title) - label.left)).toBeLessThanOrEqual(1);

    // Compact: the leading chevron is hidden and the trailing one follows the actions.
    expect(getComputedStyle(title.querySelector("svg")!).display).toBe("none");
    const chevron = title.parentElement!.lastElementChild!;
    expect(chevron).toHaveAttribute("data-slot", "designer-pane-chevron");
    expect(getComputedStyle(chevron).display).toBe("flex");
    expect(rect(chevron).width).toBe(24);
    expect(rect(chevron).left).toBeGreaterThan(
      rect(screen.getByRole("button", { name: "Add" })).right - 1,
    );
    // It sits over the rows' action column.
    const actionCell = screen
      .getByTestId("position")
      .querySelector('[data-slot="designer-property-action"]')!;
    expect(rect(chevron).right).toBe(rect(actionCell).right);
  });

  test("default density keeps the grid with a 32px action column", () => {
    render(<Inspector density="default" />);
    const y = rect(field("Y"));
    const h = rect(field("H"));
    expect(h.right).toBe(y.right);
    expect(rect(screen.getByTestId("size")).right - y.right).toBe(8 + 32);
    const title = screen.getByRole("button", { name: "Layout" });
    // The leading chevron stays, and the trailing one is hidden.
    expect(getComputedStyle(title.querySelector("svg")!).display).not.toBe("none");
    expect(getComputedStyle(title.parentElement!.lastElementChild!).display).toBe("none");
  });
});
