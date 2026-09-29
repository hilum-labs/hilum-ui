import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MultiCombobox, MULTI_COMBOBOX_DEFAULT_LABELS } from "../multi-combobox";
import { ResourcePicker, type ResourcePickerItem } from "../resource-picker";
import { Field } from "../field";
import type { ComboboxOption } from "../combobox";

const FRUITS: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", description: "Yellow" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

function Controlled({
  initial = [],
  onValueChange,
  ...props
}: Partial<React.ComponentProps<typeof MultiCombobox>> & { initial?: string[] }) {
  const [value, setValue] = React.useState(initial);
  return (
    <MultiCombobox
      aria-label="Fruits"
      options={FRUITS}
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

function chips() {
  return Array.from(document.querySelectorAll("[data-slot=tag]")).map((tag) => tag.textContent);
}

describe("MultiCombobox", () => {
  it("selects several options as chips and keeps the list open", () => {
    const onValueChange = vi.fn();
    render(<Controlled onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Fruits" });
    fireEvent.focus(input);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    fireEvent.click(screen.getByRole("option", { name: "Banana Yellow" }));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(chips()).toEqual(["Banana", "Apple"]);
    expect(onValueChange).toHaveBeenLastCalledWith(["banana", "apple"]);
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
    // Clicking a selected option deselects it.
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(chips()).toEqual(["Banana"]);
    expect(input).toHaveAccessibleDescription("1 selected: Banana");
  });

  it("filters by label and description and supports the keyboard", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Fruits" });
    fireEvent.change(input, { target: { value: "yel" } });
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["BananaYellow"]);
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toMatch(/option-1$/);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(chips()).toEqual(["Banana"]);
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("removes the last chip with Backspace and a chip with its button", () => {
    render(<Controlled initial={["apple", "cherry", "date"]} />);
    const input = screen.getByRole("combobox", { name: "Fruits" });
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(chips()).toEqual(["Apple", "Cherry"]);
    fireEvent.click(screen.getByRole("button", { name: "Remove Apple" }));
    expect(chips()).toEqual(["Cherry"]);
    expect(screen.getAllByRole("status").some((s) => s.textContent === "Apple removed")).toBe(true);
  });

  it("caps the selection with maxSelected", () => {
    render(<Controlled initial={["apple"]} maxSelected={2} />);
    const input = screen.getByRole("combobox", { name: "Fruits" });
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole("option", { name: "Cherry" }));
    expect(screen.getByRole("option", { name: "Date" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("option", { name: "Date" }));
    expect(chips()).toEqual(["Apple", "Cherry"]);
    expect(
      screen
        .getAllByRole("status")
        .some((s) => s.textContent === MULTI_COMBOBOX_DEFAULT_LABELS.limitReached(2)),
    ).toBe(true);
  });

  it("searches on the server: onSearchChange, loading and remembered chip labels", () => {
    const onSearchChange = vi.fn();
    function Remote() {
      const [query, setQuery] = React.useState("");
      const [value, setValue] = React.useState<string[]>([]);
      const options = FRUITS.filter((fruit) => fruit.label.toLowerCase().startsWith(query));
      return (
        <MultiCombobox
          aria-label="Fruits"
          options={query === "zzz" ? [] : options}
          loading={query === "c"}
          value={value}
          onValueChange={setValue}
          onSearchChange={(next) => {
            onSearchChange(next);
            setQuery(next);
          }}
        />
      );
    }
    render(<Remote />);
    const input = screen.getByRole("combobox", { name: "Fruits" });
    fireEvent.change(input, { target: { value: "b" } });
    expect(onSearchChange).toHaveBeenLastCalledWith("b");
    fireEvent.click(screen.getByRole("option", { name: "Banana Yellow" }));
    fireEvent.change(input, { target: { value: "c" } });
    expect(screen.getByRole("status", { name: "Loading…" })).toBeInTheDocument();
    // Banana is no longer in `options`, but its chip keeps the label.
    expect(chips()).toEqual(["Banana"]);
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });

  it("clears all, posts hidden inputs and is wired by Field", () => {
    const { container } = render(
      <Field label="Collections" hint="Manual collections only" error="Pick one" required>
        <MultiCombobox options={FRUITS} defaultValue={["apple", "date"]} clearable name="ids" />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Collections" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAccessibleDescription("Pick one 2 selected: Apple, Date");
    expect(
      Array.from(container.querySelectorAll("input[type=hidden][name=ids]")).map(
        (el) => (el as HTMLInputElement).value,
      ),
    ).toEqual(["apple", "date"]);
    fireEvent.focus(input);
    expect(screen.getByRole("listbox", { name: "Collections" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(chips()).toEqual([]);
  });

  it("is disabled by a disabled Field", () => {
    render(
      <Field label="Fruits" disabled>
        <MultiCombobox options={FRUITS} defaultValue={["apple"]} />
      </Field>,
    );
    expect(screen.getByRole("combobox", { name: "Fruits" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove Apple" })).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ResourcePicker                                                       */
/* ------------------------------------------------------------------ */

interface Product extends ResourcePickerItem {
  price: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Ceramic mug",
    subtitle: "12 in stock",
    thumbnail: null,
    price: 20,
    meta: "$20",
  },
  { id: "p2", title: "Tea towel", subtitle: "4 in stock", thumbnail: "/towel.png", price: 12 },
  { id: "p3", title: "Teapot", subtitle: "Sold out", price: 45, disabled: true },
];

describe("ResourcePicker", () => {
  it("selects rows with checkboxes and confirms with Add", () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ResourcePicker
        open
        onOpenChange={onOpenChange}
        title="Add products"
        items={PRODUCTS}
        initialSelectedIds={["p2"]}
        onSelect={onSelect}
      />,
    );
    const dialog = screen.getByRole("dialog", { name: "Add products" });
    const list = within(dialog).getByRole("list", { name: "Add products" });
    expect(within(list).getByRole("checkbox", { name: "Tea towel" })).toBeChecked();
    expect(within(list).getByRole("checkbox", { name: "Teapot" })).toBeDisabled();
    fireEvent.click(within(list).getByRole("checkbox", { name: "Ceramic mug" }));
    expect(within(dialog).getByText("2 selected")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Add 2" }));
    expect(onSelect).toHaveBeenCalledWith(["p2", "p1"], [PRODUCTS[1], PRODUCTS[0]]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("filters in the browser without onSearch", () => {
    render(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Add products"
        items={PRODUCTS}
        onSelect={() => {}}
      />,
    );
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
      target: { value: "tea" },
    });
    expect(
      screen.getAllByRole("checkbox").map((box) => box.getAttribute("aria-labelledby")),
    ).toHaveLength(2);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
      target: { value: "zzz" },
    });
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("debounces onSearch, keeps the selection across searches, and loads more", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const onLoadMore = vi.fn();
    const onSelect = vi.fn();
    function Remote() {
      const [items, setItems] = React.useState<Product[]>(PRODUCTS);
      return (
        <ResourcePicker
          open
          onOpenChange={() => {}}
          title="Add products"
          items={items}
          hasMore
          onLoadMore={onLoadMore}
          onSearch={(query) => {
            onSearch(query);
            setItems(PRODUCTS.filter((p) => p.title.toLowerCase().includes(query)));
          }}
          onSelect={onSelect}
        />
      );
    }
    render(<Remote />);
    expect(onSearch).toHaveBeenCalledWith("");
    fireEvent.click(screen.getByRole("checkbox", { name: "Ceramic mug" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
      target: { value: "towel" },
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenLastCalledWith("towel");
    expect(screen.queryByRole("checkbox", { name: "Ceramic mug" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Tea towel" }));
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Add 2" }));
    expect(onSelect).toHaveBeenCalledWith(["p1", "p2"], [PRODUCTS[0], PRODUCTS[1]]);
    vi.useRealTimers();
  });

  it("single choice with radio buttons, custom rows and a loading state", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Choose a collection"
        items={[]}
        loading
        multiple={false}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole("status", { name: "" })).toHaveTextContent("Loading");
    rerender(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Choose a collection"
        items={PRODUCTS.slice(0, 2)}
        multiple={false}
        renderItem={(item, { selected }) => (
          <span>
            {item.title}
            {selected ? " (chosen)" : ""}
          </span>
        )}
        onSelect={onSelect}
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Choose a collection" });
    fireEvent.click(within(group).getByRole("radio", { name: "Tea towel" }));
    expect(screen.getByText("Tea towel (chosen)")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(onSelect).toHaveBeenCalledWith(["p2"], [PRODUCTS[1]]);
  });

  it("caps the selection with maxSelected", () => {
    render(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Add products"
        items={PRODUCTS.slice(0, 2)}
        maxSelected={1}
        onSelect={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Ceramic mug" }));
    expect(screen.getByRole("checkbox", { name: "Tea towel" })).toBeDisabled();
    expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();
  });

  it("doesn't wire its search field into a surrounding Field", () => {
    render(
      <Field label="Related products" error="Add a product">
        <ResourcePicker
          open
          onOpenChange={() => {}}
          title="Add products"
          items={PRODUCTS}
          onSelect={() => {}}
        />
      </Field>,
    );
    const search = screen.getByRole("searchbox", { name: "Search" });
    expect(search).not.toHaveAttribute("aria-invalid");
    expect(search).not.toHaveAccessibleDescription("Add a product");
  });
});
