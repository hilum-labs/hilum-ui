import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PaginationLink, PaginationNext } from "../pagination";
import { PropertyRow } from "../property-row";
import { InputNumber } from "../input-number";
import { Slider } from "../slider";
import { Command, CommandItem, CommandList } from "../command";
import { CheckboxGroup, CheckboxItem } from "../checkbox-group";
import { SidebarMenuButton } from "../sidebar";
import { Field } from "../field";
import { Input } from "../input";

/* Fixes from an axe audit of the catalog's demos (4.4.4). */

describe("PaginationLink", () => {
  it("is a keyboard-reachable button without href, and can be disabled", () => {
    const onClick = vi.fn();
    render(
      <>
        <PaginationLink onClick={onClick}>2</PaginationLink>
        <PaginationNext onClick={onClick} disabled />
        <PaginationLink href="?page=3">3</PaginationLink>
        <PaginationLink href="?page=4" disabled>
          4
        </PaginationLink>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("href", "?page=3");
    const disabledLink = screen.getByText("4");
    expect(disabledLink).toHaveAttribute("aria-disabled", "true");
    expect(disabledLink).not.toHaveAttribute("href");
  });
});

describe("PropertyRow", () => {
  it("names every control in the row with its label", () => {
    render(
      <PropertyRow label="Opacity">
        <Slider value={[40]} min={0} max={100} />
        <InputNumber value={40} onChange={() => {}} unit="%" />
      </PropertyRow>,
    );
    expect(screen.getByRole("spinbutton", { name: "Opacity" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Opacity" })).toBeInTheDocument();
  });

  it("names a second input by the label; a Field only names its first", () => {
    render(
      <>
        <PropertyRow label="Size">
          <Input />
          <Input />
        </PropertyRow>
        <Field label="Email">
          <Input />
          <Input aria-label="Backup email" />
        </Field>
      </>,
    );
    expect(screen.getAllByRole("textbox", { name: "Size" })).toHaveLength(2);
    expect(screen.getAllByRole("textbox", { name: "Email" })).toHaveLength(1);
  });
});

describe("CommandList, CheckboxGroup and a collapsed SidebarMenuButton", () => {
  it("CommandList has a default name that props override", () => {
    const { rerender } = render(
      <Command>
        <CommandList>
          <CommandItem value="a">A</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(screen.getByRole("listbox", { name: "Suggestions" })).toBeInTheDocument();
    rerender(
      <Command>
        <CommandList aria-label="Pages">
          <CommandItem value="a">A</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(screen.getByRole("listbox", { name: "Pages" })).toBeInTheDocument();
  });

  it("CheckboxGroup rows are the only checkboxes (no nested control)", () => {
    const onToggle = vi.fn();
    render(
      <CheckboxGroup checkedIndices={new Set([0])}>
        <CheckboxItem index={0} label="Apples" checked onToggle={onToggle} />
      </CheckboxGroup>,
    );
    const row = screen.getByRole("checkbox", { name: "Apples" });
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    expect(row.querySelector("button, input, [tabindex]")).toBeNull();
    fireEvent.click(row);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("a collapsed SidebarMenuButton keeps its label as its name", () => {
    render(
      <SidebarMenuButton data-state="collapsed">
        <svg aria-hidden="true" />
        <span>Inbox</span>
      </SidebarMenuButton>,
    );
    const button = screen.getByRole("button", { name: "Inbox" });
    expect(button.className).toContain("data-[state=collapsed]:[&>span]:sr-only");
    expect(button.className).not.toContain("[&>span]:hidden");
  });
});
