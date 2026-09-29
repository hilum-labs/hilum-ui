import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PageHeader } from "../page-header";

describe("PageHeader with a single secondary action", () => {
  it("shows it inline at every width, without a More actions menu", () => {
    const onPreview = vi.fn();
    const { container } = render(
      <PageHeader
        title="Theme"
        primaryAction={{ label: "Publish", onAction: () => {} }}
        secondaryActions={[{ label: "Preview", onAction: onPreview }]}
      />,
    );
    const preview = screen.getByRole("button", { name: "Preview" });
    expect(preview).not.toHaveClass("hidden");
    fireEvent.click(preview);
    expect(onPreview).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-slot='page-header-more-actions']")).toBeNull();
  });

  it("still collapses two or more into the menu on narrow headers", () => {
    const { container } = render(
      <PageHeader
        title="Theme"
        secondaryActions={[{ label: "Preview" }, { label: "Duplicate" }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Preview" })).toHaveClass(
      "hidden",
      "@3xl/page-header:inline-flex",
    );
    const menus = container.querySelectorAll("[data-slot='page-header-more-actions']");
    expect(menus).toHaveLength(1);
    expect(menus[0]).toHaveClass("@3xl/page-header:hidden");
  });

  it("keeps a lone link action inline", () => {
    render(<PageHeader title="Orders" secondaryActions={[{ label: "Export", href: "/export" }]} />);
    expect(screen.getByRole("link", { name: "Export" })).toHaveAttribute("href", "/export");
  });
});
