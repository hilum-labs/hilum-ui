import * as React from "react";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  IconProvider,
  useIcon,
  useIconLibrary,
  useIconLibraryCycleShortcut,
} from "../../lib/icon-context";
import { lucideIcons } from "../../lib/icon-map";
import { iconLibraries, phosphorIcons } from "../../icon-libraries";
import { ShapeProvider, useShapeContext, useShapeCycleShortcut } from "../../lib/shape-context";
import { sanitizeRichTextHtml, isSafeUrl } from "../../lib/sanitize-html";
import { HilumProvider, MotionProvider, usePrefersReducedMotion } from "../../lib/motion-provider";
import { animate, useMotionValue } from "../../lib/motion";
import { FormatProvider } from "../../lib/format";
import { tokens } from "../../tokens/tokens";
import { RichTextEditor } from "../rich-text-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { InputNumber } from "../input-number";
import { ColorPicker } from "../color-picker";
import { Field } from "../field";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { NativeSelect } from "../native-select";
import { Label } from "../label";
import { Badge, badgeColors } from "../badge";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../..");

afterEach(() => {
  vi.restoreAllMocks();
});

/* ------------------------------------------------------------------ */
/* 1. No global keyboard hijacks; opt-in shortcut hooks                */
/* ------------------------------------------------------------------ */

function LibraryProbe() {
  const { iconLibrary } = useIconLibrary();
  return <span data-testid="lib">{iconLibrary}</span>;
}

function ShapeProbe() {
  const { shape } = useShapeContext();
  return <span data-testid="shape">{shape}</span>;
}

describe("global shortcuts", () => {
  it("IconProvider and ShapeProvider no longer react to bare 'i' / 'r' keystrokes", () => {
    render(
      <IconProvider libraries={iconLibraries}>
        <ShapeProvider>
          <LibraryProbe />
          <ShapeProbe />
        </ShapeProvider>
      </IconProvider>,
    );
    const event = new KeyboardEvent("keydown", { key: "i", bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);
    fireEvent.keyDown(document.body, { key: "r" });
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByTestId("lib")).toHaveTextContent("lucide");
    expect(screen.getByTestId("shape")).toHaveTextContent("rounded");
  });

  it("useIconLibraryCycleShortcut cycles only through registered libraries", () => {
    function Shortcut() {
      useIconLibraryCycleShortcut();
      return null;
    }
    render(
      <IconProvider libraries={{ phosphor: phosphorIcons }}>
        <Shortcut />
        <LibraryProbe />
      </IconProvider>,
    );
    fireEvent.keyDown(document.body, { key: "i" });
    expect(screen.getByTestId("lib")).toHaveTextContent("phosphor");
    fireEvent.keyDown(document.body, { key: "I" });
    expect(screen.getByTestId("lib")).toHaveTextContent("lucide");
    // Modifiers and typing targets are ignored.
    fireEvent.keyDown(document.body, { key: "i", metaKey: true });
    expect(screen.getByTestId("lib")).toHaveTextContent("lucide");
  });

  it("useShapeCycleShortcut toggles shape but ignores typing in inputs", () => {
    function Shortcut() {
      useShapeCycleShortcut();
      return null;
    }
    render(
      <ShapeProvider>
        <Shortcut />
        <ShapeProbe />
        <input aria-label="text" />
      </ShapeProvider>,
    );
    fireEvent.keyDown(screen.getByLabelText("text"), { key: "r" });
    expect(screen.getByTestId("shape")).toHaveTextContent("rounded");
    fireEvent.keyDown(document.body, { key: "r" });
    expect(screen.getByTestId("shape")).toHaveTextContent("pill");
  });
});

/* ------------------------------------------------------------------ */
/* 2. Icon libraries behind a subpath                                   */
/* ------------------------------------------------------------------ */

