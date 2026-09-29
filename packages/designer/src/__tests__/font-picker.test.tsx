import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FontPicker, fontStack, type FontPickerFont } from "../components/FontPicker";

const fonts: FontPickerFont[] = [
  { family: "Inter", category: "sans-serif", weights: [400, 500, 700] },
  { family: "Playfair Display", category: "serif", weights: [400] },
  { family: "Caveat", category: "handwriting" },
  { family: "JetBrains Mono", category: "monospace" },
];

describe("FontPicker", () => {
  it("shows the selected family in its own face on a compact field trigger", () => {
    render(
      <FontPicker
        aria-label="Heading font"
        fonts={fonts}
        value="Playfair Display"
        onChange={() => {}}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Heading font" });
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveClass("compact:h-6");
    expect(trigger.closest("[data-density='compact']")).not.toBeNull();
    expect(screen.getByText("Playfair Display")).toHaveStyle({
      fontFamily: '"Playfair Display", serif',
    });
  });

  it("builds a quoted stack with a generic fallback per category", () => {
    expect(fontStack({ family: "Caveat", category: "handwriting" })).toBe('"Caveat", cursive');
    expect(fontStack({ family: "Odd", category: "unknown" })).toBe('"Odd", sans-serif');
    expect(fontStack({ family: 'Evil"Font', category: "serif" })).toBe('"Evil\\"Font", serif');
  });

  it("previews each option in its face and searches by name or category", async () => {
    const user = userEvent.setup();
    render(<FontPicker aria-label="Body font" fonts={fonts} value="Inter" onChange={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Body font" }));
    const list = await screen.findByRole("listbox", { name: "Fonts" });
    const options = within(list).getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(within(options[3]!).getByText("JetBrains Mono")).toHaveStyle({
      fontFamily: '"JetBrains Mono", monospace',
    });
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(within(options[0]!).getByText("3 styles")).toBeInTheDocument();

    const search = screen.getByRole("combobox", { name: "Search fonts" });
    expect(search).toHaveFocus();
    await user.type(search, "serif");
    expect(
      within(list)
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["Inter3 styles", "Playfair Display1 style"]);
    await user.clear(search);
    await user.type(search, "zzz");
    expect(screen.getByText("No fonts found")).toBeInTheDocument();
  });

  it("is keyboard operable and calls onChange with the family", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FontPicker aria-label="Body font" fonts={fonts} value={null} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Body font" })).toHaveTextContent("Choose a font");
    await user.click(screen.getByRole("button", { name: "Body font" }));
    const search = await screen.findByRole("combobox", { name: "Search fonts" });
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const active = document.getElementById(search.getAttribute("aria-activedescendant")!);
    expect(active).toHaveTextContent("Caveat");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("Caveat", fonts[2]);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("asks the app to load faces on demand, once per family", async () => {
    const user = userEvent.setup();
    const onLoadFont = vi.fn();
    render(
      <FontPicker
        aria-label="Body font"
        fonts={fonts}
        value="Inter"
        onChange={() => {}}
        onLoadFont={onLoadFont}
      />,
    );
    // The selected face is needed for the trigger.
    expect(onLoadFont).toHaveBeenCalledWith(fonts[0]);
    await user.click(screen.getByRole("button", { name: "Body font" }));
    await screen.findByRole("listbox");
    const families = onLoadFont.mock.calls.map(([font]) => (font as FontPickerFont).family);
    expect(new Set(families).size).toBe(families.length);
  });

  it("labels are localizable", async () => {
    const user = userEvent.setup();
    render(
      <FontPicker
        aria-label="Fuente"
        fonts={fonts}
        value={null}
        onChange={() => {}}
        labels={{ placeholder: "Elige una fuente", search: "Buscar fuentes", list: "Fuentes" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Fuente" })).toHaveTextContent("Elige una fuente");
    await user.click(screen.getByRole("button", { name: "Fuente" }));
    expect(await screen.findByRole("listbox", { name: "Fuentes" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Buscar fuentes" })).toBeInTheDocument();
  });
});
