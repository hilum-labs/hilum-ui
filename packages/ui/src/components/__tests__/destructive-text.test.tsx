import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { render, screen } from "@testing-library/react";
import { AlertCircle } from "lucide-react";
import { describe, expect, it } from "vitest";
import {
  Alert,
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  Input,
} from "../../index";

// Destructive-coloured text and icons use --destructive-text, which
// tokens.test.ts holds at ≥ 4.5:1 on every surface and destructive tint in
// light, mid and dark. --destructive itself (1.6:1 as text on the mid page)
// stays for fills, borders, tints and rings.

/** `text-destructive` as a text colour, not `-text` / `-foreground` or an alpha. */
const DESTRUCTIVE_FILL_AS_TEXT = /text-destructive(?![-\w/])/;

describe("destructive text uses --destructive-text", () => {
  it("Button destructive: readable label on the destructive tint", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("text-destructive-text", "before:bg-destructive/10");
    expect(button).toHaveClass("border-destructive/30");
    expect(button).not.toHaveClass("text-destructive");
    expect(buttonVariants({ variant: "destructive" })).not.toMatch(DESTRUCTIVE_FILL_AS_TEXT);
  });

  it("Field: the error message and the required mark", () => {
    render(
      <Field label="Email" error="Enter an email address" required>
        <Input />
      </Field>,
    );
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Enter an email address");
    expect(error).toHaveClass("text-destructive-text");
    expect(error).not.toHaveClass("text-destructive");
    expect(screen.getByText("*")).toHaveClass("text-destructive-text");
    // The invalid border is the per-theme red too (3:1 against every surface);
    // the focus halo keeps the destructive fill colour.
    const input = screen.getByRole("textbox", { name: /Email/ });
    expect(input).toHaveClass(
      "aria-invalid:border-destructive-text",
      "aria-invalid:focus-visible:ring-destructive/35",
    );
  });

  it("DropdownMenuItem destructive: at rest and focused", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem destructive>Delete</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = screen.getByRole("menuitem", { name: "Delete" });
    expect(item).toHaveClass(
      "text-destructive-text",
      "focus:text-destructive-text",
      "focus:bg-destructive/10",
    );
    expect(item.className).not.toMatch(DESTRUCTIVE_FILL_AS_TEXT);
    expect(screen.getByRole("menuitem", { name: "Rename" })).not.toHaveClass(
      "text-destructive-text",
    );
  });

  it("Alert destructive: the icon", () => {
    render(
      <Alert variant="destructive">
        <AlertCircle />
        Payment failed
      </Alert>,
    );
    expect(screen.getByRole("alert").className).toContain("[&>svg]:text-destructive-text");
  });

  it("no published component uses the destructive fill as a text colour", () => {
    const packages = join(__dirname, "..", "..", "..", "..");
    const sourceFiles = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(path);
        return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
      });
    const offenders = readdirSync(packages)
      .flatMap((name) => sourceFiles(join(packages, name, "src")))
      .filter((file) => DESTRUCTIVE_FILL_AS_TEXT.test(readFileSync(file, "utf8")))
      .map((file) => relative(packages, file));
    expect(offenders).toEqual([]);
  });
});