describe("icon libraries", () => {
  it("defaults to Lucide with zero config", () => {
    const { result } = renderHook(() => useIcon("search"));
    expect(result.current).toBe(lucideIcons.search);
  });

  it("uses a registered alternative library", () => {
    const { result } = renderHook(() => useIcon("search"), {
      wrapper: ({ children }) => (
        <IconProvider defaultLibrary="phosphor" libraries={iconLibraries}>
          {children}
        </IconProvider>
      ),
    });
    expect(result.current).toBe(phosphorIcons.search);
    expect(result.current).not.toBe(lucideIcons.search);
  });

  it("falls back to Lucide (with a warning) when the library isn't registered", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useIcon("search"), {
      wrapper: ({ children }) => <IconProvider defaultLibrary="tabler">{children}</IconProvider>,
    });
    expect(result.current).toBe(lucideIcons.search);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"tabler" is not registered'));
  });

  it("nested providers inherit their parent's registrations", () => {
    const { result } = renderHook(() => useIcon("x"), {
      wrapper: ({ children }) => (
        <IconProvider libraries={iconLibraries}>
          <IconProvider defaultLibrary="phosphor">{children}</IconProvider>
        </IconProvider>
      ),
    });
    expect(result.current).toBe(phosphorIcons.x);
  });

  it("keeps optional icon packages out of every module except the icon-libraries entry", () => {
    const optional = /@(?:phosphor-icons|tabler|hugeicons|untitledui)\//;
    const allowed = new Set([
      join(srcDir, "icon-libraries.ts"),
      join(srcDir, "lib", "icon-libraries-data.tsx"),
    ]);
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "__tests__") walk(full);
        } else if (/\.tsx?$/.test(entry.name) && !allowed.has(full)) {
          const source = readFileSync(full, "utf8");
          if (/from\s+["']@(?:phosphor-icons|tabler|hugeicons|untitledui)\//.test(source)) {
            offenders.push(full);
          }
        }
      }
    };
    walk(srcDir);
    expect(optional.test("@tabler/icons-react")).toBe(true);
    expect(offenders).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* 3. RichTextEditor sanitization                                       */
/* ------------------------------------------------------------------ */

describe("sanitizeRichTextHtml", () => {
  it("strips event handlers, scripts and javascript: URLs", () => {
    const out = sanitizeRichTextHtml(
      '<p>ok</p><img src=x onerror="alert(1)"><a href="javascript:alert(1)">x</a>' +
        '<script>alert(1)</script><iframe src=//evil></iframe><h1 style="color:red" onclick="x">t</h1>',
    );
    expect(out).not.toMatch(
      /onerror|onclick|javascript:|<script|<iframe|style=|alert\(1\)<\/script/i,
    );
    expect(out).toContain("<p>ok</p>");
    expect(out).toContain('<img src="x">');
    expect(out).toContain("<h1>t</h1>");
  });

  it("forces rel=noopener noreferrer on links and keeps safe hrefs", () => {
    const out = sanitizeRichTextHtml(
      '<a href="https://example.com" target="_blank" rel="opener">a</a><a href="  JaVa\tScRiPt:alert(1)">b</a>',
    );
    const template = document.createElement("template");
    template.innerHTML = out;
    const [safe, unsafe] = Array.from(template.content.querySelectorAll("a"));
    expect(safe).toHaveAttribute("href", "https://example.com");
    expect(safe).toHaveAttribute("rel", "noopener noreferrer");
    expect(safe).toHaveAttribute("target", "_blank");
    expect(unsafe).not.toHaveAttribute("href");
    expect(unsafe).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("rejects dangerous URL schemes", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("java\nscript:alert(1)")).toBe(false);
    expect(isSafeUrl("vbscript:x")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeUrl("https://ok.dev/a")).toBe(true);
    expect(isSafeUrl("/relative")).toBe(true);
    expect(isSafeUrl("mailto:a@b.co")).toBe(true);
  });
});

