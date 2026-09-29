import { render, screen } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { FormatProvider, TimeSeriesChart } from "@hilum/ui";

const data = Array.from({ length: 7 }, (_, i) => ({
  date: `2026-09-0${i + 1}`,
  sales: [1200, 800, 1500, 0, 2400, 1900, 2100][i]!,
  previous: [900, 1000, 1100, 700, 1600, 1500, 1800][i]!,
}));

describe("TimeSeriesChart (real browser)", () => {
  test("draws dated x ticks, money y ticks and a formatted tooltip, with no runtime <style>", async () => {
    await page.viewport(900, 700);
    const styles = document.querySelectorAll("style").length;
    render(
      <FormatProvider locale="en-US" currency="USD">
        <div style={{ width: 640 }}>
          <TimeSeriesChart
            aria-label="Total sales over time"
            data={data}
            series={[
              { key: "sales", label: "Total sales" },
              { key: "previous", label: "Previous period", dashed: true },
            ]}
            valueFormat="currency"
          />
        </div>
      </FormatProvider>,
    );
    const figure = screen.getByRole("figure", { name: "Total sales over time" });
    await expect.poll(() => figure.querySelectorAll(".recharts-area").length).toBe(2);
    const ticks = Array.from(figure.querySelectorAll(".recharts-cartesian-axis-tick-value")).map(
      (t) => t.textContent,
    );
    expect(ticks).toContain("Sep 1");
    expect(ticks.some((t) => /^\$\d/.test(t ?? ""))).toBe(true);
    // Series colour resolves from the token through the custom property.
    const stroke = getComputedStyle(figure.querySelector(".recharts-area-curve")!).stroke;
    const probe = document.createElement("span");
    probe.style.color = "var(--primary)";
    figure.append(probe);
    expect(stroke).toBe(getComputedStyle(probe).color);

    const surface = figure.querySelector(".recharts-surface")!.getBoundingClientRect();
    await userEvent.hover(figure.querySelector(".recharts-surface")!, {
      position: { x: surface.width / 2, y: surface.height / 2 },
    });
    const tooltip = await screen.findByText("Total sales", {
      selector: "[data-slot='time-series-chart-tooltip'] span",
    });
    const box = tooltip.closest("[data-slot='time-series-chart-tooltip']")!;
    expect(box.textContent).toMatch(/Sep \d, 2026/);
    expect(box.textContent).toMatch(/\$[\d,]+\.\d{2}/);
    expect(document.querySelectorAll("style")).toHaveLength(styles);
  });
});
