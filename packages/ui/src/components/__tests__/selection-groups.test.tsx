import { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioGroupItem, RadioItem } from "../radio-group";
import { CheckboxGroup } from "../checkbox-group";

describe("RadioGroup", () => {
  it("exposes exactly one interactive radio per item", () => {
    render(
      <RadioGroup defaultValue="monthly" aria-label="Billing">
        <RadioGroupItem value="monthly" label="Monthly" />
        <RadioGroupItem value="yearly" label="Yearly" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio", { hidden: true });
    expect(radios).toHaveLength(2);
    expect(radios.every((r) => r.querySelector("button, [role=radio]") === null)).toBe(true);
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAttribute("tabindex", "-1");
  });

  it("selects by click, Space and Enter (uncontrolled)", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange}>
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
        <RadioGroupItem value="c">C</RadioGroupItem>
      </RadioGroup>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange).toHaveBeenLastCalledWith("b");
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();

    fireEvent.keyDown(screen.getByRole("radio", { name: "C" }), { key: " " });
    expect(onValueChange).toHaveBeenLastCalledWith("c");
    fireEvent.keyDown(screen.getByRole("radio", { name: "A" }), { key: "Enter" });
    expect(onValueChange).toHaveBeenLastCalledWith("a");
    expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
  });

  it("moves and selects with arrow keys, wrapping, plus Home / End", () => {
    function Controlled() {
      const [value, setValue] = useState("a");
      return (
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioGroupItem value="a" label="A" />
          <RadioGroupItem value="b" label="B" />
          <RadioGroupItem value="c" label="C" />
        </RadioGroup>
      );
    }
    render(<Controlled />);
    const [a, b, c] = screen.getAllByRole("radio");
    act(() => a!.focus());

    fireEvent.keyDown(a!, { key: "ArrowDown" });
    expect(b).toBeChecked();
    expect(document.activeElement).toBe(b);
    fireEvent.keyDown(b!, { key: "ArrowLeft" });
    expect(a).toBeChecked();
    fireEvent.keyDown(a!, { key: "ArrowUp" }); // wraps to the last
    expect(c).toBeChecked();
    fireEvent.keyDown(c!, { key: "Home" });
    expect(a).toBeChecked();
    fireEvent.keyDown(a!, { key: "End" });
    expect(c).toBeChecked();
    expect(document.activeElement).toBe(c);
  });

  it("supports index-driven selection without values", () => {
    const onSelect = vi.fn();
    render(
      <RadioGroup selectedIndex={1}>
        <RadioItem label="Small" onSelect={() => onSelect(0)} />
        <RadioItem label="Large" onSelect={() => onSelect(1)} />
        <RadioItem label="Custom" selected onSelect={() => onSelect(2)} />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Large" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Custom" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Small" })).not.toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "Small" }));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("clears hover/focus state when focus leaves the group", () => {
    render(
      <>
        <RadioGroup defaultValue="a">
          <RadioGroupItem value="a" label="A" />
          <RadioGroupItem value="b" label="B" />
        </RadioGroup>
        <button>outside</button>
      </>,
    );
    const a = screen.getByRole("radio", { name: "A" });
    fireEvent.focus(a);
    fireEvent.blur(a, { relatedTarget: screen.getByText("outside") });
    // Moving to an unrelated key does nothing.
    fireEvent.keyDown(a, { key: "x" });
    expect(a).toBeChecked();
  });
});

describe("CheckboxGroup", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Bravo" },
    { value: "c", label: "Charlie" },
    { value: "d", label: "Delta" },
  ];

  function Controlled({ initial }: { initial: string[] }) {
    const [value, setValue] = useState(initial);
    return <CheckboxGroup options={options} value={value} onValueChange={setValue} />;
  }

  function selectedBlocks(container: HTMLElement) {
    return container.querySelectorAll(".bg-active[aria-hidden]").length;
  }

  it("toggles options on click and with Space / Enter", () => {
    render(<Controlled initial={["a"]} />);
    const alpha = screen.getByRole("checkbox", { name: "Alpha" });
    const bravo = screen.getByRole("checkbox", { name: "Bravo" });

    fireEvent.click(alpha);
    expect(alpha).not.toBeChecked();
    fireEvent.keyDown(bravo, { key: " " });
    expect(bravo).toBeChecked();
    fireEvent.keyDown(bravo, { key: "Enter" });
    expect(bravo).not.toBeChecked();
  });

  it("moves focus between rows with arrows / Home / End", () => {
    render(<Controlled initial={[]} />);
    const rows = screen.getAllByRole("checkbox");
    act(() => rows[0]!.focus());

    fireEvent.keyDown(rows[0]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows[1]);
    fireEvent.keyDown(rows[1]!, { key: "End" });
    expect(document.activeElement).toBe(rows[3]);
    fireEvent.keyDown(rows[3]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows[0]);
    fireEvent.keyDown(rows[0]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(rows[3]);
    fireEvent.keyDown(rows[3]!, { key: "Home" });
    expect(document.activeElement).toBe(rows[0]);
  });

  it("draws one selected background per contiguous run and merges when bridged", async () => {
    const { container } = render(<Controlled initial={["a", "c"]} />);
    await waitFor(() => expect(selectedBlocks(container)).toBe(2));

    // Checking the row between the two runs merges them into one block.
    fireEvent.click(screen.getByRole("checkbox", { name: "Bravo" }));
    await waitFor(() => expect(selectedBlocks(container)).toBe(1), { timeout: 2000 });

    // Unchecking the middle row splits it back into two.
    fireEvent.click(screen.getByRole("checkbox", { name: "Bravo" }));
    await waitFor(() => expect(selectedBlocks(container)).toBe(2), { timeout: 2000 });

    fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Charlie" }));
    await waitFor(() => expect(selectedBlocks(container)).toBe(0), { timeout: 2000 });
  });

  it("does not toggle a disabled option", () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={[...options, { value: "e", label: "Echo", disabled: true }]}
        value={[]}
        onValueChange={onValueChange}
      />,
    );
    const echo = screen.getByRole("checkbox", { name: "Echo" });
    expect(echo).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(echo);
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("checkbox", { name: "Delta" }));
    expect(onValueChange).toHaveBeenCalledWith(["d"]);
  });
});