describe("RichTextEditor", () => {
  const editor = () => screen.getByRole("textbox", { name: /content editor/i });

  it("sanitizes an incoming value before it reaches the DOM", () => {
    render(
      <RichTextEditor
        value={
          '<p>Hi</p><img src=x onerror="window.__xss=1"><a href="javascript:alert(1)">l</a><script>window.__xss=2</script>'
        }
        onChange={() => {}}
      />,
    );
    const el = editor();
    expect(el.querySelector("img")).not.toHaveAttribute("onerror");
    expect(el.querySelector("a")).not.toHaveAttribute("href");
    expect(el.querySelector("script")).toBeNull();
    expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
  });

  it("sanitizes pasted HTML and inserts plain text when no HTML is present", () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="" onChange={onChange} />);
    const el = editor();

    fireEvent.paste(el, {
      clipboardData: {
        getData: (type: string) =>
          type === "text/html" ? '<b onclick="x">bold</b><img src=x onerror=alert(1)>' : "",
      },
    });
    expect(el.innerHTML).toContain("<b>bold</b>");
    expect(el.innerHTML).not.toContain("onerror");
    expect(el.innerHTML).not.toContain("onclick");

    fireEvent.paste(el, {
      clipboardData: {
        getData: (type: string) => (type === "text/plain" ? "<script>x</script>\nline" : ""),
      },
    });
    expect(el.querySelector("script")).toBeNull();
    expect(el.innerHTML).toContain("&lt;script&gt;");
    expect(el.innerHTML).toContain("<br>");
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1]?.[0]).not.toMatch(/<script/);
  });

  it("does not rewrite the DOM when the parent echoes back the emitted value", () => {
    function Controlled() {
      const [html, setHtml] = React.useState("<p>One</p>");
      return <RichTextEditor value={html} onChange={setHtml} />;
    }
    render(<Controlled />);
    const el = editor();
    const paragraph = el.querySelector("p");
    paragraph!.textContent = "One two";
    fireEvent.input(el);
    // Same node: innerHTML was not reassigned (which would reset the caret).
    expect(el.querySelector("p")).toBe(paragraph);
    expect(el).toHaveTextContent("One two");
  });

  it("does not use dangerouslySetInnerHTML on the editable node", () => {
    const source = readFileSync(join(srcDir, "components", "rich-text-editor.tsx"), "utf8");
    expect(source).not.toMatch(/dangerouslySetInnerHTML=\{/);
  });
});

/* ------------------------------------------------------------------ */
/* 4. Select on Radix                                                   */
/* ------------------------------------------------------------------ */

