import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ShellProvider, useShellContext } from "../shell/ShellContext";
import { DesignerShell } from "../components/DesignerShell";
import { DesignerWorkspace, DesignerWorkspaceViewport } from "../components/DesignerWorkspace";
import { DesignerHeader } from "../components/DesignerHeader";
import { DesignerToolbar } from "../components/DesignerToolbar";
import { DesignerSidebar } from "../components/DesignerSidebar";
import { DesignerPanel } from "../components/DesignerPanel";
import { TwoValueControl } from "../components/DesignerValueControls";
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
/* DesignerWorkspace                                                    */
/* ------------------------------------------------------------------ */

describe("DesignerWorkspace", () => {
  it("creates a relative editor boundary with configurable safe insets", () => {
    render(
      <DesignerWorkspace safeInsets={{ top: 12, right: "18rem", bottom: 72, left: 320 }}>
        <DesignerWorkspaceViewport>Visible canvas</DesignerWorkspaceViewport>
      </DesignerWorkspace>,
    );

    const viewport = screen.getByText("Visible canvas");
    const workspace = viewport.parentElement;

    expect(workspace).toHaveAttribute("data-designer-workspace");
    expect(workspace).toHaveClass("relative", "isolate", "overflow-hidden");
    expect(workspace).toHaveStyle({
      "--designer-workspace-inset-top": "12px",
      "--designer-workspace-inset-right": "18rem",
      "--designer-workspace-inset-bottom": "72px",
      "--designer-workspace-inset-left": "320px",
    });
    expect(viewport).toHaveAttribute("data-designer-workspace-viewport");
    expect(viewport.getAttribute("style")).toContain("top: var(--designer-workspace-inset-top)");
    expect(viewport.getAttribute("style")).toContain(
      "right: var(--designer-workspace-inset-right)",
    );
    expect(viewport.getAttribute("style")).toContain(
      "bottom: var(--designer-workspace-inset-bottom)",
    );
    expect(viewport.getAttribute("style")).toContain("left: var(--designer-workspace-inset-left)");
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
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).not.toHaveClass("border-b", "border-border");
  });

  it("keeps the center slot centered independently of the side content", () => {
    render(
      <DesignerHeader
        left={<span>Long document name</span>}
        center={<span>Modes</span>}
        right={<span>Account</span>}
      />,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("grid", "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]");
    expect(header.querySelector('[data-designer-header-slot="left"]')).toHaveClass(
      "justify-self-start",
    );
    expect(header.querySelector('[data-designer-header-slot="center"]')).toHaveClass(
      "justify-self-center",
    );
    expect(header.querySelector('[data-designer-header-slot="right"]')).toHaveClass(
      "justify-self-end",
    );
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

  it("uses the native shadow surface without an extra border", () => {
    render(
      <DesignerToolbar>
        <span>Tool</span>
      </DesignerToolbar>,
    );

    expect(screen.getByRole("toolbar")).toHaveClass("bg-card", "shadow-surface-3");
    expect(screen.getByRole("toolbar")).not.toHaveClass("border", "border-border");
  });

  it("renders floating, inline, and dock variants without error", () => {
    const variants = ["floating", "inline", "dock"] as const;
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

  it("adds mobile dock positioning when requested", () => {
    render(
      <DesignerToolbar variant="dock">
        <span>T</span>
      </DesignerToolbar>,
    );
    expect(screen.getByRole("toolbar")).toHaveClass("inset-x-3", "overflow-x-auto");
  });

  it("can position a floating toolbar relative to its workspace", () => {
    render(
      <DesignerToolbar boundary="workspace">
        <span>T</span>
      </DesignerToolbar>,
    );

    expect(screen.getByRole("toolbar")).toHaveClass("absolute");
    expect(screen.getByRole("toolbar")).not.toHaveClass("fixed");
  });

  it("can center a floating toolbar within the workspace safe area", () => {
    render(
      <DesignerToolbar boundary="workspace" center="safe-area">
        <span>T</span>
      </DesignerToolbar>,
    );

    expect(screen.getByRole("toolbar")).toHaveStyle({
      left: "calc(var(--designer-workspace-inset-left) + (100% - var(--designer-workspace-inset-left) - var(--designer-workspace-inset-right)) / 2)",
    });
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

  it("renders item tooltips as designed floating surfaces", async () => {
    const user = userEvent.setup();
    render(<DesignerSidebar items={[{ id: "select", label: "Select", icon: MockIcon }]} />);

    await user.hover(screen.getByRole("button", { name: "Select" }));

    const tooltip = await screen.findByRole("tooltip", { name: "Select" });
    const surface = screen.getAllByText("Select")[0]?.closest("div");
    expect(tooltip).toBeInTheDocument();
    expect(surface).toHaveClass("rounded-lg", "bg-foreground", "text-background", "shadow-natural");
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

  it("renders a bottom tool dock variant for mobile shells", () => {
    render(
      <DesignerSidebar
        variant="bottom"
        items={[
          { id: "select", label: "Select", icon: MockIcon },
          { id: "hand", label: "Pan", icon: MockIcon },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Editor tools" })).toHaveClass(
      "fixed",
      "inset-x-3",
    );
    expect(screen.getByRole("button", { name: "Select" })).toHaveClass("size-11");
  });

  it("renders a rounded floating desktop rail within the workspace", () => {
    render(
      <DesignerSidebar
        variant="floating"
        floatingInset={{ top: 12, bottom: 20, left: 16 }}
        items={[{ id: "select", label: "Select", icon: MockIcon }]}
      />,
    );

    const rail = screen.getByRole("navigation", { name: "Editor tools" });
    const itemList = rail.querySelector("[data-designer-sidebar-items]");
    expect(rail).toHaveClass("absolute", "rounded-lg", "bg-card", "shadow-surface-3");
    expect(rail).toHaveClass("duration-200", "ease-out", "motion-reduce:transition-none");
    expect(rail).not.toHaveClass("border", "border-border");
    expect(rail).toHaveStyle({
      top: "12px",
      left: "16px",
      height: "fit-content",
      maxHeight: "calc(100% - 12px - 20px)",
    });
    expect(rail.style.bottom).toBe("");
    expect(itemList).toHaveClass("flex-initial");
    expect(itemList).not.toHaveClass("flex-1");
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

  it("renders a controlled sheet variant for mobile panels", () => {
    render(
      <DesignerPanel side="right" variant="sheet" open sheetTitle="Properties">
        <span>Mobile panel content</span>
      </DesignerPanel>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("Mobile panel content")).toBeInTheDocument();
  });

  it("renders an elevated floating panel on either workspace edge", () => {
    render(
      <DesignerPanel
        side="left"
        variant="floating"
        width={280}
        floatingInset={{ top: 12, bottom: 20, left: 76 }}
      >
        Floating panel
      </DesignerPanel>,
    );

    const panel = screen.getByText("Floating panel").closest("aside");
    expect(panel).toHaveAttribute("data-variant", "floating");
    expect(panel).toHaveClass("absolute", "rounded-lg", "bg-card", "shadow-surface-3");
    expect(panel).toHaveClass("duration-200", "ease-out", "motion-reduce:transition-none");
    expect(panel).not.toHaveClass("border", "border-border");
    expect(panel).toHaveStyle({
      top: "12px",
      left: "76px",
      width: "280px",
      height: "fit-content",
      maxHeight: "calc(100% - 12px - 20px)",
    });
    expect(panel?.style.bottom).toBe("");
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

/* ------------------------------------------------------------------ */
/* Density                                                              */
/* ------------------------------------------------------------------ */

describe("editor density", () => {
  it("DesignerShell defaults to compact density", () => {
    const { container } = render(
      <DesignerShell>
        <div>content</div>
      </DesignerShell>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-density", "compact");
    expect(container.firstElementChild).toHaveClass("bg-canvas");
  });

  it("DesignerShell can opt back into default density", () => {
    const { container } = render(
      <DesignerShell density="default">
        <div>content</div>
      </DesignerShell>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-density", "default");
  });

  it("DesignerPanel defaults to compact density and supports opting out", () => {
    const { rerender } = render(<DesignerPanel side="right">Panel content</DesignerPanel>);
    expect(screen.getByText("Panel content").closest("aside")).toHaveAttribute(
      "data-density",
      "compact",
    );
    rerender(
      <DesignerPanel side="right" density="default">
        Panel content
      </DesignerPanel>,
    );
    expect(screen.getByText("Panel content").closest("aside")).toHaveAttribute(
      "data-density",
      "default",
    );
  });

  it("DesignerPropertyRow supports an inline label column", () => {
    render(
      <DesignerPropertyRow label="Opacity" layout="inline" labelWidth={48}>
        <input aria-label="opacity" />
      </DesignerPropertyRow>,
    );
    const label = screen.getByText("Opacity");
    // The label reads its width from the row's variable (shared with composed labels).
    expect(label).toHaveClass("w-[var(--designer-label-width,64px)]", "shrink-0");
    expect(label.parentElement!.style.getPropertyValue("--designer-label-width")).toBe("48px");
    expect(label.parentElement).toHaveAttribute("data-layout", "inline");
    expect(label.parentElement).toHaveClass("flex-row");
  });
});

describe("TwoValueControl", () => {
  it("renders label-in-field inputs in a two-column grid", () => {
    render(
      <TwoValueControl
        values={{ x: 10, y: 20 }}
        items={[
          { key: "x", label: "X", ariaLabel: "X position" },
          { key: "y", label: "Y" },
        ]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("spinbutton", { name: "X position" })).toHaveValue("10");
    // Falls back to the string label for the accessible name.
    const y = screen.getByRole("spinbutton", { name: "Y" });
    expect(y).toHaveValue("20");
    expect(y.closest(".grid")).toHaveClass("grid-cols-2");
  });
});
