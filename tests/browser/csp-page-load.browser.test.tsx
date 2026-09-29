/**
 * A Hilum page under a strict Content-Security-Policy (`style-src 'self'`)
 * logs no CSP violation: the policy is in place before the published
 * @hilum/ui bundle (packages/ui/dist/index.js) is imported, as in an app
 * served with a CSP header, so import-time injections count too (sonner and
 * vaul used to insert a <style> on import, on every page).
 *
 * The one exception is Radix: a few primitives render a <style> we can't turn
 * off (documented in the ui README, "Strict Content-Security-Policy"). The
 * last test pins that list: anything else is a regression.
 *
 * Uses the built bundle: run `pnpm --filter @hilum/ui build` after changing
 * packages/ui (the browser config builds it when dist is missing).
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { page } from "vitest/browser";
// Types only: the test loads the built bundle, which has the same API.
import type * as HilumSource from "@hilum/ui";

type HilumUi = typeof HilumSource;

const violations: SecurityPolicyViolationEvent[] = [];
let ui: HilumUi;

/** Radix's own <style> tags (see the README): react-remove-scroll-bar and the Select / ScrollArea viewports. */
const RADIX_STYLES =
  /with-scroll-bars-hidden|data-scroll-locked|\[data-radix-(select|scroll-area)-viewport\]/;

beforeAll(async () => {
  // Vite serves the app CSS (Tailwind + tokens.css) through runtime <style>
  // tags in dev. Stand in for a production <link rel=stylesheet> from 'self':
  // move it into constructable stylesheets (not subject to CSP) first.
  const appCss = () =>
    Array.from(document.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]"));
  for (
    let i = 0;
    i < 100 && !appCss().some((s) => s.textContent?.includes("hilum-mobile-sheet"));
    i++
  ) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  const sheets = appCss().map((style) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style.textContent ?? "");
    style.remove();
    return sheet;
  });
  expect(sheets.length).toBeGreaterThan(0);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheets];

  document.addEventListener("securitypolicyviolation", (event) => violations.push(event));
  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "style-src 'self' 'report-sample'";
  document.head.append(meta);

  // Then load the app code, as a page would.
  const bundle = "../../packages/ui/dist/index.js";
  ui = (await import(/* @vite-ignore */ bundle)) as HilumUi;
});

afterEach(() => cleanup());

const settle = () => new Promise((resolve) => setTimeout(resolve, 100));

function logged() {
  const samples = violations.map(
    (event) => `${event.effectiveDirective}: ${event.sample || "(empty <style>)"}`,
  );
  violations.length = 0;
  return samples;
}

