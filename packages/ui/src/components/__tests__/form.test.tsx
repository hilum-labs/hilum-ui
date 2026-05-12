import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Checkbox } from "../checkbox";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Switch } from "../switch";
import { Slider } from "../slider";
import { InputNumber } from "../input-number";
import { InputGroup } from "../input-group";
import { Field } from "../field";
import { NativeSelect, NativeSelectOption } from "../native-select";
import { RadioCards } from "../radio-card";

/* ------------------------------------------------------------------ */
/* Checkbox                                                             */
/* ------------------------------------------------------------------ */

describe("Checkbox", () => {
  it("renders a checkbox button", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/* RadioGroup                                                           */
/* ------------------------------------------------------------------ */

describe("RadioGroup", () => {
  it("renders radio buttons", () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" id="a" />
        <RadioGroupItem value="b" id="b" />
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("marks default value as checked", () => {
    render(
      <RadioGroup defaultValue="first">
        <RadioGroupItem value="first" id="first" />
        <RadioGroupItem value="second" id="second" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/* Switch                                                               */
/* ------------------------------------------------------------------ */

describe("Switch", () => {
  it("renders a switch button", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("is off by default", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const sw = screen.getByRole("switch");
    await user.click(sw);
    expect(sw).toHaveAttribute("data-state", "checked");
  });
});

/* ------------------------------------------------------------------ */
/* Slider                                                               */
/* ------------------------------------------------------------------ */

describe("Slider", () => {
  it("renders a slider", () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("shows the provided value", () => {
    render(<Slider defaultValue={[25]} min={0} max={100} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "25");
  });
});

/* ------------------------------------------------------------------ */
/* InputNumber                                                          */
/* ------------------------------------------------------------------ */

describe("InputNumber", () => {
  it("renders an input with the given value", () => {
    render(<InputNumber value={42} onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("42");
  });

  it("displays unit suffix", () => {
    render(<InputNumber value={100} onChange={() => {}} unit="px" />);
    expect(screen.getByText("px")).toBeInTheDocument();
  });

  it("calls onChange with incremented value when increment button clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputNumber value={10} onChange={onChange} step={1} />);
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it("calls onChange with decremented value when decrement button clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputNumber value={10} onChange={onChange} step={1} />);
    await user.click(screen.getByRole("button", { name: /decrement/i }));
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("clamps to max on increment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputNumber value={10} onChange={onChange} max={10} />);
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it("hides steppers when hideSteppers is true", () => {
    render(<InputNumber value={5} onChange={() => {}} hideSteppers />);
    expect(screen.queryByRole("button", { name: /increment/i })).not.toBeInTheDocument();
  });

  it("renders with precision", () => {
    render(<InputNumber value={3.14} onChange={() => {}} precision={2} />);
    expect(screen.getByRole("textbox")).toHaveValue("3.14");
  });
});

/* ------------------------------------------------------------------ */
/* InputGroup                                                           */
/* ------------------------------------------------------------------ */

describe("InputGroup", () => {
  it("renders a plain input when no addons", () => {
    render(<InputGroup placeholder="Enter text" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders leading addon text", () => {
    render(<InputGroup leadingAddon="https://" placeholder="domain.com" />);
    expect(screen.getByText("https://")).toBeInTheDocument();
  });

  it("renders trailing addon text", () => {
    render(<InputGroup trailingAddon=".com" placeholder="domain" />);
    expect(screen.getByText(".com")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const { container } = render(<InputGroup error />);
    // Error icon is rendered inside
    expect(container.querySelector("input")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Field                                                                */
/* ------------------------------------------------------------------ */

describe("Field", () => {
  it("renders label and children", () => {
    render(
      <Field label="Email" htmlFor="email">
        <input id="email" type="email" />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders hint text", () => {
    render(
      <Field label="Username" hint="Must be unique">
        <input />
      </Field>,
    );
    expect(screen.getByText("Must be unique")).toBeInTheDocument();
  });

  it("renders error over hint when both provided", () => {
    render(
      <Field label="Field" hint="Hint" error="This is required">
        <input />
      </Field>,
    );
    expect(screen.getByText("This is required")).toBeInTheDocument();
    expect(screen.queryByText("Hint")).not.toBeInTheDocument();
  });

  it("renders required asterisk", () => {
    const { container } = render(
      <Field label="Name" required>
        <input />
      </Field>,
    );
    expect(container.querySelector("span")).toHaveTextContent("*");
  });

  it("renders cornerHint", () => {
    render(
      <Field label="Password" cornerHint="Optional">
        <input />
      </Field>,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* NativeSelect                                                         */
/* ------------------------------------------------------------------ */

describe("NativeSelect", () => {
  it("renders a combobox", () => {
    render(
      <NativeSelect>
        <NativeSelectOption value="a">Option A</NativeSelectOption>
        <NativeSelectOption value="b">Option B</NativeSelectOption>
      </NativeSelect>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(
      <NativeSelect disabled>
        <NativeSelectOption value="x">X</NativeSelectOption>
      </NativeSelect>,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/* RadioCards                                                           */
/* ------------------------------------------------------------------ */

describe("RadioCards", () => {
  const options = [
    { value: "plan-a", label: "Basic" },
    { value: "plan-b", label: "Pro" },
    { value: "plan-c", label: "Enterprise" },
  ];

  it("renders all option labels", () => {
    render(<RadioCards options={options} />);
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("marks the selected option as checked", () => {
    render(<RadioCards options={options} value="plan-b" />);
    const proBtn = screen.getByRole("radio", { name: "Pro" });
    expect(proBtn).toHaveAttribute("aria-checked", "true");
  });

  it("calls onValueChange when an option is clicked", () => {
    const onValueChange = vi.fn();
    render(<RadioCards options={options} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Enterprise" }));
    expect(onValueChange).toHaveBeenCalledWith("plan-c");
  });

  it("does not call onValueChange for disabled options", () => {
    const onValueChange = vi.fn();
    const opts = [{ value: "x", label: "Disabled", disabled: true }];
    render(<RadioCards options={opts} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Disabled" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
