import { describe, it, expect } from "vitest";
import type * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Thumbnail } from "../thumbnail";

describe("Thumbnail", () => {
  it("renders a square, bordered, rounded image with alt text", () => {
    const { container } = render(<Thumbnail src="/mug.jpg" alt="Ceramic mug" />);
    const img = screen.getByRole("img", { name: "Ceramic mug" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveClass("size-full", "object-cover");
    const tile = container.querySelector("[data-slot='thumbnail']")!;
    expect(tile).toHaveClass("size-10", "rounded-lg", "border", "border-border", "overflow-hidden");
    expect(tile).toHaveAttribute("data-size", "md");
  });

  it.each([
    ["xs", "size-6"],
    ["sm", "size-8"],
    ["md", "size-10"],
    ["lg", "size-20"],
  ] as const)("size %s is %s", (size, cls) => {
    const { container } = render(<Thumbnail src="/a.jpg" alt="A" size={size} />);
    expect(container.querySelector("[data-slot='thumbnail']")).toHaveClass(cls);
  });

  it("supports object-fit contain", () => {
    render(<Thumbnail src="/logo.png" alt="Logo" fit="contain" />);
    expect(screen.getByRole("img", { name: "Logo" })).toHaveClass("object-contain");
  });

  it("shows a neutral placeholder icon without an image, still named by alt", () => {
    const { container } = render(<Thumbnail src={null} alt="Gift card" />);
    const tile = container.querySelector("[data-slot='thumbnail']")!;
    expect(tile).toHaveAttribute("data-empty");
    expect(tile).toHaveClass("bg-muted", "text-muted-foreground");
    expect(screen.getByRole("img", { name: "Gift card" })).toBe(tile);
    expect(tile.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("img")).toBeNull();
  });

  it("is decorative when alt is empty", () => {
    const { container } = render(<Thumbnail alt="" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("[data-slot='thumbnail']")).not.toHaveAttribute("role");
  });

  it("falls back to the placeholder when the image fails to load", () => {
    const { container } = render(<Thumbnail src="/broken.jpg" alt="Hat" />);
    fireEvent.error(screen.getByRole("img", { name: "Hat" }));
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[data-slot='thumbnail']")).toHaveAttribute("data-empty");
  });

  it("accepts a custom placeholder icon", () => {
    const Icon = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="pkg" {...props} />;
    render(<Thumbnail alt="Bundle" placeholderIcon={Icon} />);
    expect(screen.getByTestId("pkg")).toBeInTheDocument();
  });
});
