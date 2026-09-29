import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "../button";
import { PaginationLink } from "../pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../alert-dialog";
import "@testing-library/jest-dom";

/** The classes that paint a button's fill (its `::before` layer). */
const fillClasses = (el: Element) =>
  Array.from(el.classList)
    .filter((c) => c.includes("before:"))
    .sort();

/* ------------------------------------------------------------------ */
/* Button asChild fill parity                                           */
/* ------------------------------------------------------------------ */

describe("Button fill parity", () => {
  const variants = [
    "primary",
    "brand",
    "secondary",
    "outline",
    "destructive",
    "ghost",
    "tile",
    "field",
  ] as const;

  it.each(variants)("a %s asChild link gets the same fill as the plain button", (variant) => {
    render(
      <>
        <Button variant={variant}>Plain</Button>
        <Button variant={variant} asChild>
          <a href="/orders">Linked</a>
        </Button>
      </>,
    );
    const plain = screen.getByRole("button", { name: "Plain" });
    const link = screen.getByRole("link", { name: "Linked" });
    expect(fillClasses(link)).toEqual(fillClasses(plain));
    expect(link.className).toBe(plain.className);
  });

  it("paints the primary fill, hover and press on the element itself", () => {
    render(
      <Button asChild>
        <a href="/orders">Orders</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Orders" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveClass(
      "isolate",
      "before:absolute",
      "before:inset-0",
      "before:-z-10",
      "before:rounded-[inherit]",
      "before:bg-foreground",
      "hover:before:bg-foreground/90",
      "active:before:bg-foreground/80",
      "text-background",
    );
    // A single element child stays a single element: no extra fill span.
    expect(link.children).toHaveLength(0);
    expect(link).toHaveTextContent("Orders");
  });

  it("the plain button no longer renders a separate fill span", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.querySelector("span[aria-hidden]")).toBeNull();
    expect(button).toHaveClass("before:bg-foreground");
  });

  it("`active` swaps the fill for the held fill on both renderings", () => {
    render(
      <>
        <Button variant="secondary" active>
          Plain
        </Button>
        <Button variant="secondary" active asChild>
          <a href="/x">Linked</a>
        </Button>
      </>,
    );
    for (const el of [
      screen.getByRole("button", { name: "Plain" }),
      screen.getByRole("link", { name: "Linked" }),
    ]) {
      expect(el).toHaveClass("before:bg-foreground/[0.15]", "hover:before:bg-foreground/[0.15]");
      expect(el).not.toHaveClass(
        "before:bg-foreground/[0.07]",
        "hover:before:bg-foreground/[0.11]",
      );
      expect(el).toHaveAttribute("data-active");
    }
  });

  it("asChild supports loading: busy, inert and the same loading glyph", () => {
    const onClick = vi.fn();
    render(
      <Button asChild loading onClick={onClick}>
        <a href="/save">Save</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Save" });
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link.querySelector("svg path.animate-hilum-orbit")).not.toBeNull();
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild renders leading icons inside the child and forwards refs", () => {
    const ref = vi.fn();
    const Icon = (props: { size?: number }) => <svg data-testid="lead" width={props.size} />;
    render(
      <Button asChild leadingIcon={Icon} ref={ref}>
        <a href="/new">New order</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "New order" });
    expect(link).toContainElement(screen.getByTestId("lead"));
    expect(ref).toHaveBeenCalledWith(link);
  });

  it("disabled asChild links are aria-disabled and don't navigate", () => {
    render(
      <Button asChild disabled>
        <a href="/x">Blocked</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Blocked" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveClass("aria-disabled:opacity-50", "aria-disabled:pointer-events-none");
    expect(fireEvent.click(link)).toBe(false);
  });

  it("the loading spinner animates (hilum-orbit) and respects reduced motion", () => {
    render(<Button loading>Saving</Button>);
    const path = screen.getByRole("button").querySelector("svg path");
    expect(path).toHaveClass("animate-hilum-orbit", "motion-reduce:animate-none");
    expect(path).not.toHaveAttribute("style");
  });

  it("buttonVariants() alone carries the fill for foreign elements", () => {
    const classes = buttonVariants({ variant: "destructive" });
    expect(classes).toContain("before:bg-destructive/10");
    expect(classes).toContain("hover:before:bg-destructive/15");
  });
});

/* ------------------------------------------------------------------ */
/* Pagination active page                                               */
/* ------------------------------------------------------------------ */

describe("PaginationLink", () => {
  it("fills the current page with the inverted foreground", () => {
    render(
      <>
        <PaginationLink href="?page=1">1</PaginationLink>
        <PaginationLink href="?page=2" isActive>
          2
        </PaginationLink>
      </>,
    );
    const current = screen.getByRole("link", { name: "2" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("text-background", "before:bg-foreground");
    const other = screen.getByRole("link", { name: "1" });
    expect(other).not.toHaveClass("before:bg-foreground");
    expect(other).toHaveClass("hover:before:bg-foreground/[0.06]");
  });
});

/* ------------------------------------------------------------------ */
/* AlertDialogAction asChild                                            */
/* ------------------------------------------------------------------ */

describe("AlertDialogAction / AlertDialogCancel asChild", () => {
  it("lets a Button child keep its own variant", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <Button variant="outline">Keep</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const action = screen.getByRole("button", { name: "Delete" });
    expect(action).toHaveAttribute("data-slot", "alert-dialog-action");
    expect(action).toHaveClass("text-destructive", "before:bg-destructive/10");
    expect(action).not.toHaveClass("bg-brand-primary", "text-background");
    const cancel = screen.getByRole("button", { name: "Keep" });
    expect(cancel).toHaveClass("border-border");
    expect(cancel).not.toHaveClass("bg-card", "rounded-xl");
  });
});
