/**
 * Accessibility smoke tests for the second Hilum Shop parity release: Field
 * auto-wiring for every form control, and the components added for it.
 * Same approach as ui.a11y.test.tsx: realistic, labelled usage checked with
 * axe-core.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "../axe";

import { Field } from "../../packages/ui/src/components/field";
import { Switch } from "../../packages/ui/src/components/switch";
import { Checkbox } from "../../packages/ui/src/components/checkbox";
import { Combobox } from "../../packages/ui/src/components/combobox";
import { DatePicker, DateRangePicker } from "../../packages/ui/src/components/date-picker";
import { DateTimePicker } from "../../packages/ui/src/components/date-time-picker";
import { TimePicker } from "../../packages/ui/src/components/time-picker";
import { ColorInput } from "../../packages/ui/src/components/color-input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../packages/ui/src/components/input-otp";

async function expectAccessible(ui: React.ReactElement) {
  render(ui);
  expect(await axe(document.body)).toHaveNoAxeViolations();
}

describe("a11y: shop parity 2", () => {
  it("Field-wired controls with hints, errors and required", async () => {
    await expectAccessible(
      <form aria-label="Product settings">
        <Field label="Charge tax" hint="Applies to this product" required>
          <Switch />
        </Field>
        <Field label="Accept the terms" error="Accept to continue">
          <Checkbox />
        </Field>
        <Field label="Vendor" error="Pick a vendor" required>
          <Combobox options={[{ value: "acme", label: "Acme" }]} />
        </Field>
        <Field label="Publish date" hint="Store time zone" required>
          <DatePicker />
        </Field>
        <Field label="Report range">
          <DateRangePicker presets={[]} />
        </Field>
        <Field label="Opens at" hint="Local time" required>
          <TimePicker />
        </Field>
        <Field label="Starts" error="Pick a start" required>
          <DateTimePicker />
        </Field>
        <Field label="Brand colour" error="Use a hex colour" required>
          <ColorInput value="#c100f1" onChange={() => {}} />
        </Field>
        <Field label="Verification code" error="Code expired">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
      </form>,
    );
  });
});
