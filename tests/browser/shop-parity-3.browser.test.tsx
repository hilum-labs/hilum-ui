import { render } from "@testing-library/react";
import { page } from "vitest/browser";
import {
  DataTable,
  Field,
  FormLayout,
  InputNumber,
  Progress,
  ScrollArea,
  Slider,
  Steps,
  UsageBar,
  type ColumnDef,
} from "@hilum/ui";

afterEach(async () => {
  await page.viewport(1280, 800);
});

/* ------------------------------------------------------------------ */
/* DataTable cards by container width                                   */
/* ------------------------------------------------------------------ */

describe("DataTable mobileLayout=cards in a narrow container (real browser)", () => {
  interface Row {
    id: string;
    name: string;
    price: string;
  }
  const data: Row[] = [
    { id: "1", name: "Linen shirt", price: "S/ 120.00" },
    { id: "2", name: "Canvas tote", price: "S/ 45.00" },
  ];
  const columns: ColumnDef<Row>[] = [
    { id: "name", header: "Product", cell: ({ row }) => row.original.name },
    {
      id: "price",
      header: "Price",
      meta: { label: "Price" },
      cell: ({ row }) => row.original.price,
    },
  ];

  it("switches to cards inside a narrow column on a wide screen, and back when it widens", async () => {
    const { container, rerender } = render(
      <div className="grid grid-cols-[360px_1fr] gap-4">
        <div data-testid="column">
          <DataTable columns={columns} data={data} mobileLayout="cards" />
        </div>
        <div />
      </div>,
    );
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelectorAll("[data-slot=data-table-card]")).toHaveLength(2);
    rerender(
      <div className="grid grid-cols-[900px_1fr] gap-4">
        <div data-testid="column">
          <DataTable columns={columns} data={data} mobileLayout="cards" />
        </div>
        <div />
      </div>,
    );
    await expect.poll(() => container.querySelector("table")).not.toBeNull();
  });

  it("follows the viewport with mobileBreakpointBasis=viewport", () => {
    const { container } = render(
      <div style={{ width: 360 }}>
        <DataTable
          columns={columns}
          data={data}
          mobileLayout="cards"
          mobileBreakpointBasis="viewport"
        />
      </div>,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* InputNumber in a two-column row on a phone                           */
/* ------------------------------------------------------------------ */

describe("InputNumber in a two-column form row (real browser)", () => {
  it("fits its column on a 360px phone", async () => {
    await page.viewport(360, 800);
    const { container } = render(
      <div className="p-4">
        <FormLayout>
          <FormLayout.Group condensed>
            <Field label="Weight">
              <InputNumber value={1.5} precision={1} unit="kg" onChange={() => {}} />
            </Field>
            <Field label="Stock">
              <InputNumber value={120} onChange={() => {}} />
            </Field>
          </FormLayout.Group>
        </FormLayout>
      </div>,
    );
    const fields = [...container.querySelectorAll<HTMLElement>("[data-slot=field]")];
    const numbers = [...container.querySelectorAll<HTMLElement>("[data-slot=input-number]")];
    expect(numbers).toHaveLength(2);
    // Side by side, each within its own column.
    expect(numbers[0]!.getBoundingClientRect().top).toBe(numbers[1]!.getBoundingClientRect().top);
    numbers.forEach((number, index) => {
      const field = fields[index]!.getBoundingClientRect();
      const rect = number.getBoundingClientRect();
      expect(rect.right).toBeLessThanOrEqual(field.right + 0.5);
      expect(Math.round(rect.width)).toBe(Math.round(field.width));
    });
    expect(numbers[1]!.getBoundingClientRect().right).toBeLessThanOrEqual(360 - 16 + 0.5);
  });
});

/* ------------------------------------------------------------------ */
/* Track contrast in light and dark                                     */
/* ------------------------------------------------------------------ */

/** sRGB channels of `color` painted over `base` (any CSS colour syntax, e.g. oklab()). */
function paint(color: string, base = "#ffffff"): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d")!;
  context.fillStyle = base;
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!];
}

function luminance([r, g, b]: [number, number, number]) {
  const [R, G, B] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!;
}

function contrast(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("Track surfaces are visible on cards in light and dark (real browser)", () => {
  for (const theme of ["light", "dark"] as const) {
    it(`${theme}: Progress, UsageBar, Steps, Slider and ScrollArea tracks`, async () => {
      const { container } = render(
        <div data-theme={theme} className="bg-background p-4">
          <div data-testid="card" className="flex flex-col gap-4 bg-card p-4">
            <Progress value={30} aria-label="Setup progress" />
            <UsageBar label="Products" value={30} max={100} />
            <Steps
              variant="progress"
              steps={[
                { name: "Details", status: "complete" },
                { name: "Payments", status: "current" },
                { name: "Launch", status: "upcoming" },
              ]}
            />
            <Slider aria-label="Opacity" defaultValue={[40]} />
            <ScrollArea className="h-16 w-40" type="always">
              <div className="h-64">Long content</div>
            </ScrollArea>
          </div>
        </div>,
      );
      await expect
        .poll(() => container.querySelector("[data-slot=scroll-area-thumb]"))
        .not.toBeNull();
      const card = getComputedStyle(container.querySelector("[data-testid=card]")!).backgroundColor;
      const cardLum = luminance(paint(card));
      const tracks = [
        container.querySelector("[data-slot=progress]")!,
        container.querySelector("[data-slot=usage-bar-track]")!,
        container.querySelector("[data-slot=steps-progress-track]")!,
        container.querySelector("[data-slot=scroll-area-thumb]")!,
      ];
      const min = theme === "light" ? 1.2 : 1.5;
      for (const track of tracks) {
        const color = getComputedStyle(track).backgroundColor;
        expect(
          contrast(luminance(paint(color, card)), cardLum),
          `${track.getAttribute("data-slot") ?? track.className}: ${color} on ${card}`,
        ).toBeGreaterThanOrEqual(min);
      }
      // The Slider track (foreground at 12%) was already legible; keep it so.
      const sliderTrack = [...container.querySelectorAll<HTMLElement>("[data-slot=slider] *")].find(
        (el) => el.className.includes("bg-foreground/[0.12]"),
      );
      if (sliderTrack) {
        const color = getComputedStyle(sliderTrack).backgroundColor;
        expect(contrast(luminance(paint(color, card)), cardLum)).toBeGreaterThanOrEqual(1.25);
      }
    });
  }
});
