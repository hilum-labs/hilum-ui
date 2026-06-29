import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Checkbox } from "../checkbox";
import { CheckboxCard } from "../checkbox-card";
import { CheckboxGroup } from "../checkbox-group";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Switch } from "../switch";
import { Slider, SliderComfortable, SliderControl } from "../slider";
import { InputNumber } from "../input-number";
import { InputGroup } from "../input-group";
import { Field } from "../field";
import { FileDropzone, formatFileSize } from "../file-dropzone";
import { DataTransferControls } from "../data-transfer-controls";
import { NativeSelect, NativeSelectOption } from "../native-select";
import { RadioCards } from "../radio-card";
import { Combobox } from "../combobox";
import { RichTextEditor } from "../rich-text-editor";

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

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

describe("CheckboxCard", () => {
  it("renders a labelled checkbox card", () => {
    render(<CheckboxCard label="Enable storefront filters" />);
    expect(screen.getByText("Enable storefront filters")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("toggles through the card surface", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<CheckboxCard label="Show vendor" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByText("Show vendor"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders optional description text", () => {
    render(<CheckboxCard label="Product schema" description="Expose product JSON-LD." />);
    expect(screen.getByText("Expose product JSON-LD.")).toBeInTheDocument();
  });
});

describe("CheckboxGroup", () => {
  it("renders options and toggles selected values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={FRUITS}
        value={["apple"]}
        onValueChange={onValueChange}
        aria-label="Fruit"
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Apple" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
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

  it("renders range mode with two thumbs", () => {
    render(<Slider defaultValue={[25, 75]} min={0} max={100} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders controlled value display and step pips", () => {
    render(<SliderControl label="Volume" value={40} onChange={() => undefined} showSteps />);
    expect(screen.getByText("Volume:")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "40");
  });

  it("renders controlled range value display", () => {
    render(<SliderControl label="Window" value={[25, 75]} onChange={() => undefined} />);
    expect(screen.getByText("25 - 75")).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders comfortable pips and scrubber variants", () => {
    const { rerender } = render(
      <SliderComfortable label="Roundness" value={2} min={0} max={5} onChange={() => undefined} />,
    );
    expect(screen.getByText("Roundness")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    rerender(
      <SliderComfortable
        label="Volume"
        value={50}
        variant="scrubber"
        formatValue={(value) => `${value}%`}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
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

  it("renders inset trailing actions", () => {
    const { container } = render(
      <InputGroup trailingAction={<button type="button">Submit</button>} />,
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(container.querySelector("input")).toHaveClass("pr-16");
    expect(screen.getByRole("button", { name: "Submit" }).parentElement).toHaveClass(
      "top-1/2",
      "-translate-y-1/2",
    );
  });

  it("renders error state", () => {
    const { container } = render(<InputGroup error />);
    // Error icon is rendered inside
    expect(container.querySelector("input")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* RichTextEditor                                                       */
/* ------------------------------------------------------------------ */

describe("RichTextEditor", () => {
  it("renders the formatting toolbar and editable textbox", () => {
    render(<RichTextEditor value="<p>Hello</p>" onChange={() => {}} />);

    expect(screen.getByRole("toolbar", { name: /text formatting/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /content editor/i })).toHaveTextContent("Hello");
    expect(screen.getByRole("button", { name: /bold/i })).toBeInTheDocument();
  });

  it("calls onChange with the editor html on input", () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="" onChange={onChange} />);

    const editor = screen.getByRole("textbox", { name: /content editor/i });
    editor.innerHTML = "<p>Draft</p>";
    fireEvent.input(editor);

    expect(onChange).toHaveBeenCalledWith("<p>Draft</p>");
  });

  it("syncs external value changes when the editor is not focused", () => {
    const { rerender } = render(<RichTextEditor value="<p>First</p>" onChange={() => {}} />);
    rerender(<RichTextEditor value="<p>Second</p>" onChange={() => {}} />);

    expect(screen.getByRole("textbox", { name: /content editor/i })).toHaveTextContent("Second");
  });

  it("opens the link input from the toolbar", () => {
    render(<RichTextEditor value="" onChange={() => {}} />);

    fireEvent.mouseDown(screen.getByRole("button", { name: /insert link/i }));

    expect(screen.getByRole("textbox", { name: /link url/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Insert" })).toBeInTheDocument();
  });

  it("uses a provided image url handler when inserting images", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <RichTextEditor
        value=""
        onChange={onChange}
        onRequestImageUrl={() => "https://cdn.example.com/image.png"}
      />,
    );

    const editor = screen.getByRole("textbox", { name: /content editor/i });
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    fireEvent.mouseDown(screen.getByRole("button", { name: /insert image/i }));

    await waitFor(() =>
      expect(container.querySelector("img")).toHaveAttribute(
        "src",
        "https://cdn.example.com/image.png",
      ),
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining("https://cdn.example.com/image.png"),
    );
  });
});

/* ------------------------------------------------------------------ */
/* FileDropzone                                                         */
/* ------------------------------------------------------------------ */

describe("FileDropzone", () => {
  it("renders label, description, and file input constraints", () => {
    render(
      <FileDropzone
        label="Upload assets"
        description="Images, documents, and videos"
        accept="image/*"
        multiple
      />,
    );

    expect(screen.getByRole("button", { name: /upload assets/i })).toBeInTheDocument();
    expect(screen.getByText("Images, documents, and videos")).toBeInTheDocument();
    expect(document.querySelector("input[type='file']")).toHaveAttribute("accept", "image/*");
    expect(document.querySelector("input[type='file']")).toHaveAttribute("multiple");
  });

  it("emits selected files from the input", () => {
    const onFilesSelected = vi.fn();
    render(<FileDropzone onFilesSelected={onFilesSelected} />);

    const file = new File(["hello"], "hello.csv", { type: "text/csv" });
    fireEvent.change(document.querySelector("input[type='file']")!, {
      target: { files: [file] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("emits dropped files", () => {
    const onFilesSelected = vi.fn();
    render(<FileDropzone onFilesSelected={onFilesSelected} />);

    const file = new File(["image"], "hero.png", { type: "image/png" });
    fireEvent.drop(screen.getByRole("button"), {
      dataTransfer: { files: [file] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("renders selected file summary", () => {
    render(<FileDropzone selectedFiles={[{ name: "catalog.csv", size: 2048 }]} />);

    expect(screen.getByText("catalog.csv (2.0 KB)")).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("renders loading state and disables selection", () => {
    const onFilesSelected = vi.fn();
    render(<FileDropzone loading loadingText="Importing..." onFilesSelected={onFilesSelected} />);

    expect(screen.getByText("Importing...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    fireEvent.change(document.querySelector("input[type='file']")!, {
      target: { files: [new File([""], "ignored.csv")] },
    });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("formats file sizes", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(1024 * 1024 * 12)).toBe("12 MB");
  });
});

/* ------------------------------------------------------------------ */
/* DataTransferControls                                                */
/* ------------------------------------------------------------------ */

describe("DataTransferControls", () => {
  const scopeOptions = [
    { value: "all", label: "All products" },
    { value: "active", label: "Active only" },
  ];

  it("renders scoped import and export actions", () => {
    const onScopeChange = vi.fn();
    const onImport = vi.fn();
    const onExport = vi.fn();

    render(
      <DataTransferControls
        scopeValue="all"
        onScopeChange={onScopeChange}
        scopeOptions={scopeOptions}
        actions={[
          { label: "Import products", shortLabel: "Import", onSelect: onImport },
          { label: "Export CSV", shortLabel: "CSV", onSelect: onExport },
        ]}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Scope" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import products" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeInTheDocument();
  });

  it("uses a mobile-friendly compact dropdown trigger", () => {
    render(
      <DataTransferControls
        compact
        scopeValue="all"
        onScopeChange={() => {}}
        scopeOptions={scopeOptions}
        actions={[
          { label: "Import products", onSelect: () => {} },
          { label: "Export CSV", onSelect: () => {} },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Import and export actions" })).toHaveClass("size-9");
  });

  it("disables loading actions and renders a spinner", () => {
    render(
      <DataTransferControls
        actions={[
          { label: "Import products", onSelect: () => {}, loading: true },
          { label: "Export CSV", onSelect: () => {} },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Import products" })).toBeDisabled();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
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

  it("error paragraph gets predictable id for aria-describedby wiring", () => {
    render(
      <Field label="Email" htmlFor="email" error="Invalid email">
        <input id="email" />
      </Field>,
    );
    const errorEl = screen.getByText("Invalid email");
    expect(errorEl).toHaveAttribute("id", "email-description");
  });

  it("hint paragraph gets the same predictable id", () => {
    render(
      <Field label="Bio" htmlFor="bio" hint="Max 160 chars">
        <input id="bio" />
      </Field>,
    );
    const hintEl = screen.getByText("Max 160 chars");
    expect(hintEl).toHaveAttribute("id", "bio-description");
  });

  it("error has role=alert for screen readers", () => {
    render(
      <Field label="Name" error="Required">
        <input />
      </Field>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
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

/* ------------------------------------------------------------------ */
/* Combobox                                                             */
/* ------------------------------------------------------------------ */

describe("Combobox", () => {
  it("renders a combobox input", () => {
    render(<Combobox options={FRUITS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows placeholder when no value selected", () => {
    render(<Combobox options={FRUITS} placeholder="Pick a fruit" />);
    expect(screen.getByPlaceholderText("Pick a fruit")).toBeInTheDocument();
  });

  it("opens listbox on focus", async () => {
    const user = userEvent.setup();
    render(<Combobox options={FRUITS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders a mobile bottom sheet backdrop when open", async () => {
    const user = userEvent.setup();
    render(<Combobox options={FRUITS} />);
    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("button", { name: "Close options" })).toHaveClass(
      "max-md:block",
      "backdrop-blur-sm",
    );
    expect(screen.getByRole("listbox").parentElement).toHaveClass(
      "max-md:fixed",
      "max-md:rounded-2xl",
    );
  });

  it("filters options by query", async () => {
    const user = userEvent.setup();
    render(<Combobox options={FRUITS} />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("ban");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /banana/i })).toBeInTheDocument();
  });

  it("calls onValueChange when option is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={FRUITS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("navigates with arrow keys and selects on Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={FRUITS} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("banana");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Combobox options={FRUITS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows empty text when no options match", async () => {
    const user = userEvent.setup();
    render(<Combobox options={FRUITS} emptyText="Nothing found." />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("zzz");
    expect(screen.getByText("Nothing found.")).toBeInTheDocument();
  });

  it("toggle button has an accessible label", () => {
    render(<Combobox options={FRUITS} />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });
});
