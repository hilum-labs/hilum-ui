/**
 * Callout text and icons meet WCAG AA in every tone and theme, on every
 * surface a callout sits on, with the real tokens.css. The description was
 * muted gray, 4.49:1 on the info tint and 4.39:1 on the success tint in
 * light mode; mid's pale tints lightened the gray under white text.
 */
import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { Info } from "lucide-react";
import { Callout } from "@hilum/ui";
import { textContrast } from "./contrast";

const THEMES = ["light", "mid", "dark"] as const;
const TONES = ["default", "info", "success", "warning", "destructive"] as const;
// Literal class names so Tailwind generates them.
const SURFACES = {
  background: "bg-background",
  card: "bg-card",
  surface: "bg-surface",
  muted: "bg-muted",
} as const;

const cases = THEMES.flatMap((theme) =>
  TONES.flatMap((tone) =>
    (Object.keys(SURFACES) as (keyof typeof SURFACES)[]).map(
      (surface) => [theme, tone, surface] as const,
    ),
  ),
);

describe("Callout contrast (real browser)", () => {
  test.each(cases)("%s theme, %s tone, on %s", async (theme, tone, surface) => {
    const { container } = render(
      <div data-theme={theme} className="text-foreground">
        <div className={`${SURFACES[surface]} p-4`}>
          <Callout
            tone={tone}
            icon={<Info data-testid="icon" />}
            title="Payouts are paused"
            description="Add a bank account to resume payouts."
            actions={<a href="#billing">Review</a>}
          />
        </div>
      </div>,
    );
    const title = screen.getByText("Payouts are paused");
    const description = screen.getByText("Add a bank account to resume payouts.");
    const icon = screen.getByTestId("icon");
    expect(textContrast(title), "title").toBeGreaterThanOrEqual(4.5);
    expect(textContrast(description), "description").toBeGreaterThanOrEqual(4.5);
    // The icon against its chip (WCAG 1.4.11 non-text contrast).
    expect(textContrast(icon.parentElement!), "icon").toBeGreaterThanOrEqual(3);

    const results = await axe.run(container, {
      runOnly: { type: "rule", values: ["color-contrast"] },
      resultTypes: ["violations"],
    });
    expect(
      results.violations.flatMap((v) =>
        v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary}`),
      ),
    ).toEqual([]);
  });
});
