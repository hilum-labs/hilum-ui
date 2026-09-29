import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tag, TagInput, TAG_INPUT_DEFAULT_LABELS } from "../tag-input";
import { Field } from "../field";

function Controlled({
  initial = [],
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof TagInput>, "value" | "onChange"> & {
  initial?: string[];
  onChange?: (tags: string[]) => void;
}) {
  const [tags, setTags] = React.useState(initial);
  return (
    <TagInput
      aria-label="Tags"
      {...props}
      value={tags}
      onChange={(next) => {
        setTags(next);
        onChange?.(next);
      }}
    />
  );
}

function tagTexts() {
  return Array.from(document.querySelectorAll("[data-slot=tag]")).map((tag) => tag.textContent);
}

describe("Tag", () => {
  it("renders a removable chip", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Summer</Tag>);
    fireEvent.click(screen.getByRole("button", { name: "Remove Summer" }));
    expect(onRemove).toHaveBeenCalled();
  });

  it("hides the remove button when disabled", () => {
    render(
      <Tag onRemove={() => {}} disabled>
        Summer
      </Tag>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("TagInput", () => {
  it("adds a tag on Enter and on comma, trimmed", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "  summer " } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "sale," } });
    expect(tagTexts()).toEqual(["summer", "sale"]);
    expect(input).toHaveValue("");
    expect(onChange).toHaveBeenLastCalledWith(["summer", "sale"]);
  });

  it("keeps the text after a separator as the draft", () => {
    render(<Controlled />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "red,blu" } });
    expect(tagTexts()).toEqual(["red"]);
    expect(input).toHaveValue("blu");
  });

  it("removes the last tag with Backspace on an empty field, and with the × button", () => {
    render(<Controlled initial={["a", "b", "c"]} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(tagTexts()).toEqual(["a", "b"]);
    fireEvent.click(screen.getByRole("button", { name: "Remove a" }));
    expect(tagTexts()).toEqual(["b"]);
    expect(screen.getByRole("status")).toHaveTextContent("a removed");
  });

  it("does not remove a tag with Backspace while typing", () => {
    render(<Controlled initial={["a"]} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "x" } });
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(tagTexts()).toEqual(["a"]);
  });

  it("splits pasted text on commas and new lines and drops duplicates", () => {
    render(<Controlled initial={["Sale"]} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.paste(input, {
      clipboardData: { getData: () => "sale, New, summer\nnew\n\nwinter" },
    });
    expect(tagTexts()).toEqual(["Sale", "New", "summer", "winter"]);
    expect(screen.getByRole("status")).toHaveTextContent("3 tags added");
  });

  it("keeps case-different tags when caseSensitive", () => {
    render(<Controlled initial={["Sale"]} caseSensitive />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "sale," } });
    expect(tagTexts()).toEqual(["Sale", "sale"]);
  });

  it("applies maxLength, normalize and custom separators", () => {
    render(<Controlled maxLength={5} normalize={(tag) => tag.toLowerCase()} separators={[";"]} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    expect(input).toHaveAttribute("maxlength", "5");
    fireEvent.paste(input, { clipboardData: { getData: () => "Accessories;BAGS" } });
    expect(tagTexts()).toEqual(["acces", "bags"]);
    fireEvent.change(input, { target: { value: "a,b" } });
    expect(input).toHaveValue("a,b");
  });

  it("stops at maxTags and announces the limit", () => {
    render(<Controlled initial={["a"]} maxTags={2} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.paste(input, { clipboardData: { getData: () => "b,c,d" } });
    expect(tagTexts()).toEqual(["a", "b"]);
    expect(screen.getByRole("status")).toHaveTextContent(TAG_INPUT_DEFAULT_LABELS.limitReached(2));
  });

  it("adds the draft on blur unless addOnBlur is false", () => {
    const { unmount } = render(<Controlled />);
    let input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "draft" } });
    fireEvent.blur(input);
    expect(tagTexts()).toEqual(["draft"]);
    unmount();
    render(<Controlled addOnBlur={false} />);
    input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(input, { target: { value: "draft" } });
    fireEvent.blur(input);
    expect(tagTexts()).toEqual([]);
  });

  it("offers suggestions: filtered, keyboard and pointer selection", () => {
    const onInputChange = vi.fn();
    render(
      <Controlled
        initial={["summer"]}
        suggestions={["summer", "sale", "salt", "winter"]}
        onInputChange={onInputChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "Tags" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "sa" } });
    expect(onInputChange).toHaveBeenLastCalledWith("sa");
    const listbox = screen.getByRole("listbox", { name: "Suggestions" });
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(Array.from(listbox.querySelectorAll("[role=option]")).map((o) => o.textContent)).toEqual(
      ["sale", "salt"],
    );
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", expect.stringContaining("option-1"));
    fireEvent.keyDown(input, { key: "Enter" });
    expect(tagTexts()).toEqual(["summer", "salt"]);
    fireEvent.change(input, { target: { value: "w" } });
    fireEvent.click(screen.getByRole("option", { name: "winter" }));
    expect(tagTexts()).toEqual(["summer", "salt", "winter"]);
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("posts every tag as a hidden input", () => {
    const { container } = render(
      <TagInput aria-label="Tags" name="tags" defaultValue={["a", "b"]} />,
    );
    const hidden = container.querySelectorAll("input[type=hidden][name=tags]");
    expect(Array.from(hidden).map((input) => (input as HTMLInputElement).value)).toEqual([
      "a",
      "b",
    ]);
  });

  it("is wired by Field and honours disabled", () => {
    render(
      <Field label="Tags" hint="Separate with commas" error="Add a tag" disabled>
        <TagInput defaultValue={["a"]} />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });
    expect(input).toHaveAccessibleDescription("Add a tag");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove a" })).not.toBeInTheDocument();
    expect(input.closest("[data-invalid]")).not.toBeNull();
  });

  it("focuses the text input when the field padding is clicked", () => {
    render(<TagInput aria-label="Tags" defaultValue={["a"]} />);
    const input = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.click(input.parentElement!);
    expect(input).toHaveFocus();
  });
});
