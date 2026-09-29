import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimeSeriesChart } from "../time-series-chart";
import { FormatProvider } from "../../lib/format";

const data = [
  { date: "2026-09-01", sales: 1200, previous: 900 },
  { date: "2026-09-02", sales: 800, previous: 1000 },
  { date: "2026-09-03", sales: 1500, previous: 1100 },
];

describe("TimeSeriesChart", () => {
  it("renders a labelled figure with series colours as custom properties", () => {
    const { container } = render(
      <TimeSeriesChart
        aria-label="Total sales over time"
        data={data}
        series={[
          { key: "sales", label: "Total sales" },
          { key: "previous", label: "Previous period", dashed: true, color: "var(--border)" },
        ]}
        valueFormat="currency"
        currency="PEN"
      />,
    );
    expect(screen.getByRole("figure", { name: "Total sales over time" })).toBeInTheDocument();
    const chart = container.querySelector<HTMLElement>("[data-slot='chart']")!;
    expect(chart.style.getPropertyValue("--color-sales")).toBe("var(--primary)");
    expect(chart.style.getPropertyValue("--color-previous")).toBe("var(--border)");
    expect(chart.style.height).toBe("240px");
    // Two series: a legend, the comparison drawn dashed.
    const legend = container.querySelector("[data-slot='time-series-chart-legend']")!;
    expect(legend).toHaveTextContent("Total sales");
    expect(legend).toHaveTextContent("Previous period");
    expect(container.querySelectorAll("style")).toHaveLength(0);
  });

  it("hides the legend for a single series unless asked", () => {
    const { container, rerender } = render(
      <TimeSeriesChart
        aria-label="Orders"
        data={data}
        series={[{ key: "sales", label: "Orders" }]}
      />,
    );
    expect(container.querySelector("[data-slot='time-series-chart-legend']")).toBeNull();
    rerender(
      <TimeSeriesChart
        aria-label="Orders"
        data={data}
        series={[{ key: "sales", label: "Orders" }]}
        showLegend
      />,
    );
    expect(container.querySelector("[data-slot='time-series-chart-legend']")).not.toBeNull();
  });

  it("shows a loading skeleton", () => {
    render(
      <TimeSeriesChart
        aria-label="Sales"
        data={[]}
        series={[{ key: "sales", label: "Sales" }]}
        loading
        height={180}
      />,
    );
    const status = screen.getByRole("status", { name: "Loading chart" });
    expect(status.firstElementChild).toHaveStyle({ height: "180px" });
  });

  it("shows an empty state when there are no points (or no valid dates)", () => {
    const { rerender } = render(
      <TimeSeriesChart aria-label="Sales" data={[]} series={[{ key: "sales", label: "Sales" }]} />,
    );
    expect(screen.getByText("No data for this period")).toBeInTheDocument();
    rerender(
      <TimeSeriesChart
        aria-label="Sales"
        data={[{ date: "not a date", sales: 1 }]}
        series={[{ key: "sales", label: "Sales" }]}
        emptyState={<span>Make your first sale</span>}
      />,
    );
    expect(screen.getByText("Make your first sale")).toBeInTheDocument();
  });

  it("labels are localizable", () => {
    render(
      <FormatProvider locale="es-PE" currency="PEN">
        <TimeSeriesChart
          aria-label="Ventas"
          data={[]}
          series={[{ key: "sales", label: "Ventas" }]}
          labels={{ empty: "Sin datos para este periodo" }}
        />
      </FormatProvider>,
    );
    expect(screen.getByText("Sin datos para este periodo")).toBeInTheDocument();
  });
});
