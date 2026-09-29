import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import {
  Checkbox,
  ColorInput,
  Combobox,
  DatePicker,
  Field,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Switch,
  Input,
  InputNumber,
  NativeSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
  TimePicker,
} from "@hilum/ui";

/** Resolve a CSS colour expression to its computed rgb() string. */
function resolveColor(value: string) {
  const probe = document.createElement("div");
  probe.style.color = value;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

function borderColor(el: Element) {
  return getComputedStyle(el).borderTopColor;
}

/* ------------------------------------------------------------------ */
/* Field error state                                                    */
/* ------------------------------------------------------------------ */

describe("Field error border (real browser)", () => {
  function ErrorFields() {
    return (
      <div className="flex w-96 flex-col gap-4 p-4">
        <Field label="Email" error="Enter an email">
          <Input />
        </Field>
        <Field label="Bio" error="Too short">
          <Textarea />
        </Field>
        <Field label="Plan" error="Pick a plan">
          <Select>
            <SelectTrigger />
            <SelectContent>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Country" error="Pick a country">
          <NativeSelect>
            <option value="pe">Peru</option>
          </NativeSelect>
        </Field>
        <Field label="Quantity" error="Too many">
          <InputNumber value={3} onChange={() => {}} />
        </Field>
        <Field label="Opens at" error="Pick a time">
          <TimePicker />
        </Field>
        <Field label="Name">
          <Input />
        </Field>
      </div>
    );
  }

  it("turns the border of every wired control destructive", () => {
    render(<ErrorFields />);
    const destructive = resolveColor("var(--destructive)");
    const targets: Element[] = [
      screen.getByRole("textbox", { name: "Email" }),
      screen.getByRole("textbox", { name: "Bio" }),
      screen.getByRole("combobox", { name: "Plan" }),
      screen.getByRole("combobox", { name: "Country" }),
      screen.getByRole("spinbutton", { name: "Quantity" }).closest("[data-slot=input-number]")!,
      document.querySelector("[data-slot=time-picker]")!,
    ];
    for (const target of targets) expect(borderColor(target)).toBe(destructive);
    expect(borderColor(screen.getByRole("textbox", { name: "Name" }))).not.toBe(destructive);
  });

  it("keeps a visible focus ring on an invalid control", async () => {
    render(<ErrorFields />);
    const destructive = resolveColor("var(--destructive)");
    const email = screen.getByRole("textbox", { name: "Email" });
    await userEvent.click(email);
    expect(email).toHaveFocus();
    expect(borderColor(email)).toBe(destructive);
    expect(getComputedStyle(email).boxShadow).not.toBe("none");
  });
});

describe("Field error border on the newly wired controls (real browser)", () => {
  it("Combobox, DatePicker, ColorInput, InputOTP, Checkbox and Switch show the error", () => {
    render(
      <div className="flex w-96 flex-col gap-4 p-4">
        <Field label="Vendor" error="Pick a vendor">
          <Combobox options={[{ value: "acme", label: "Acme" }]} />
        </Field>
        <Field label="Publish date" error="Pick a date">
          <DatePicker />
        </Field>
        <Field label="Brand colour" error="Use a hex colour">
          <ColorInput value="#c100f1" onChange={() => {}} />
        </Field>
        <Field label="Code" error="Expired">
          <InputOTP maxLength={2}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Field label="Accept the terms" error="Required">
          <Checkbox />
        </Field>
        <Field label="Charge tax" error="Required">
          <Switch />
        </Field>
      </div>,
    );
    const destructive = resolveColor("var(--destructive)");
    expect(borderColor(screen.getByRole("combobox", { name: "Vendor" }))).toBe(destructive);
    expect(borderColor(screen.getByRole("button", { name: "Publish date" }))).toBe(destructive);
    expect(borderColor(screen.getByRole("group", { name: "Brand colour" }))).toBe(destructive);
    const slot = document.querySelector("[data-slot=input-otp-slot]")!;
    expect(borderColor(slot)).toBe(destructive);
    expect(borderColor(screen.getByRole("checkbox", { name: "Accept the terms" }))).toBe(
      destructive,
    );
    const toggle = screen.getByRole("switch", { name: "Charge tax" });
    expect(getComputedStyle(toggle).outlineColor).toBe(destructive);
    expect(getComputedStyle(toggle).outlineStyle).toBe("solid");
  });
});
