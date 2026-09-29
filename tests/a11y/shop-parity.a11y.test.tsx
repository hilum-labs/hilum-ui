/**
 * Accessibility smoke tests for the components added for Hilum Shop parity
 * (SetupGuide, TimeSeriesChart, Thumbnail, FontPicker). Same approach as
 * ui.a11y.test.tsx: realistic, labelled usage checked with axe-core.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "../axe";

import { SetupGuide } from "../../packages/ui/src/components/setup-guide";
import { TimeSeriesChart } from "../../packages/ui/src/components/time-series-chart";
import { Thumbnail } from "../../packages/ui/src/components/thumbnail";
import { FontPicker } from "../../packages/designer/src/components/FontPicker";

async function expectAccessible(ui: React.ReactElement) {
  render(ui);
  expect(await axe(document.body)).toHaveNoAxeViolations();
}

describe("a11y: shop parity components", () => {
  it("SetupGuide", async () => {
    await expectAccessible(
      <SetupGuide
        title="Set up your store"
        description="Finish these steps to start selling."
        groups={[
          { id: "required", title: "Required" },
          { id: "recommended", title: "Recommended" },
        ]}
        tasks={[
          { id: "product", title: "Add a product", complete: true, group: "required" },
          {
            id: "payments",
            title: "Set up payments",
            description: "Connect a payment provider to accept orders.",
            complete: false,
            group: "required",
            action: { label: "Set up payments", href: "/settings/payments" },
          },
          {
            id: "domain",
            title: "Connect a domain",
            complete: false,
            group: "recommended",
            action: { label: "Connect domain", onAction: () => {} },
          },
        ]}
      />,
    );
  });

  it("TimeSeriesChart", async () => {
    await expectAccessible(
      <TimeSeriesChart
        aria-label="Total sales over the last 3 days"
        data={[
          { date: "2026-09-01", sales: 12000 },
          { date: "2026-09-02", sales: 18000 },
          { date: "2026-09-03", sales: 9000 },
        ]}
        series={[{ key: "sales", label: "Total sales" }]}
        valueFormat="currency"
        currency="USD"
        minorUnits
      />,
    );
  });

  it("TimeSeriesChart while loading and when empty", async () => {
    await expectAccessible(
      <div>
        <TimeSeriesChart
          aria-label="Total sales"
          data={[]}
          series={[{ key: "sales", label: "Total sales" }]}
          loading
        />
        <TimeSeriesChart
          aria-label="Orders"
          data={[]}
          series={[{ key: "orders", label: "Orders" }]}
        />
      </div>,
    );
  });

  it("Thumbnail with and without an image", async () => {
    await expectAccessible(
      <div>
        <Thumbnail src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Black T-shirt" size="md" />
        <Thumbnail src={null} alt="Product without an image" size="sm" />
      </div>,
    );
  });

  it("FontPicker", async () => {
    await expectAccessible(
      <div>
        <label htmlFor="heading-font">Heading font</label>
        <FontPicker
          id="heading-font"
          fonts={[
            { family: "Inter", category: "sans-serif", weights: [400, 600] },
            { family: "Fraunces", category: "serif" },
          ]}
          value="Inter"
          onChange={() => {}}
        />
      </div>,
    );
  });
});
