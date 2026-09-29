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
  MultiCombobox,
  Switch,
  TagInput,
  Input,
  InputNumber,
  NativeSelect,
  Steps,
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

describe("TagInput and MultiCombobox fields (real browser)", () => {
  it("are 36px tall like other controls, with or without chips, and show the error border", () => {
    render(
      <div className="flex w-96 flex-col gap-4 p-4">
        <TagInput aria-label="Empty tags" />
        <TagInput aria-label="Tags" defaultValue={["summer", "sale"]} />
        <MultiCombobox aria-label="Empty" options={[{ value: "a", label: "Apple" }]} />
        <Field label="Fruits" error="Pick one">
          <MultiCombobox options={[{ value: "a", label: "Apple" }]} defaultValue={["a"]} />
        </Field>
        <Input aria-label="Reference" />
      </div>,
    );
    const reference = screen.getByRole("textbox", { name: "Reference" }).getBoundingClientRect();
    const fields = [
      screen.getByRole("textbox", { name: "Empty tags" }),
      screen.getByRole("textbox", { name: "Tags" }),
      screen.getByRole("combobox", { name: "Empty" }),
      screen.getByRole("combobox", { name: "Fruits" }),
    ].map((input) => input.parentElement!);
    for (const field of fields) {
      expect(field.getBoundingClientRect().height).toBeCloseTo(reference.height, 0);
    }
    expect(borderColor(fields[3]!)).toBe(resolveColor("var(--destructive)"));
  });
});

describe("Steps with long labels (real browser)", () => {
  const steps = [
    { name: "Store details", status: "complete" as const },
    { name: "Add your first product with photos and variants", status: "complete" as const },
    { name: "Payments", status: "current" as const },
    { name: "Shipping zones and delivery rates", status: "upcoming" as const },
    { name: "Taxes", status: "upcoming" as const },
    { name: "Connect a custom domain name", status: "upcoming" as const },
    { name: "Launch", status: "upcoming" as const },
  ];

  test.each([720, 360])("circles stay aligned with 7 steps at %ipx", (width) => {
    const { container } = render(
      <div style={{ width }}>
        <Steps steps={steps} />
      </div>,
    );
    const circles = [...container.querySelectorAll("[data-slot=steps-circle]")].map((el) =>
      el.getBoundingClientRect(),
    );
    expect(circles).toHaveLength(7);
    const top = circles[0]!.top;
    for (const circle of circles) expect(circle.top).toBeCloseTo(top, 0);
    // Evenly spaced centres.
    const centres = circles.map((c) => c.left + c.width / 2);
    const gap = centres[1]! - centres[0]!;
    for (let i = 1; i < centres.length; i++) {
      expect(centres[i]! - centres[i - 1]!).toBeCloseTo(gap, 0);
    }
    // Each connector sits on the circles' centre line, between two circles.
    const connectors = [...container.querySelectorAll("[data-slot=steps-connector]")].map((el) =>
      el.getBoundingClientRect(),
    );
    connectors.forEach((line, i) => {
      expect(line.top + line.height / 2).toBeCloseTo(top + circles[i]!.height / 2, 0);
      expect(line.left).toBeGreaterThanOrEqual(circles[i]!.right - 1);
      expect(line.right).toBeLessThanOrEqual(circles[i + 1]!.left + 1);
      expect(line.width).toBeGreaterThan(0);
    });
    // Labels wrap within their column instead of overflowing into the next one.
    const items = [...container.querySelectorAll("[data-slot=steps-item]")];
    items.forEach((item) => {
      const box = item.getBoundingClientRect();
      const label = item.querySelector("a span:last-child")!.getBoundingClientRect();
      expect(label.left).toBeGreaterThanOrEqual(box.left - 1);
      expect(label.right).toBeLessThanOrEqual(box.right + 1);
    });
  });

  it("bullets show upcoming dots", () => {
    const { container } = render(<Steps steps={steps} variant="bullets" />);
    const upcoming = container.querySelector("[data-status=upcoming] [data-slot=steps-dot]")!;
    const style = getComputedStyle(upcoming);
    expect(upcoming.getBoundingClientRect().width).toBeGreaterThan(8);
    expect(style.borderTopColor).toBe(resolveColor("var(--muted-foreground)"));
    expect(style.borderTopWidth).not.toBe("0px");
  });
});
