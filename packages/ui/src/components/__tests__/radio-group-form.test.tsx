import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { RadioCards } from "../radio-card";

function formValue(form: HTMLFormElement, name: string) {
  return new FormData(form).get(name);
}

describe("RadioGroup native form participation", () => {
  it("submits the selected value under `name`", () => {
    render(
      <form data-testid="form">
        <RadioGroup name="plan" defaultValue="pro" aria-label="Plan">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(formValue(form, "plan")).toBe("pro");
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(formValue(form, "plan")).toBe("free");
  });

  it("submits nothing while no item is selected", () => {
    render(
      <form data-testid="form">
        <RadioGroup name="plan" defaultValue="" aria-label="Plan">
          <RadioGroupItem value="free" label="Free" />
        </RadioGroup>
      </form>,
    );
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).has("plan")).toBe(false);
  });

  it("does not add extra radios to the accessibility tree", () => {
    render(
      <RadioGroup name="plan" required defaultValue="free" aria-label="Plan">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio", { hidden: true })).toHaveLength(2);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
  });

  it("is invalid when required and nothing is selected", () => {
    render(
      <form data-testid="form">
        <RadioGroup name="plan" required aria-label="Plan" defaultValue="">
          <RadioGroupItem value="free" label="Free" />
        </RadioGroup>
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(form.checkValidity()).toBe(true);
  });

  it("associates with a form by id via `form`", () => {
    render(
      <>
        <form id="outside" data-testid="form" />
        <RadioGroup name="size" form="outside" defaultValue="m" aria-label="Size">
          <RadioGroupItem value="m" label="M" />
        </RadioGroup>
      </>,
    );
    expect(formValue(screen.getByTestId("form") as HTMLFormElement, "size")).toBe("m");
  });

  it("restores the default value on form reset", () => {
    render(
      <form data-testid="form">
        <RadioGroup name="plan" defaultValue="free" aria-label="Plan">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    fireEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    act(() => {
      form.dispatchEvent(new Event("reset"));
    });
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
  });

  it("group `disabled` blocks selection, focus and submission", () => {
    const onValueChange = vi.fn();
    render(
      <form data-testid="form">
        <RadioGroup
          name="plan"
          disabled
          defaultValue="free"
          onValueChange={onValueChange}
          aria-label="Plan"
        >
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </form>,
    );
    const pro = screen.getByRole("radio", { name: "Pro" });
    fireEvent.click(pro);
    fireEvent.keyDown(pro, { key: " " });
    expect(onValueChange).not.toHaveBeenCalled();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("tabindex", "-1");
      expect(radio).toHaveAttribute("aria-disabled", "true");
    }
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).has("plan")).toBe(false);
  });

  it("forwards ref to the radiogroup element (ref as prop)", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} aria-label="Plan">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBe(screen.getByRole("radiogroup"));
    expect(ref.current).toHaveAttribute("data-slot", "radio-group");
  });
});

describe("RadioGroup roving tabindex and arrow keys", () => {
  it("makes the first item tabbable when nothing is selected", () => {
    render(
      <RadioGroup aria-label="Plan" defaultValue="">
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("tabindex", "-1");
  });

  it("skips disabled items with arrow keys and for the tab stop", () => {
    render(
      <RadioGroup aria-label="Plan" defaultValue="">
        <RadioGroupItem value="a" label="A" disabled />
        <RadioGroupItem value="b" label="B" />
        <RadioGroupItem value="c" label="C" disabled />
        <RadioGroupItem value="d" label="D" />
      </RadioGroup>,
    );
    const b = screen.getByRole("radio", { name: "B" });
    const d = screen.getByRole("radio", { name: "D" });
    expect(b).toHaveAttribute("tabindex", "0");
    act(() => b.focus());
    fireEvent.keyDown(b, { key: "ArrowDown" });
    expect(d).toBeChecked();
    expect(document.activeElement).toBe(d);
    fireEvent.keyDown(d, { key: "ArrowDown" }); // wraps past disabled A
    expect(b).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "C" }));
    expect(b).toBeChecked();
  });

  it("flips horizontal arrows in RTL", () => {
    render(
      <RadioGroup aria-label="Plan" defaultValue="a" dir="rtl">
        <RadioGroupItem value="a" label="A" />
        <RadioGroupItem value="b" label="B" />
        <RadioGroupItem value="c" label="C" />
      </RadioGroup>,
    );
    const a = screen.getByRole("radio", { name: "A" });
    act(() => a.focus());
    fireEvent.keyDown(a, { key: "ArrowLeft" });
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    fireEvent.keyDown(screen.getByRole("radio", { name: "B" }), { key: "ArrowRight" });
    expect(a).toBeChecked();
    // Vertical arrows are direction-independent.
    fireEvent.keyDown(a, { key: "ArrowDown" });
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
  });

  it("inherits RTL from an ancestor dir attribute", () => {
    render(
      <div dir="rtl">
        <RadioGroup aria-label="Plan" defaultValue="a">
          <RadioGroupItem value="a" label="A" />
          <RadioGroupItem value="b" label="B" />
        </RadioGroup>
      </div>,
    );
    const a = screen.getByRole("radio", { name: "A" });
    act(() => a.focus());
    fireEvent.keyDown(a, { key: "ArrowRight" }); // backwards in RTL, wraps to last
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    fireEvent.keyDown(screen.getByRole("radio", { name: "B" }), { key: "ArrowLeft" });
    expect(a).toBeChecked();
  });
});

describe("RadioCards", () => {
  const options = [
    { value: "a", label: "A" },
    { value: "b", label: "B", disabled: true },
    { value: "c", label: "C" },
  ];

  it("is a radiogroup with a roving tab stop and arrow-key selection", () => {
    const onValueChange = vi.fn();
    render(
      <RadioCards options={options} value="a" onValueChange={onValueChange} aria-label="Plan" />,
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    const a = screen.getByRole("radio", { name: "A" });
    expect(a).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "C" })).toHaveAttribute("tabindex", "-1");
    act(() => a.focus());
    fireEvent.keyDown(a, { key: "ArrowRight" }); // skips disabled B
    expect(onValueChange).toHaveBeenLastCalledWith("c");
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "C" }));
  });
});