describe("strict CSP, the published bundle (real browser)", () => {
  test("the policy blocks runtime <style> tags", async () => {
    const style = document.createElement("style");
    style.textContent = "#csp-probe { color: rgb(1, 2, 3); }";
    document.head.append(style);
    await settle();
    expect(violations.some((event) => event.sample.includes("csp-probe"))).toBe(true);
    style.remove();
    violations.length = 0;
  });

  test("importing @hilum/ui logs nothing (sonner and vaul no longer inject)", async () => {
    await settle();
    expect(logged()).toEqual([]);
    const tags = Array.from(document.querySelectorAll("style")).map((s) => s.textContent ?? "");
    expect(tags.filter((css) => /data-sonner-toaster|data-vaul-drawer/.test(css))).toEqual([]);
  });

  test("a dashboard page with toasts, forms, pickers and charts logs nothing", async () => {
    await page.viewport(1280, 800);
    const {
      Toaster,
      toast,
      Field,
      Input,
      InputGroup,
      InputNumber,
      InputOTP,
      InputOTPGroup,
      InputOTPSlot,
      MultiCombobox,
      Combobox,
      Popover,
      PopoverContent,
      PopoverTrigger,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
      DataTable,
      StatCard,
      StatCardGrid,
      TimeSeriesChart,
      Progress,
      SetupGuide,
      Tabs,
      TabsList,
      TabsTrigger,
      TabsContent,
      RichTextEditor,
      PreviewFrame,
    } = ui;
    render(
      <TooltipProvider>
        <Toaster />
        <StatCardGrid columns={2}>
          <StatCard label="Sales" value="S/ 1,234.50" />
          <StatCard label="Orders" value="42" />
        </StatCardGrid>
        <Progress value={40} aria-label="Setup" />
        <SetupGuide
          title="Set up your store"
          tasks={[{ id: "a", title: "Add a product", complete: false }]}
        />
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Body</TabsContent>
        </Tabs>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Store address">
          <InputGroup leadingAddon="https://" trailingAddon=".hilum.shop" />
        </Field>
        <Field label="Stock">
          <InputNumber value={1} onChange={() => {}} />
        </Field>
        <Field label="Code">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <MultiCombobox aria-label="Collections" options={[{ value: "a", label: "Summer" }]} />
        <Combobox aria-label="Vendor" options={[{ value: "a", label: "Acme" }]} />
        <Popover open>
          <PopoverTrigger>Filters</PopoverTrigger>
          <PopoverContent>Filter body</PopoverContent>
        </Popover>
        <Tooltip open>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent>Tip</TooltipContent>
        </Tooltip>
        <DataTable
          columns={[{ id: "name", header: "Name", cell: ({ row }) => row.original.name }]}
          data={[{ name: "Linen shirt" }]}
          mobileLayout="cards"
        />
        <div style={{ width: 600 }}>
          <TimeSeriesChart
            aria-label="Sales"
            data={[
              { date: "2026-09-01", sales: 10 },
              { date: "2026-09-02", sales: 20 },
            ]}
            series={[{ key: "sales", label: "Sales" }]}
          />
        </div>
        <RichTextEditor aria-label="Description" value="<p>Hi</p>" onChange={() => {}} />
        <PreviewFrame src="about:blank" title="Preview" />
      </TooltipProvider>,
    );
    act(() => {
      toast.success("Product saved");
    });
    await screen.findByText("Product saved");
    // Open both lists (they render in a popover layer).
    act(() => screen.getByRole("combobox", { name: "Collections" }).focus());
    await screen.findByRole("listbox");
    act(() => screen.getByRole("combobox", { name: "Vendor" }).focus());
    await screen.findByRole("option", { name: "Acme" });
    await settle();
    expect(logged()).toEqual([]);

    // Toasts and the OTP input are styled by tokens.css.
    const toaster = document.querySelector<HTMLElement>("[data-sonner-toaster]")!;
    expect(getComputedStyle(toaster).position).toBe("fixed");
    const otp = document.querySelector<HTMLInputElement>("[data-input-otp]")!;
    expect(getComputedStyle(otp, "::selection").backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(document.getElementById("input-otp-style")?.tagName).toBe("META");
  });

  test("only Radix's documented <style> tags remain: modal layers, Select and ScrollArea", async () => {
    const {
      Dialog,
      DialogContent,
      DialogTitle,
      Drawer,
      DrawerContent,
      DrawerTitle,
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
      ScrollArea,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
    } = ui;
    const cases = [
      <Dialog key="dialog" open>
        <DialogContent>
          <DialogTitle>Edit</DialogTitle>
        </DialogContent>
      </Dialog>,
      <Drawer key="drawer" open>
        <DrawerContent>
          <DrawerTitle>Cart</DrawerTitle>
        </DrawerContent>
      </Drawer>,
      <DropdownMenu key="menu" open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
      <Select key="select" open value="a">
        <SelectTrigger aria-label="Status" />
        <SelectContent>
          <SelectItem value="a">Active</SelectItem>
        </SelectContent>
      </Select>,
      <ScrollArea key="scroll" className="h-10">
        <div className="h-40">Long</div>
      </ScrollArea>,
    ];
    for (const element of cases) {
      const { unmount } = render(element);
      await settle();
      unmount();
    }
    await settle();
    expect(logged().filter((sample) => !RADIX_STYLES.test(sample))).toEqual([]);
  });
});
