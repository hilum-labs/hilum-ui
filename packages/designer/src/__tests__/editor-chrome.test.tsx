import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MousePointer2, Square } from "lucide-react";
import { DesignerPane, DesignerPaneContent, DesignerPaneTitle } from "../components/DesignerPane";
import { DesignerPropertyGroup, DesignerPropertyRow } from "../components/DesignerPropertyRow";
import { DesignerSidebar } from "../components/DesignerSidebar";
import { SpacingControl } from "../components/DesignerValueControls";

describe("DesignerPane compact chrome", () => {
  it("titles are sentence case, 11px, semibold and in the foreground colour", () => {
    render(
      <DesignerPane>
        <DesignerPaneTitle>Typography</DesignerPaneTitle>
        <DesignerPaneContent>…</DesignerPaneContent>
      </DesignerPane>,
    );
    // The typography sits on the header row, which holds the title and its actions.
    const header = screen.getByText("Typography").parentElement!;
    expect(header).toHaveClass("flex", "px-3");
    // Default density keeps the tracked caps caption.
    expect(header).toHaveClass("uppercase", "tracking-wider", "text-muted-foreground");
    expect(header).toHaveClass(
      "compact:normal-case",
      "compact:tracking-normal",
      "compact:text-[11px]",
      "compact:text-foreground",
      "font-semibold",
    );
  });

  it("section dividers use the density divider hairline", () => {
    const { container } = render(
      <DesignerPane>
        <DesignerPaneContent>…</DesignerPaneContent>
      </DesignerPane>,
    );
    expect(container.querySelector("section")).toHaveClass(
      "border-b",
      "border-border",
      "compact:border-[color:var(--density-divider)]",
    );
  });

  it("group titles are sentence case but stay muted", () => {
    render(
      <DesignerPropertyGroup title="Align">
        <div />
      </DesignerPropertyGroup>,
    );
    const title = screen.getByText("Align");
    expect(title).toHaveClass(
      "compact:normal-case",
      "compact:tracking-normal",
      "compact:text-[11px]",
      "text-muted-foreground",
    );
    expect(title).not.toHaveClass("compact:text-foreground");
  });
});

describe("DesignerPropertyRow inline label column", () => {
  it("gives a composed <label> child the fixed column and the rest of the row to the controls", () => {
    const { container } = render(
      <DesignerPropertyRow layout="inline">
        <label htmlFor="x">Opacity</label>
        <input id="x" />
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild!;
    expect(row).toHaveAttribute("data-layout", "inline");
    expect(row).toHaveClass(
      "compact:min-h-6",
      "compact:py-0.5",
      "compact:[&>label]:w-[var(--designer-label-width,72px)]",
      "compact:[&>label]:flex-[0_0_var(--designer-label-width,72px)]",
      "compact:[&>label]:truncate",
      "compact:[&>:not(label)]:flex-1",
      "compact:[&>:not(label)]:min-w-0",
    );
    expect(row).not.toHaveAttribute("style");
  });

  it("sizes its own label from the same variable (64px default, labelWidth override)", () => {
    const { container, rerender } = render(
      <DesignerPropertyRow layout="inline" label="Blend">
        <input />
      </DesignerPropertyRow>,
    );
    const label = () => screen.getByText("Blend");
    expect(label().tagName).toBe("LABEL");
    expect(label()).toHaveClass("w-[var(--designer-label-width,64px)]", "shrink-0", "truncate");
    expect(label()).not.toHaveClass("w-full");

    rerender(
      <DesignerPropertyRow layout="inline" label="Blend" labelWidth={80} style={{ color: "red" }}>
        <input />
      </DesignerPropertyRow>,
    );
    const row = container.firstElementChild as HTMLElement;
    expect(row.style.getPropertyValue("--designer-label-width")).toBe("80px");
    expect(row.style.color).toBe("red");
  });

  it("stacked rows keep the full-width label", () => {
    render(
      <DesignerPropertyRow label="Fill">
        <input />
      </DesignerPropertyRow>,
    );
    expect(screen.getByText("Fill")).toHaveClass("w-full");
  });
});

describe("DesignerValueControls prefix labels", () => {
  it("renders the linked 'All' prefix in sentence case", () => {
    render(
      <SpacingControl
        values={{ top: 4, right: 4, bottom: 4, left: 4 }}
        onChange={() => {}}
        linked
        onLinkedChange={() => {}}
      />,
    );
    const prefix = screen.getByText("All");
    expect(prefix.closest(".uppercase")).toBeNull();
  });
});

describe("DesignerSidebar active tool", () => {
  it("is a soft neutral tile with fine icon strokes, in the rail and the bottom bar", () => {
    const items = [
      { id: "select", label: "Select", icon: MousePointer2, active: true },
      { id: "frame", label: "Frame", icon: Square },
    ];
    for (const variant of ["rail", "bottom"] as const) {
      const { unmount } = render(<DesignerSidebar items={items} variant={variant} />);
      const active = screen.getByRole("button", { name: "Select", pressed: true });
      expect(active).toHaveClass("bg-foreground/[0.08]", "text-foreground", "[&_svg]:stroke-[1.5]");
      expect(active).not.toHaveClass("bg-foreground", "text-background");
      expect(screen.getByRole("button", { name: "Frame" })).toHaveClass("[&_svg]:stroke-[1.5]");
      unmount();
    }
  });
});
