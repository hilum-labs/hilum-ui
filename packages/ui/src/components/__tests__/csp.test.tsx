import { describe, it, expect, afterEach } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../context-menu";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../menubar";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "../alert-dialog";
import { Sheet, SheetContent, SheetTitle } from "../sheet";
import { Drawer, DrawerContent, DrawerTitle } from "../drawer";
import { Toaster, toast } from "../sonner";
import { RichTextEditor } from "../rich-text-editor";
import { ChartContainer, chartColorVariables, LineChart, Line } from "../chart";
import { CommandPalette } from "../command-palette";
import { applyTheme } from "../../tokens/create-theme";
import { PreviewFrame } from "../preview-frame";
import { MultiCombobox } from "../multi-combobox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";
import { TagInput } from "../tag-input";
import { ResourcePicker } from "../resource-picker";

/**
 * Strict CSP (`style-src 'self'`) blocks runtime <style> elements. Hilum's own
 * components must not insert any. Radix still renders two kinds we can't turn
 * off, both copied statically into tokens.css so nothing depends on them:
 * the scroll lock (react-remove-scroll-bar) while a modal layer is open, and
 * the scrollbar-hiding rule of the Select / ScrollArea viewport.
 */
const isRadixInjected = (el: HTMLStyleElement) =>
  /data-scroll-locked|with-scroll-bars-hidden|data-radix-select-viewport|data-radix-scroll-area-viewport/.test(
    el.textContent ?? "",
  );

function stylesAddedBy(mount: () => void) {
  const before = new Set(document.querySelectorAll("style"));
  mount();
  return Array.from(document.querySelectorAll("style")).filter((el) => !before.has(el));
}

afterEach(() => cleanup());

describe("no runtime <style> from Hilum components (strict CSP)", () => {
  const cases: Array<[string, () => void]> = [
    [
      "Select",
      () =>
        render(
          <Select open value="a">
            <SelectTrigger aria-label="Status" />
            <SelectContent>
              <SelectItem value="a">Active</SelectItem>
            </SelectContent>
          </Select>,
        ),
    ],
    [
      "Popover",
      () =>
        render(
          <Popover open>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Body</PopoverContent>
          </Popover>,
        ),
    ],
    [
      "DropdownMenu",
      () =>
        render(
          <DropdownMenu open>
            <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
        ),
    ],
    [
      "ContextMenu",
      () =>
        render(
          <ContextMenu>
            <ContextMenuTrigger>Area</ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>,
        ),
    ],
    [
      "Menubar",
      () =>
        render(
          <Menubar value="file">
            <MenubarMenu value="file">
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>,
        ),
    ],
    [
      "Dialog",
      () =>
        render(
          <Dialog open>
            <DialogContent>
              <DialogTitle>Edit</DialogTitle>
            </DialogContent>
          </Dialog>,
        ),
    ],
    [
      "AlertDialog",
      () =>
        render(
          <AlertDialog open>
            <AlertDialogContent>
              <AlertDialogTitle>Delete?</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialog>,
        ),
    ],
    [
      "Sheet",
      () =>
        render(
          <Sheet open>
            <SheetContent>
              <SheetTitle>Filters</SheetTitle>
            </SheetContent>
          </Sheet>,
        ),
    ],
    [
      "Drawer",
      () =>
        render(
          <Drawer open>
            <DrawerContent>
              <DrawerTitle>Cart</DrawerTitle>
            </DrawerContent>
          </Drawer>,
        ),
    ],
    [
      "Toaster",
      () => {
        render(<Toaster />);
        act(() => {
          toast("Product saved");
        });
      },
    ],
    [
      "RichTextEditor",
      () =>
        render(<RichTextEditor aria-label="Description" value="<p>Hi</p>" onChange={() => {}} />),
    ],
    [
      "ChartContainer",
      () =>
        render(
          <ChartContainer
            height={200}
            config={{
              sales: { label: "Sales", color: "var(--primary)" },
              orders: { label: "Orders", theme: { light: "#111111", dark: "#eeeeee" } },
            }}
          >
            <LineChart data={[{ d: 1, sales: 2 }]}>
              <Line dataKey="sales" />
            </LineChart>
          </ChartContainer>,
        ),
    ],
    [
      "CommandPalette",
      () => render(<CommandPalette open onClose={() => {}} items={[{ label: "Orders" }]} />),
    ],
    [
      "PreviewFrame",
      () => render(<PreviewFrame src="about:blank" title="Preview" device="mobile" />),
    ],
    [
      // input-otp would append <style id="input-otp-style">; InputOTP claims the
      // id first (its rules ship in tokens.css).
      "InputOTP",
      () =>
        render(
          <InputOTP maxLength={4} aria-label="Code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
          </InputOTP>,
        ),
    ],
    [
      "MultiCombobox, TagInput and ResourcePicker",
      () =>
        render(
          <>
            <MultiCombobox aria-label="Fruits" options={[{ value: "a", label: "Apple" }]} />
            <TagInput aria-label="Tags" defaultValue={["a"]} suggestions={["b"]} />
            <ResourcePicker
              open
              onOpenChange={() => {}}
              title="Add products"
              items={[{ id: "1", title: "Mug", thumbnail: null }]}
              onSelect={() => {}}
            />
          </>,
        ),
    ],
  ];

  it.each(cases)("%s", (_name, mount) => {
    const added = stylesAddedBy(mount);
    expect(added.filter((el) => !isRadixInjected(el))).toEqual([]);
  });

  it("chart series colours are custom properties on the container", () => {
    render(
      <ChartContainer
        data-testid="chart"
        height={200}
        config={{
          sales: { label: "Sales", color: "var(--primary)" },
          orders: { label: "Orders", theme: { light: "#111111", dark: "#eeeeee" } },
        }}
      >
        <LineChart data={[]}>
          <Line dataKey="sales" />
        </LineChart>
      </ChartContainer>,
    );
    const chart = screen.getByTestId("chart");
    expect(chart.style.getPropertyValue("--color-sales")).toBe("var(--primary)");
    expect(chart.style.getPropertyValue("--color-orders")).toBe("light-dark(#111111, #eeeeee)");
    expect(chart.style.height).toBe("200px");
    expect(
      chartColorVariables({ a: { color: "red" }, b: { theme: { light: "#000", dark: "#fff" } } }),
    ).toEqual({ "--color-a": "red", "--color-b": "light-dark(#000, #fff)" });
  });

  it("applyTheme accepts a nonce for its explicit <style>", () => {
    const cleanupTheme = applyTheme({ primary: "#c100f1", secondary: "#fff5bf" }, { nonce: "abc" });
    const style = document.querySelector<HTMLStyleElement>("style[data-hilum-theme]");
    expect(style?.nonce).toBe("abc");
    cleanupTheme();
    expect(document.querySelector("style[data-hilum-theme]")).toBeNull();
  });
});
