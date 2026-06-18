import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ShellProvider, useShellContext } from "../shell/ShellContext";
import { DesignerShell } from "../components/DesignerShell";
import { DesignerHeader } from "../components/DesignerHeader";
import { DesignerToolbar } from "../components/DesignerToolbar";
import { DesignerSidebar } from "../components/DesignerSidebar";
import { DesignerPanel } from "../components/DesignerPanel";
import { DesignerPane } from "../components/DesignerPane";
import {
  DesignerPropertyControls,
  DesignerPropertyGroup,
  DesignerPropertyLabel,
  DesignerPropertyRow,
} from "../components/DesignerPropertyRow";

/* ------------------------------------------------------------------ */
/* ShellProvider + useShellContext                                      */
/* ------------------------------------------------------------------ */

describe("ShellProvider + useShellContext", () => {
  function Inspector() {
    const ctx = useShellContext();
    return (
      <div>
        <span data-testid="tool">{ctx.activeTool}</span>
        <span data-testid="selected">{ctx.selectedIds.join(",")}</span>
        <span data-testid="readonly">{String(ctx.readOnly)}</span>
        <button onClick={() => ctx.setActiveTool("hand")}>set-hand</button>
        <button onClick={() => ctx.setSelectedIds(["layer-1"])}>select-layer</button>
      </div>
    );
  }

  it("provides default values without a provider", () => {
    render(<Inspector />);
    expect(screen.getByTestId("tool").textContent).toBe("select");
    expect(screen.getByTestId("selected").textContent).toBe("");
    expect(screen.getByTestId("readonly").textContent).toBe("false");
  });

  it("provides custom initial values", () => {
    render(
      <ShellProvider initialTool="hand" initialSelectedIds={["a", "b"]}>
        <Inspector />
      </ShellProvider>,
    );
    expect(screen.getByTestId("tool").textContent).toBe("hand");
    expect(screen.getByTestId("selected").textContent).toBe("a,b");
  });

  it("setActiveTool updates the tool", async () => {
    const user = userEvent.setup();
    render(
      <ShellProvider>
        <Inspector />
      </ShellProvider>,
    );
    await user.click(screen.getByRole("button", { name: "set-hand" }));
    expect(screen.getByTestId("tool").textContent).toBe("hand");
  });

  it("setSelectedIds updates selection", async () => {
    const user = userEvent.setup();
    render(
      <ShellProvider>
        <Inspector />
      </ShellProvider>,
    );
    await user.click(screen.getByRole("button", { name: "select-layer" }));
    expect(screen.getByTestId("selected").textContent).toBe("layer-1");
  });

  it("respects readOnly flag", () => {
    render(
      <ShellProvider readOnly>
        <Inspector />
      </ShellProvider>,
    );
    expect(screen.getByTestId("readonly").textContent).toBe("true");
  });

  it("controlled value override works", () => {
    render(
      <ShellProvider value={{ activeTool: "text", readOnly: true }}>
        <Inspector />
      </ShellProvider>,
    );
    expect(screen.getByTestId("tool").textContent).toBe("text");
    expect(screen.getByTestId("readonly").textContent).toBe("true");
  });

  it("resolveKind is accessible via context", () => {
    const resolver = (id: string) => (id === "txt-1" ? "text" : undefined);
    function KindCheck() {
      const ctx = useShellContext();
      return <span>{ctx.resolveKind?.("txt-1")}</span>;
    }
    render(
      <ShellProvider resolveKind={resolver}>
        <KindCheck />
      </ShellProvider>,
    );
    expect(screen.getByText("text")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DesignerShell                                                        */
/* ------------------------------------------------------------------ */

describe("DesignerShell", () => {
  it("renders children", () => {
    render(
      <DesignerShell>
        <div>Canvas area</div>
      </DesignerShell>,
    );
    expect(screen.getByText("Canvas area")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(
      <DesignerShell className="custom-shell">
        <div />
      </DesignerShell>,
    );
    expect(container.firstChild).toHaveClass("custom-shell");
  });
});

/* ------------------------------------------------------------------ */
/* DesignerHeader                                                       */
/* ------------------------------------------------------------------ */

describe("DesignerHeader", () => {
  it("renders slot content", () => {
    render(
      <DesignerHeader
        left={<span>Left</span>}
        center={<span>Title</span>}
        right={<span>Right</span>}
      />,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("renders as a header element", () => {
    render(<DesignerHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DesignerToolbar                                                      */
/* ------------------------------------------------------------------ */

describe("DesignerToolbar", () => {
  it('renders with role="toolbar"', () => {
    render(
      <DesignerToolbar>
        <span>Tool</span>
      </DesignerToolbar>,
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("renders floating and inline variants without error", () => {
    const variants = ["floating", "inline"] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <DesignerToolbar variant={variant}>
          <span>T</span>
        </DesignerToolbar>,
      );
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* DesignerSidebar                                                      */
/* ------------------------------------------------------------------ */

describe("DesignerSidebar", () => {
  const MockIcon = ({ size }: { size?: number }) => (
    <svg data-testid="icon" width={size} height={size} />
  );

  it("renders items with aria-labels", () => {
    render(
      <DesignerSidebar
        items={[
          { id: "select", label: "Select", icon: MockIcon },
          { id: "hand", label: "Pan", icon: MockIcon },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pan" })).toBeInTheDocument();
  });

  it("renders on left and right sides without error", () => {
    for (const side of ["left", "right"] as const) {
      const { unmount } = render(<DesignerSidebar items={[]} side={side} />);
      expect(document.querySelector("aside")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders bottom items", () => {
    render(
      <DesignerSidebar
        items={[]}
        bottomItems={[{ id: "settings", label: "Settings", icon: MockIcon }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DesignerPanel                                                        */
/* ------------------------------------------------------------------ */

describe("DesignerPanel", () => {
  it("renders children on right side", () => {
    render(<DesignerPanel side="right">Panel content</DesignerPanel>);
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("clips horizontal overflow by default", () => {
    render(<DesignerPanel side="right">Panel content</DesignerPanel>);
    const panel = screen.getByText("Panel content").closest("aside");
    expect(panel).toHaveClass("overflow-hidden");
    expect(panel?.firstElementChild).toHaveClass("overflow-x-hidden");
  });

  it("renders left side panel", () => {
    render(
      <DesignerPanel side="left">
        <span>L-panel</span>
      </DesignerPanel>,
    );
    expect(screen.getByText("L-panel")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DesignerPane                                                         */
/* ------------------------------------------------------------------ */

describe("DesignerPane", () => {
  it("renders children when no showFor restriction", () => {
    render(
      <ShellProvider initialSelectedIds={["layer-1"]}>
        <DesignerPane>Pane content</DesignerPane>
      </ShellProvider>,
    );
    expect(screen.getByText("Pane content")).toBeInTheDocument();
  });

  it("clips horizontal pane overflow by default", () => {
    render(
      <ShellProvider initialSelectedIds={["layer-1"]}>
        <DesignerPane>
          <span>Pane content</span>
        </DesignerPane>
      </ShellProvider>,
    );
    const pane = screen.getByText("Pane content").closest("section");
    expect(pane).toHaveClass("min-w-0", "overflow-x-hidden");
  });

  it("renders children when showFor matches selected kind", () => {
    const resolver = (id: string) => (id === "txt-1" ? "text" : undefined);
    render(
      <ShellProvider initialSelectedIds={["txt-1"]} resolveKind={resolver}>
        <DesignerPane showFor={["text"]}>Text pane</DesignerPane>
      </ShellProvider>,
    );
    expect(screen.getByText("Text pane")).toBeInTheDocument();
  });

  it("hides children when showFor does not match selected kind", () => {
    const resolver = (id: string) => (id === "img-1" ? "image" : undefined);
    render(
      <ShellProvider initialSelectedIds={["img-1"]} resolveKind={resolver}>
        <DesignerPane showFor={["text"]}>Should be hidden</DesignerPane>
      </ShellProvider>,
    );
    expect(screen.queryByText("Should be hidden")).not.toBeInTheDocument();
  });

  it("accepts showFor as a predicate function", () => {
    render(
      <ShellProvider initialSelectedIds={["x", "y"]}>
        <DesignerPane showFor={(ids) => ids.length >= 2}>Multi-select pane</DesignerPane>
      </ShellProvider>,
    );
    expect(screen.getByText("Multi-select pane")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DesignerPropertyRow                                                  */
/* ------------------------------------------------------------------ */

describe("DesignerPropertyRow", () => {
  it("renders a generated label and controls", () => {
    render(
      <DesignerPropertyRow label="Color" labelFor="color-input">
        <input id="color-input" />
      </DesignerPropertyRow>,
    );

    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByLabelText("Color")).toBeInTheDocument();
  });

  it("constrains inspector rows without clipping focused controls", () => {
    render(
      <DesignerPropertyRow>
        <DesignerPropertyLabel>Border</DesignerPropertyLabel>
        <DesignerPropertyControls>
          <span>Controls</span>
        </DesignerPropertyControls>
      </DesignerPropertyRow>,
    );

    const row = screen.getByText("Border").parentElement;
    const controls = screen.getByText("Controls").parentElement;
    expect(row).toHaveClass("min-w-0", "max-w-full");
    expect(row).not.toHaveClass("overflow-x-hidden", "overflow-hidden");
    expect(controls).toHaveClass("min-w-0", "max-w-full", "overflow-visible");
  });

  it("renders grouped rows", () => {
    render(
      <DesignerPropertyGroup title="Effects">
        <DesignerPropertyRow label="Opacity">
          <input />
        </DesignerPropertyRow>
      </DesignerPropertyGroup>,
    );

    expect(screen.getByText("Effects")).toBeInTheDocument();
    expect(screen.getByText("Opacity")).toBeInTheDocument();
  });
});
