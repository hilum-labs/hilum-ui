import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DesignerHeader } from "../components/DesignerHeader";

const secondary = ["Preview", "Share", "Export", "Duplicate", "History"].map((label) => ({
  label,
  onAction: vi.fn(),
}));

describe("DesignerHeader actions", () => {
  it("renders the primary action last and never hides it", () => {
    render(
      <DesignerHeader
        right={<span>Presence</span>}
        primaryAction={{ label: "Publish", onAction: () => {} }}
        secondaryActions={secondary}
      />,
    );
    const actions = document.querySelector("[data-designer-header-actions]")!;
    const publish = screen.getByRole("button", { name: "Publish" });
    expect(actions.lastElementChild).toBe(publish);
    expect(publish).not.toHaveClass("hidden");
    expect(actions).toHaveClass("shrink-0");
    // Free-form right content is the part that gets clipped.
    expect(screen.getByText("Presence").parentElement).toHaveClass("overflow-hidden", "min-w-0");
  });

  it("shows up to maxVisibleSecondaryActions inline on wide headers and overflows the rest", () => {
    render(
      <DesignerHeader
        primaryAction={{ label: "Publish" }}
        secondaryActions={secondary}
        maxVisibleSecondaryActions={2}
      />,
    );
    const inline = ["Preview", "Share"].map((name) => screen.getByRole("button", { name }));
    for (const button of inline)
      expect(button).toHaveClass("hidden", "@4xl/designer-header:inline-flex");
    expect(screen.queryByRole("button", { name: "Export" })).toBeNull();
    const menus = screen.getAllByRole("button", { name: "More actions" });
    // One menu with everything for narrow headers, one with the overflow for wide ones.
    expect(menus).toHaveLength(2);
    expect(menus[0]).toHaveClass("@4xl/designer-header:hidden");
    expect(menus[1]).toHaveClass("hidden", "@4xl/designer-header:inline-flex");
  });

  it("the overflow menu lists the remaining actions and runs them", async () => {
    render(
      <DesignerHeader
        primaryAction={{ label: "Publish" }}
        secondaryActions={secondary}
        labels={{ moreActions: "Más acciones" }}
      />,
    );
    const menus = screen.getAllByRole("button", { name: "Más acciones" });
    await userEvent.click(menus[1]!);
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((i) => i.textContent)).toEqual(["Export", "Duplicate", "History"]);
    await userEvent.click(items[0]!);
    expect(secondary[2]!.onAction).toHaveBeenCalled();
  });

  it("keeps working without structured actions", () => {
    render(<DesignerHeader right={<button type="button">Share</button>} />);
    expect(document.querySelector("[data-designer-header-actions]")).toBeNull();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });
});
