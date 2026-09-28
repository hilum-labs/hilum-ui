import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Layers, Palette, Settings } from "lucide-react";
import { DesignerPanelHeader, DesignerPanelTabs } from "../components/DesignerPanelHeader";

const TABS = [
  { value: "sections", label: "Sections", icon: Layers },
  { value: "theme", label: "Theme", icon: Palette },
  { value: "settings", label: "Settings", icon: Settings, disabled: true },
] as const;

describe("DesignerPanelHeader", () => {
  it("renders title, description, actions and a second row", () => {
    render(
      <DesignerPanelHeader
        title="Sections"
        description="Home page"
        actions={<button type="button">Add</button>}
      >
        <div>Search row</div>
      </DesignerPanelHeader>,
    );
    expect(screen.getByText("Sections")).toBeInTheDocument();
    expect(screen.getByText("Home page")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("Search row")).toBeInTheDocument();
  });

  it("is sticky by default and can opt out", () => {
    const { container, rerender } = render(<DesignerPanelHeader title="A" />);
    expect(container.firstChild).toHaveClass("sticky");
    rerender(<DesignerPanelHeader title="A" sticky={false} />);
    expect(container.firstChild).not.toHaveClass("sticky");
  });
});

describe("DesignerPanelTabs", () => {
  it("is value-based and skips disabled tabs", () => {
    const onValueChange = vi.fn();
    render(
      <DesignerPanelTabs
        tabs={TABS}
        value="sections"
        onValueChange={onValueChange}
        aria-label="Editor panels"
      />,
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveClass("overflow-x-auto");
    expect(screen.getByRole("tab", { name: /Sections/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: /Theme/ }));
    expect(onValueChange).toHaveBeenCalledWith("theme");
    fireEvent.click(screen.getByRole("tab", { name: /Settings/ }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});
