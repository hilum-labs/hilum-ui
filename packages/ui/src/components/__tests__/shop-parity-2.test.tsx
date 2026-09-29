import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Field } from "../field";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { NativeSelect } from "../native-select";
import { InputNumber } from "../input-number";

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

/* ------------------------------------------------------------------ */
/* Field label follows a control's own id                               */
/* ------------------------------------------------------------------ */

function labelFor(text: string) {
  return screen.getByText(text).closest("label");
}

describe("Field label and a control's own id", () => {
  it("links the label to controls that set their own id", () => {
    render(
      <React.StrictMode>
        <Field label="Email">
          <Input id="email" />
        </Field>
        <Field label="Bio">
          <Textarea id="bio" />
        </Field>
        <Field label="Plan">
          <Select value="pro" onValueChange={() => {}}>
            <SelectTrigger id="plan" />
            <SelectContent>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Country">
          <NativeSelect id="country">
            <option value="pe">Peru</option>
          </NativeSelect>
        </Field>
        <Field label="Quantity">
          <InputNumber id="quantity" value={1} onChange={() => {}} />
        </Field>
      </React.StrictMode>,
    );
    expect(labelFor("Email")).toHaveAttribute("for", "email");
    expect(labelFor("Bio")).toHaveAttribute("for", "bio");
    expect(labelFor("Plan")).toHaveAttribute("for", "plan");
    expect(labelFor("Country")).toHaveAttribute("for", "country");
    expect(labelFor("Quantity")).toHaveAttribute("for", "quantity");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("id", "email");
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveAttribute("id", "plan");
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveAttribute("id", "quantity");
  });

  it("follows the control that replaces the one that owned the label", async () => {
    function Swap({ ready }: { ready: boolean }) {
      return (
        <Field label="Name" hint="As shown on invoices">
          {ready ? null : <Input placeholder="Loading" readOnly />}
          {ready ? <Input id="name" /> : null}
        </Field>
      );
    }
    const { rerender } = render(<Swap ready={false} />);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("placeholder", "Loading");
    rerender(<Swap ready />);
    await tick();
    expect(labelFor("Name")).toHaveAttribute("for", "name");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
      "As shown on invoices",
    );
  });

  it("follows a control whose id changes and a Select that replaces an Input", async () => {
    function Editable({ editing, id }: { editing: boolean; id: string }) {
      return (
        <Field label="Status">
          {editing ? (
            <Select value="active" onValueChange={() => {}}>
              <SelectTrigger id={`${id}-select`} />
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input id={id} readOnly value="Active" />
          )}
        </Field>
      );
    }
    const { rerender } = render(<Editable editing={false} id="status" />);
    expect(labelFor("Status")).toHaveAttribute("for", "status");
    rerender(<Editable editing={false} id="state" />);
    expect(labelFor("Status")).toHaveAttribute("for", "state");
    rerender(<Editable editing id="state" />);
    await tick();
    expect(labelFor("Status")).toHaveAttribute("for", "state-select");
    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
  });

  it("keeps the first control as the label target when several are mounted", () => {
    render(
      <Field label="Price range">
        <Input placeholder="Min" />
        <Input id="max" placeholder="Max" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Price range" })).toHaveAttribute(
      "placeholder",
      "Min",
    );
    expect(screen.getByPlaceholderText("Max")).toHaveAttribute("id", "max");
  });

  it("an explicit htmlFor still wins", () => {
    render(
      <Field label="Handle" htmlFor="handle">
        <Input id="handle" />
      </Field>,
    );
    expect(labelFor("Handle")).toHaveAttribute("for", "handle");
    expect(labelFor("Handle")).toHaveAttribute("id", "handle-label");
  });
});
