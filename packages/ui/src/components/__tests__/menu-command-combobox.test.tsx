import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "../dropdown";
import { MenuItem } from "../menu-item";
import { CommandPalette, type CommandPaletteItem } from "../command-palette";
import { Combobox } from "../combobox";

describe("MenuItem roles", () => {
  it("is a plain menuitem without selection semantics", () => {
    render(
      <Dropdown>
        <MenuItem index={0} label="Copy" />
      </Dropdown>,
    );
    const item = screen.getByRole("menuitem", { name: "Copy" });
    expect(item).not.toHaveAttribute("aria-checked");
  });

  it("is a menuitemradio when checked state is provided", () => {
    render(
      <Dropdown checkedIndex={1}>
        <MenuItem index={0} label="A" checked={false} />
        <MenuItem index={1} label="B" checked />
      </Dropdown>,
    );
    expect(screen.getByRole("menuitemradio", { name: "A" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("menuitemradio", { name: "B" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("uses radio semantics when the Dropdown tracks a checkedIndex", () => {
    render(
      <Dropdown checkedIndex={0}>
        <MenuItem index={0} label="A" />
      </Dropdown>,
    );
    expect(screen.getByRole("menuitemradio", { name: "A" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("honours an explicit type", () => {
    render(
      <Dropdown>
        <MenuItem index={0} label="Wrap" type="checkbox" checked />
        <MenuItem index={1} label="Reset" type="item" checked />
      </Dropdown>,
    );
    expect(screen.getByRole("menuitemcheckbox", { name: "Wrap" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("menuitem", { name: "Reset" })).not.toHaveAttribute("aria-checked");
  });

  it("arrow keys move focus between plain menuitems", () => {
    render(
      <Dropdown>
        <MenuItem index={0} label="One" />
        <MenuItem index={1} label="Two" />
        <MenuItem index={2} label="Three" />
      </Dropdown>,
    );
    const one = screen.getByRole("menuitem", { name: "One" });
    one.focus();
    fireEvent.keyDown(one, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Two" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Three" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(one).toHaveFocus();
  });
});

describe("CommandPalette", () => {
  const items: CommandPaletteItem[] = [
    { id: 1, label: "Home", href: "/home", category: "Pages" },
    { id: 2, label: "Settings", href: "/settings", category: "Pages" },
    { id: 3, label: "Log out", onSelect: vi.fn(), category: "Actions" },
  ];

  it("has an accessible dialog title, description and input label", () => {
    render(<CommandPalette open onClose={() => {}} items={items} />);
    expect(screen.getByRole("dialog", { name: "Command palette" })).toHaveAccessibleDescription(
      /arrow keys/i,
    );
    expect(screen.getByRole("combobox", { name: "Command palette" })).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates with arrow keys via aria-activedescendant and selects with Enter", () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items} onNavigate={onNavigate} />);
    const input = screen.getByRole("combobox");
    const active = () => document.getElementById(input.getAttribute("aria-activedescendant")!);

    expect(active()).toHaveTextContent("Home");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(active()).toHaveTextContent("Settings");
    expect(active()).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "ArrowUp" }); // wraps to the last item
    expect(active()).toHaveTextContent("Log out");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onNavigate).toHaveBeenCalledWith("/settings");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onSelect for action items and filters by query", () => {
    const onSelect = vi.fn();
    render(
      <CommandPalette open onClose={() => {}} items={[...items, { label: "Invite", onSelect }]} />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "inv" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalled();
  });
});

describe("Combobox", () => {
  const options = Array.from({ length: 5 }, (_, i) => ({ value: `v${i}`, label: `Option ${i}` }));

  it("forwards id, aria-*, ref and onBlur to the input and submits name", () => {
    const ref = createRef<HTMLInputElement>();
    const onBlur = vi.fn();
    const { container } = render(
      <form>
        <label htmlFor="assignee">Assignee</label>
        <Combobox
          ref={ref}
          id="assignee"
          name="assignee"
          value="v2"
          options={options}
          aria-describedby="hint"
          aria-invalid
          onBlur={onBlur}
        />
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "Assignee" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("aria-describedby", "hint");
    expect(input).toHaveAttribute("aria-invalid", "true");
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
    const hidden = container.querySelector('input[type="hidden"][name="assignee"]');
    expect(hidden).toHaveValue("v2");
  });

  it("can be disabled", () => {
    render(<Combobox options={options} disabled aria-label="Pick" />);
    expect(screen.getByRole("combobox", { name: "Pick" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Open" })).toBeDisabled();
  });

  it("scrolls the active option into view", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<Combobox options={options} aria-label="Pick" />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toMatch(/option-1$/);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });
});
