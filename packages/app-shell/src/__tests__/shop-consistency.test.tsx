import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AppStatusBanner, type AppStatusBannerTone } from "../app-status-banner";

/** Tailwind's default palette names; components must use semantic tokens instead. */
const RAW_PALETTE =
  /(^|[\s:])(bg|text|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|ground)-\d/;

const classesOf = (root: Element) =>
  [root, ...Array.from(root.querySelectorAll("*"))]
    .map((el) => el.getAttribute("class") ?? "")
    .join(" ");

describe("AppStatusBanner tones", () => {
  const tones: AppStatusBannerTone[] = ["neutral", "info", "success", "warning", "danger"];

  it.each(tones)("%s uses semantic token surfaces only", (tone) => {
    const { container } = render(
      <AppStatusBanner
        tone={tone}
        title="Store is in preview"
        primaryAction={{ label: "Publish", onClick: () => {} }}
        secondaryAction={{ label: "Learn more", href: "/help" }}
        onDismiss={() => {}}
      />,
    );
    const banner = container.querySelector("[data-slot='app-status-banner']")!;
    expect(classesOf(banner)).not.toMatch(RAW_PALETTE);
  });

  it("warning is the token warning surface with its paired foreground", () => {
    const { container } = render(<AppStatusBanner tone="warning" title="Payments paused" />);
    expect(container.querySelector("[data-slot='app-status-banner']")).toHaveClass(
      "bg-warning",
      "text-warning-foreground",
    );
  });

  it("success tints with the success token and keeps a solid icon chip", () => {
    const { container } = render(<AppStatusBanner tone="success" title="Domain connected" />);
    const banner = container.querySelector("[data-slot='app-status-banner']")!;
    expect(banner).toHaveClass("bg-success/15", "text-foreground");
    expect(banner.querySelector("span[aria-hidden='true']")).toHaveClass(
      "bg-success",
      "text-success-foreground",
    );
  });
});
