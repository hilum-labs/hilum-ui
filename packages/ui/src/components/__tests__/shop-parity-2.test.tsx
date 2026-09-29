import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Field } from "../field";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { NativeSelect } from "../native-select";
import { InputNumber } from "../input-number";
import { Switch } from "../switch";
import { Checkbox } from "../checkbox";
import { CheckboxCard } from "../checkbox-card";
import { Combobox } from "../combobox";
import { DatePicker, DateRangePicker } from "../date-picker";
import { DateTimePicker } from "../date-time-picker";
import { TimePicker } from "../time-picker";
import { ColorInput } from "../color-input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";

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

/* ------------------------------------------------------------------ */
/* Field auto-wiring for more controls                                  */
/* ------------------------------------------------------------------ */

describe("Field wires more controls", () => {
  it("Switch and Checkbox take the label, hint, error, required and disabled state", () => {
    render(
      <>
        <Field label="Charge tax" hint="Applies to this product" required>
          <Switch />
        </Field>
        <Field label="Accept the terms" error="Accept to continue" disabled>
          <Checkbox />
        </Field>
      </>,
    );
    const toggle = screen.getByRole("switch", { name: "Charge tax" });
    expect(toggle).toHaveAccessibleDescription("Applies to this product");
    expect(toggle).toHaveAttribute("aria-required", "true");
    expect(toggle).not.toBeDisabled();
    const box = screen.getByRole("checkbox", { name: "Accept the terms" });
    expect(box).toHaveAccessibleDescription("Accept to continue");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toBeDisabled();
  });

  it("a Switch's own label and id win", () => {
    render(
      <Field label="Notifications">
        <Switch id="email-me" label="Email me" />
      </Field>,
    );
    const toggle = screen.getByRole("switch", { name: "Email me" });
    expect(toggle).toHaveAttribute("id", "email-me");
    expect(labelFor("Notifications")).toHaveAttribute("for", "email-me");
  });

  it("CheckboxCard keeps its own label inside a Field", () => {
    render(
      <Field label="Channels">
        <CheckboxCard label="Online store" />
      </Field>,
    );
    expect(screen.getByRole("checkbox", { name: "Online store" })).toBeInTheDocument();
  });

  it("Combobox takes the field wiring", () => {
    render(
      <Field label="Vendor" error="Pick a vendor" required>
        <Combobox options={[{ value: "acme", label: "Acme" }]} />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Vendor" });
    expect(input).toHaveAccessibleDescription("Pick a vendor");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("DatePicker and DateRangePicker triggers take the field wiring", () => {
    render(
      <>
        <Field label="Publish date" hint="Store time zone" disabled>
          <DatePicker />
        </Field>
        <Field label="Report range" error="Pick a range">
          <DateRangePicker presets={[]} />
        </Field>
      </>,
    );
    const date = screen.getByRole("button", { name: "Publish date" });
    expect(date).toHaveAccessibleDescription("Store time zone");
    expect(date).toBeDisabled();
    expect(date).not.toHaveAttribute("aria-required");
    const range = screen.getByRole("button", { name: "Report range" });
    expect(range).toHaveAttribute("aria-invalid", "true");
    expect(range).toHaveAccessibleDescription("Pick a range");
  });

  it("TimePicker, DateTimePicker and ColorInput are groups named by the label", () => {
    render(
      <>
        <Field label="Opens at" hint="Local time" required>
          <TimePicker />
        </Field>
        <Field label="Starts" error="Pick a start" disabled>
          <DateTimePicker />
        </Field>
        <Field label="Brand colour" error="Use a hex colour">
          <ColorInput value="#c100f1" onChange={() => {}} />
        </Field>
      </>,
    );
    const time = screen.getByRole("group", { name: "Opens at" });
    expect(time).toHaveAccessibleDescription("Local time");
    expect(labelFor("Opens at")).not.toHaveAttribute("for");
    expect(screen.getAllByRole("spinbutton", { name: "Hour" })[0]).toHaveAttribute(
      "aria-required",
      "true",
    );

    const starts = screen.getByRole("group", { name: "Starts" });
    expect(starts).toHaveAccessibleDescription("Pick a start");
    const dateHalf = screen.getByRole("button", { name: "Date" });
    expect(dateHalf).toHaveAttribute("aria-invalid", "true");
    expect(dateHalf).toBeDisabled();
    expect(dateHalf).toHaveAccessibleDescription("Pick a start");

    const colour = screen.getByRole("group", { name: "Brand colour" });
    expect(colour).toHaveAttribute("data-invalid");
    const hex = screen.getByRole("textbox", { name: "Hex colour" });
    expect(hex).toHaveAttribute("aria-invalid", "true");
    expect(hex).toHaveAccessibleDescription("Use a hex colour");
  });

  it("InputOTP takes the field wiring", () => {
    render(
      <Field label="Verification code" error="Code expired">
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Code expired");
  });
});
