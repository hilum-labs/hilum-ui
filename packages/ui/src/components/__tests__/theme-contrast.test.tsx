import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Button,
  buttonVariants,
  Checkbox,
  ConfirmDialog,
  Field,
  InputNumber,
  Switch,
} from "../../index";
import { controlInvalidClasses, controlInvalidWithinClasses } from "../../lib/interaction";

// Solid fills use a label tuned for the fill (`text-primary-foreground`,
// `text-destructive-foreground`), never the page background, and hover /
// pressed fills that mix toward a shade (`bg-*-hover`, `bg-*-active`) instead
// of fading over the surface. Invalid edges use --destructive-text.
// tokens.test.ts holds the numbers; the browser suite measures them.

const packages = join(__dirname, "..", "..", "..", "..");
const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
/** Published source files with a line matching `pattern`. */
const offenders = (pattern: RegExp) =>
  readdirSync(packages)
    .flatMap((name) => sourceFiles(join(packages, name, "src")))
    .filter((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .some((line) => pattern.test(line)),
    )
    .map((file) => relative(packages, file));

describe("solid fills keep a readable label", () => {
  it("AlertDialogAction: the brand Button's pair and shade-mixed states", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Publish catalog?</AlertDialogTitle>
          <AlertDialogDescription>Customers see the changes right away.</AlertDialogDescription>
          <AlertDialogAction>Publish</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const action = screen.getByRole("button", { name: "Publish" });
    expect(action).toHaveClass(
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary-hover",
      "active:bg-primary-active",
    );
    expect(action).not.toHaveClass("text-background");
    expect(action.className).not.toMatch(/bg-(brand-)?primary\/\d/);
  });

  it("ConfirmDialog destructive: the confirm darkens on hover and press", () => {
    render(<ConfirmDialog open destructive title="Delete product?" onConfirm={() => {}} />);
    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground",
      "hover:bg-destructive-hover",
      "active:bg-destructive-active",
    );
    // The destructive classes replace the brand ones.
    expect(confirm.className).not.toMatch(/bg-primary/);
    expect(confirm.className).not.toMatch(/bg-destructive\/\d/);
  });

  it("Button brand: hover, pressed and `active` mix toward the shade", () => {
    render(
      <>
        <Button variant="brand">Save</Button>
        <Button variant="brand" active>
          Saving
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "text-primary-foreground",
      "before:bg-primary",
      "hover:before:bg-primary-hover",
      "active:before:bg-primary-active",
    );
    const held = screen.getByRole("button", { name: "Saving" });
    expect(held).toHaveClass("before:bg-primary-active", "hover:before:bg-primary-active");
    expect(held.className).not.toMatch(/before:bg-primary(?!-active)/);
    expect(buttonVariants({ variant: "brand" })).not.toMatch(/bg-primary\/\d/);
  });

  it("Button primary: the mid theme stops at the hover fill when pressed", () => {
    render(
      <>
        <Button>Continue</Button>
        <Button active>Continuing</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Continue" })).toHaveClass(
      "text-background",
      "before:bg-foreground",
      "hover:before:bg-foreground/90",
      "active:before:bg-foreground/80",
      "in-data-[theme=mid]:active:before:bg-foreground/90",
    );
    expect(screen.getByRole("button", { name: "Continuing" })).toHaveClass(
      "before:bg-foreground/80",
      "hover:before:bg-foreground/80",
      "in-data-[theme=mid]:before:bg-foreground/90",
      "in-data-[theme=mid]:hover:before:bg-foreground/90",
    );
    expect(buttonVariants({ variant: "default" })).toBe(buttonVariants({ variant: "primary" }));
  });

  it("Checkbox: the mark is the brand label colour", () => {
    render(<Checkbox checked aria-label="Accept terms" onCheckedChange={() => {}} />);
    const mark = screen.getByRole("checkbox").querySelector("span")!;
    expect(mark).toHaveClass("text-primary-foreground");
    expect(mark).not.toHaveClass("text-background");
  });

  it("no published component puts the page background or white on the brand fill", () => {
    // `text-background` is the gray page in mid (1.3:1 on the brand) and
    // near-black in dark (3.9:1).
    const fill = String.raw`bg-(?:brand-)?primary(?![-\w/])`;
    const label = String.raw`text-(?:background|white)(?![-\w])`;
    expect(offenders(new RegExp(`${fill}.*${label}|${label}.*${fill}`))).toEqual([]);
  });

  it("no published component fades a solid brand or destructive fill under a label", () => {
    // Steps' complete circle (a check mark, 3:1) is the one faded fill left.
    const faded = /(?:hover|active):(?:before:)?bg-(?:brand-primary|primary|destructive)\/[89]\d/;
    expect(offenders(faded)).toEqual(["ui/src/components/steps.tsx"]);
  });
});

describe("invalid edges use --destructive-text", () => {
  it("text-entry controls: border at rest, hovered and focused; destructive halo", () => {
    for (const classes of [controlInvalidClasses, controlInvalidWithinClasses]) {
      expect(classes).not.toMatch(/border-destructive(?!-text)/);
      expect(classes.match(/border-destructive-text/g)).toHaveLength(5);
      expect(classes).toContain("ring-destructive/35");
    }
  });

  it("InputNumber, Checkbox and Switch", () => {
    render(
      <>
        <Field label="Quantity" error="Enter a quantity">
          <InputNumber value={1} onChange={() => {}} />
        </Field>
        <Checkbox aria-invalid aria-label="Accept terms" />
        <Switch aria-invalid aria-label="Notifications" />
      </>,
    );
    const number = screen.getByRole("spinbutton", { name: "Quantity" }).closest("[data-invalid]");
    expect(number).toHaveClass(
      "data-[invalid]:border-destructive-text",
      "data-[invalid]:focus-within:ring-destructive/35",
    );
    expect(screen.getByRole("checkbox")).toHaveClass(
      "aria-invalid:border-destructive-text",
      "aria-invalid:outline-destructive-text",
    );
    expect(screen.getByRole("switch")).toHaveClass("aria-invalid:outline-destructive-text");
  });

  it("no published component draws an edge with the destructive fill at full strength", () => {
    // 1.2–1.9:1 against the mid surfaces. Tinted edges (`border-destructive/30`
    // on a tinted box) are decoration and stay.
    expect(offenders(/(?:border|outline)-destructive(?![-\w/])/)).toEqual([]);
  });
});