function Wrapped({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

describe("Select (Radix)", () => {
  it("selects an option and shows its label, including wrapped/fragment items", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruit</SelectLabel>
            <>
              <SelectItem value="apple">Apple</SelectItem>
            </>
            <Wrapped>
              <SelectItem value="banana">Banana</SelectItem>
            </Wrapped>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveTextContent("Pick one");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    await waitFor(() => expect(trigger).toHaveTextContent("Banana"));
  });

  it("participates in native forms via name/required", () => {
    const { container } = render(
      <form data-testid="form">
        <Select name="size" defaultValue="m" required>
          <SelectTrigger aria-label="Size" />
          <SelectContent>
            <SelectItem value="s">Small</SelectItem>
            <SelectItem value="m">Medium</SelectItem>
          </SelectContent>
        </Select>
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    const native = container.querySelector("select[name='size']") as HTMLSelectElement | null;
    expect(native).not.toBeNull();
    expect(native).toBeRequired();
    expect(new FormData(form).get("size")).toBe("m");
  });

  it("keeps the mobile bottom-sheet opt-in and renders trigger errors accessibly", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Status" error="Required" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Required");
    await user.click(trigger);
    expect(await screen.findByRole("listbox")).toHaveAttribute("data-hilum-mobile-sheet", "true");
  });

  it("renders a SelectLabel outside a SelectGroup without throwing", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Loose" />
        <SelectContent>
          <SelectLabel>Heading</SelectLabel>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    await user.click(screen.getByRole("combobox", { name: "Loose" }));
    expect(await screen.findByText("Heading")).toBeInTheDocument();
  });

  it("does not close when the window scrolls", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Scroll" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    await user.click(screen.getByRole("combobox", { name: "Scroll" }));
    await screen.findByRole("listbox");
    fireEvent.scroll(window);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* 6. Reduced motion                                                    */
/* ------------------------------------------------------------------ */

describe("reduced motion", () => {
  it("HilumProvider / MotionProvider control the reduced-motion policy", () => {
    const always = renderHook(() => usePrefersReducedMotion(), {
      wrapper: ({ children }) => <HilumProvider reducedMotion="always">{children}</HilumProvider>,
    });
    expect(always.result.current).toBe(true);
    const never = renderHook(() => usePrefersReducedMotion(), {
      wrapper: ({ children }) => <MotionProvider reducedMotion="never">{children}</MotionProvider>,
    });
    expect(never.result.current).toBe(false);
  });

  it("imperative animate() jumps to its target under prefers-reduced-motion", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          onchange: null,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    );
    const { result } = renderHook(() => useMotionValue(0));
    const start = performance.now();
    act(() => {
      animate(result.current, 100, { type: "spring", duration: 5 });
    });
    await waitFor(() => expect(result.current.get()).toBe(100));
    // A 5s spring would still be far from done; the reduced path is instant.
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it("no component imports framer-motion directly (all go through the reduced-motion shim)", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "__tests__") walk(full);
        } else if (/\.tsx?$/.test(entry.name)) {
          if (full.endsWith(join("lib", "motion.tsx")) || full.endsWith("motion-provider.tsx"))
            continue;
          // contextual-save-bar handles reduced motion itself.
          if (full.endsWith("contextual-save-bar.tsx")) continue;
          if (/from\s+["']framer-motion["']/.test(readFileSync(full, "utf8"))) offenders.push(full);
        }
      }
    };
    walk(srcDir);
    expect(offenders).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* 7. InputNumber                                                       */
/* ------------------------------------------------------------------ */

describe("InputNumber a11y + locale", () => {
  function Controlled(props: Partial<React.ComponentProps<typeof InputNumber>>) {
    const [value, setValue] = React.useState<number | null>(props.value ?? 10);
    return (
      <InputNumber aria-label="Amount" {...props} value={value} onChange={(n) => setValue(n)} />
    );
  }

  it("exposes spinbutton semantics", () => {
    render(
      <InputNumber aria-label="Width" value={12} min={0} max={100} unit="px" onChange={() => {}} />,
    );
    const spin = screen.getByRole("spinbutton", { name: "Width" });
    expect(spin).toHaveAttribute("aria-valuenow", "12");
    expect(spin).toHaveAttribute("aria-valuemin", "0");
    expect(spin).toHaveAttribute("aria-valuemax", "100");
    expect(spin).toHaveAttribute("aria-valuetext", "12 px");
  });

  it("omits infinite bounds and reports the mixed label", () => {
    render(<InputNumber aria-label="Mixed" value={null} onChange={() => {}} />);
    const spin = screen.getByRole("spinbutton", { name: "Mixed" });
    expect(spin).not.toHaveAttribute("aria-valuemin");
    expect(spin).not.toHaveAttribute("aria-valuemax");
    expect(spin).not.toHaveAttribute("aria-valuenow");
    expect(spin).toHaveAttribute("aria-valuetext", "Mixed");
  });

  it("supports PageUp/PageDown (10 steps) and Home/End (min/max)", () => {
    render(<Controlled min={0} max={50} step={2} />);
    const spin = screen.getByRole("spinbutton", { name: "Amount" });
    fireEvent.keyDown(spin, { key: "PageUp" });
    expect(spin).toHaveAttribute("aria-valuenow", "30");
    fireEvent.keyDown(spin, { key: "PageDown" });
    expect(spin).toHaveAttribute("aria-valuenow", "10");
    fireEvent.keyDown(spin, { key: "End" });
    expect(spin).toHaveAttribute("aria-valuenow", "50");
    fireEvent.keyDown(spin, { key: "Home" });
    expect(spin).toHaveAttribute("aria-valuenow", "0");
  });

  it("formats and parses with the given locale", () => {
    const onChange = vi.fn();
    render(
      <InputNumber
        aria-label="Price"
        value={1234.5}
        precision={2}
        locale="de-DE"
        onChange={onChange}
      />,
    );
    const spin = screen.getByRole("spinbutton", { name: "Price" });
    expect(spin).toHaveValue("1234,50");
    fireEvent.change(spin, { target: { value: "1.234,75" } });
    fireEvent.blur(spin);
    expect(onChange).toHaveBeenCalledWith(1234.75);
  });

  it("reads the locale from FormatProvider and honours formatOptions", () => {
    render(
      <FormatProvider locale="de-DE">
        <InputNumber
          aria-label="Big"
          value={1234567}
          formatOptions={{ useGrouping: true }}
          onChange={() => {}}
        />
      </FormatProvider>,
    );
    expect(screen.getByRole("spinbutton", { name: "Big" })).toHaveValue("1.234.567");
  });
});

/* ------------------------------------------------------------------ */
/* 8. ColorPicker saturation/brightness area                            */
/* ------------------------------------------------------------------ */

describe("ColorPicker 2D area", () => {
  it("is a slider with a descriptive value text", () => {
    render(<ColorPicker value="#FF0000" onChange={() => {}} />);
    const area = screen.getByRole("slider", { name: "Saturation and brightness" });
    expect(area).toHaveAttribute("aria-valuetext", "Saturation 100%, brightness 100%");
    expect(screen.queryByRole("application")).toBeNull();
  });

  it("uses checkerboard tokens instead of hard-coded chrome colours", () => {
    const source = readFileSync(join(srcDir, "components", "color-picker.tsx"), "utf8");
    expect(source).not.toMatch(/--checker-[ab],\s*#/);
  });
});

/* ------------------------------------------------------------------ */
/* 9. Field auto-wiring                                                 */
/* ------------------------------------------------------------------ */

describe("Field context wiring", () => {
  it("wires label, hint and required onto a bare Input", () => {
    render(
      <Field label="Email" hint="We never share it" required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: /email/i });
    expect(input).toHaveAccessibleDescription("We never share it");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the control invalid and describes it with the error", () => {
    render(
      <Field label="Bio" error="Too short">
        <Textarea />
      </Field>,
    );
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription("Too short");
  });

  it("explicit props override the context", () => {
    render(
      <>
        <p id="custom">Custom description</p>
        <Field label="Name" error="Bad">
          <Input aria-describedby="custom" aria-invalid={false} />
        </Field>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAccessibleDescription("Custom description");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("follows a control's own id and keeps the legacy htmlFor-description id", async () => {
    render(
      <>
        <Field label="Own id" hint="hint">
          <Input id="mine" />
        </Field>
        <Field label="Legacy" htmlFor="legacy" error="oops">
          <Input id="legacy" />
        </Field>
      </>,
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Own id" })).toHaveAttribute("id", "mine"),
    );
    expect(screen.getByText("oops")).toHaveAttribute("id", "legacy-description");
    expect(screen.getByRole("textbox", { name: "Legacy" })).toHaveAccessibleDescription("oops");
  });

  it("only the first control takes the field id", () => {
    render(
      <Field label="Full name">
        <Input placeholder="First" />
        <Input placeholder="Last" />
      </Field>,
    );
    const first = screen.getByPlaceholderText("First");
    const last = screen.getByPlaceholderText("Last");
    expect(first.id).toBeTruthy();
    expect(last.id).not.toBe(first.id);
    expect(screen.getByRole("textbox", { name: "Full name" })).toBe(first);
  });

  it("wires NativeSelect, Select and a bare Label", () => {
    render(
      <>
        <Field label="Country" error="Pick one">
          <NativeSelect>
            <option value="us">US</option>
          </NativeSelect>
        </Field>
        <Field label="Plan" hint="Billed monthly">
          <Select>
            <SelectTrigger />
            <SelectContent>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Outer">
          <Label>Inner label</Label>
          <Input />
        </Field>
      </>,
    );
    const native = screen.getByRole("combobox", { name: "Country" });
    expect(native).toHaveAttribute("aria-invalid", "true");
    expect(native).toHaveAccessibleDescription("Pick one");
    const select = screen.getByRole("combobox", { name: "Plan" });
    expect(select).toHaveAccessibleDescription("Billed monthly");
    expect(screen.getByText("Inner label")).toHaveAttribute(
      "for",
      screen.getByRole("textbox", { name: /outer/i }).id,
    );
  });

  it("InputNumber picks up the field wiring", () => {
    render(
      <Field label="Quantity" error="Too many">
        <InputNumber value={3} onChange={() => {}} />
      </Field>,
    );
    const spin = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(spin).toHaveAttribute("aria-invalid", "true");
    expect(spin).toHaveAccessibleDescription("Too many");
  });
});

/* ------------------------------------------------------------------ */
/* 10. Badge tokens                                                     */
/* ------------------------------------------------------------------ */

describe("Badge colours", () => {
  it("references categorical tokens instead of raw hex", () => {
    for (const [name, value] of Object.entries(badgeColors)) {
      expect(value).toBe(`var(--categorical-${name})`);
      expect(tokens.categorical).toHaveProperty(name);
    }
    const source = readFileSync(join(srcDir, "components", "badge.tsx"), "utf8");
    expect(source).not.toMatch(/#[0-9a-f]{6}\b/i);
  });

  it("tints dots with the token", () => {
    render(
      <Badge variant="dot" color="blue">
        Blue
      </Badge>,
    );
    const dot = screen.getByText("Blue").firstElementChild as HTMLElement;
    expect(dot.getAttribute("style")).toContain("var(--categorical-blue)");
  });
});
