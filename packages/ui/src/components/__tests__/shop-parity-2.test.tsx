import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

/* ------------------------------------------------------------------ */
/* Select inside a <form>                                               */
/* ------------------------------------------------------------------ */

describe("Select inside a form", () => {
  function Brand({
    value,
    options,
    onValueChange,
    name,
  }: {
    value: string;
    options: string[];
    onValueChange: (value: string) => void;
    name?: string;
  }) {
    return (
      <form aria-label="Product">
        <Select value={value} onValueChange={onValueChange} {...(name ? { name } : {})}>
          <SelectTrigger aria-label="Brand" />
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    );
  }

  it("does not emit an empty value when the controlled value changes after mount", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Brand value="" options={[]} onValueChange={onValueChange} />);
    // Data loads: the value and its options arrive together.
    rerender(<Brand value="acme" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    rerender(<Brand value="globex" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    // A value whose option isn't loaded yet.
    rerender(<Brand value="initech" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(screen.getByRole("combobox", { name: "Brand" })).toHaveTextContent("");
  });

  it("still reports values chosen through the native select (autofill)", async () => {
    const onValueChange = vi.fn();
    render(
      <Brand
        value="acme"
        name="brand"
        options={["acme", "globex"]}
        onValueChange={onValueChange}
      />,
    );
    await tick();
    const native = document.querySelector("select[name=brand]") as HTMLSelectElement;
    fireEvent.change(native, { target: { value: "globex" } });
    expect(onValueChange).toHaveBeenCalledWith("globex");
  });

  it("works uncontrolled", async () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Plan">
        <Select defaultValue="pro" onValueChange={onValueChange}>
          <SelectTrigger aria-label="Plan" />
          <SelectContent>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </form>,
    );
    await tick();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveTextContent("Pro");
  });
});
