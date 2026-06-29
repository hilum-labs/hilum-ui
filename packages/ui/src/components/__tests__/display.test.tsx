import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "../chart";
import { tokens } from "../../tokens/tokens";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardMedia,
} from "../card";
import { Avatar, AvatarFallback, AvatarImage, AvatarWithStatus } from "../avatar";
import { AvatarStack } from "../avatar-stack";
import { StatCard, StatCardGrid } from "../stat-card";
import { StatusTile, StatusTileGrid } from "../status-tile";
import { SummaryTile, SummaryTileGrid } from "../summary-tile";
import { TitledCard } from "../titled-card";
import { StatusBadge, statusBadgeVariantFor, statusLabel } from "../status-badge";
import { Notification } from "../notification";
import { MediaAssetGrid, MediaAssetGridItem } from "../media-asset-grid";
import { MediaAssetCard } from "../media-asset-card";
import { MediaObject } from "../media-object";

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("carries data-slot attribute", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveAttribute("data-slot", "card");
  });

  it("renders all variants without error", () => {
    const variants = ["default", "muted", "ghost", "responsive"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Card variant={variant}>Card</Card>);
      expect(screen.getByText("Card")).toBeInTheDocument();
      unmount();
    }
  });

  it("owns the responsive admin panel surface", () => {
    const { container } = render(<Card variant="responsive">Panel</Card>);
    expect(container.firstChild).toHaveClass("max-sm:rounded-none");
    expect(container.firstChild).toHaveClass("max-sm:border-x-0");
    expect(container.firstChild).toHaveClass("sm:rounded-xl");
  });

  it("composes sub-components correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders CardMedia", () => {
    const { container } = render(<CardMedia data-testid="media" />);
    expect(container.querySelector('[data-slot="card-media"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Avatar                                                               */
/* ------------------------------------------------------------------ */

describe("Avatar", () => {
  it("renders with fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders all sizes without error", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    for (const size of sizes) {
      const { unmount } = render(
        <Avatar size={size}>
          <AvatarFallback>X</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("X")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders AvatarImage with alt text", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    // AvatarFallback shows when image fails — just check it's in the DOM
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

describe("AvatarWithStatus", () => {
  it("renders children", () => {
    render(
      <AvatarWithStatus>
        <AvatarFallback>AB</AvatarFallback>
      </AvatarWithStatus>,
    );
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders status indicator when status is provided", () => {
    const statuses = ["online", "offline", "busy", "away"] as const;
    for (const status of statuses) {
      const { unmount } = render(
        <AvatarWithStatus status={status}>
          <AvatarFallback>X</AvatarFallback>
        </AvatarWithStatus>,
      );
      expect(screen.getByText("X")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* AvatarStack                                                          */
/* ------------------------------------------------------------------ */

describe("AvatarStack", () => {
  const avatars = [{ name: "Alice" }, { name: "Bob" }, { name: "Carol" }];

  it("renders all avatars by default", () => {
    render(<AvatarStack avatars={avatars} />);
    expect(screen.getByTitle("Alice")).toBeInTheDocument();
    expect(screen.getByTitle("Bob")).toBeInTheDocument();
    expect(screen.getByTitle("Carol")).toBeInTheDocument();
  });

  it("shows overflow count when max is set", () => {
    render(<AvatarStack avatars={avatars} max={2} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders all sizes without error", () => {
    const sizes = ["sm", "md", "lg"] as const;
    for (const size of sizes) {
      const { unmount } = render(<AvatarStack avatars={[{ name: "A" }]} size={size} />);
      expect(screen.getByTitle("A")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* StatCard                                                             */
/* ------------------------------------------------------------------ */

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total Users" value="1,234" />);
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders trend when provided", () => {
    render(<StatCard label="Revenue" value="$10k" trend={{ value: "+12%", direction: "up" }} />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders all trend directions without error", () => {
    const directions = ["up", "down", "neutral"] as const;
    for (const direction of directions) {
      const { unmount } = render(
        <StatCard label="L" value="V" trend={{ value: "5%", direction }} />,
      );
      expect(screen.getByText("5%")).toBeInTheDocument();
      unmount();
    }
  });

  it("supports a responsive flat-mobile surface", () => {
    const { container } = render(
      <StatCard label="Total users" value="1,234" variant="responsive" />,
    );
    expect(container.querySelector('[data-slot="stat-card"]')).toHaveClass(
      "bg-transparent",
      "sm:rounded-xl",
      "sm:border",
      "sm:bg-card",
      "sm:shadow-natural",
    );
  });

  it("renders empty grid slots for configurable dashboards", () => {
    const { container } = render(
      <StatCardGrid maxSlots={3} showEmptySlots>
        <StatCard label="Revenue" value="$10k" />
      </StatCardGrid>,
    );

    expect(container.querySelector('[data-slot="stat-card-grid"]')).toHaveClass(
      "grid",
      "grid-cols-2",
    );
    expect(screen.getAllByRole("button", { name: "Add card" })).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------ */
/* TitledCard                                                           */
/* ------------------------------------------------------------------ */

describe("TitledCard", () => {
  it("renders title, subtitle, content, and actions", () => {
    render(
      <TitledCard
        title="Shipping zones"
        subtitle="Configured geographic regions"
        actionButtons={<button type="button">Add</button>}
      >
        <p>Zone list</p>
      </TitledCard>,
    );

    expect(screen.getByText("Shipping zones")).toBeInTheDocument();
    expect(screen.getByText("Configured geographic regions")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("Zone list")).toBeInTheDocument();
  });

  it("uses mobile flat-card classes for dense dashboard lists", () => {
    const { container } = render(<TitledCard title="Orders">Rows</TitledCard>);

    expect(container.querySelector('[data-slot="titled-card"]')).toHaveClass(
      "max-sm:rounded-none",
      "max-sm:border-0",
      "max-sm:bg-transparent",
      "max-sm:shadow-none",
    );
  });

  it("can flush content padding on mobile", () => {
    const { container } = render(
      <TitledCard title="Configuration center" contentPadding="flush-mobile">
        Rows
      </TitledCard>,
    );

    expect(container.querySelector('[data-slot="card-content"]')).toHaveClass("p-0", "sm:p-5");
  });
});

/* ------------------------------------------------------------------ */
/* SummaryTile                                                          */
/* ------------------------------------------------------------------ */

describe("SummaryTile", () => {
  it("renders compact title, value, and description", () => {
    render(
      <SummaryTile
        title="Automations"
        value="Active"
        description="Abandoned checkout and post-purchase flows."
      />,
    );

    expect(screen.getByText("Automations")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Abandoned checkout and post-purchase flows.")).toBeInTheDocument();
  });

  it("renders a responsive flat-mobile summary grid", () => {
    const { container } = render(
      <SummaryTileGrid columns={3}>
        <SummaryTile title="SEO" value="Ready" />
      </SummaryTileGrid>,
    );

    expect(container.querySelector('[data-slot="summary-tile-grid"]')).toHaveClass(
      "divide-y",
      "md:grid",
      "xl:grid-cols-3",
    );
    expect(container.querySelector('[data-slot="summary-tile"]')).toHaveClass(
      "py-4",
      "md:rounded-lg",
      "md:border",
      "md:bg-card",
    );
  });
});

/* ------------------------------------------------------------------ */
/* StatusTile                                                          */
/* ------------------------------------------------------------------ */

describe("StatusTile", () => {
  it("renders title, status badge, description, and meta", () => {
    render(
      <StatusTile
        title="Renderer"
        status="healthy"
        description="operational"
        meta={<span>https://renderer.internal/ready</span>}
      />,
    );

    expect(screen.getByText("Renderer")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("operational")).toBeInTheDocument();
    expect(screen.getByText("https://renderer.internal/ready")).toBeInTheDocument();
  });

  it("renders a responsive flat-mobile status grid", () => {
    const { container } = render(
      <StatusTileGrid columns={3}>
        <StatusTile title="Catalog" status="healthy" />
      </StatusTileGrid>,
    );

    expect(container.querySelector('[data-slot="status-tile-grid"]')).toHaveClass(
      "divide-y",
      "md:grid",
      "xl:grid-cols-3",
    );
    expect(container.querySelector('[data-slot="status-tile"]')).toHaveClass(
      "py-4",
      "md:rounded-lg",
      "md:border",
      "md:bg-background",
    );
  });
});

/* ------------------------------------------------------------------ */
/* StatusBadge                                                          */
/* ------------------------------------------------------------------ */

describe("StatusBadge", () => {
  it("formats status labels", () => {
    render(<StatusBadge status="held_for_review" />);
    expect(screen.getByText("Held For Review")).toBeInTheDocument();
  });

  it("maps common statuses to badge variants", () => {
    expect(statusBadgeVariantFor("active")).toBe("success");
    expect(statusBadgeVariantFor("pending")).toBe("warning");
    expect(statusBadgeVariantFor("draft")).toBe("secondary");
    expect(statusBadgeVariantFor("failed")).toBe("destructive");
    expect(statusBadgeVariantFor("custom")).toBe("outline");
  });

  it("accepts custom variant and label maps", () => {
    render(
      <StatusBadge
        status="queued"
        variantMap={{ queued: "warning" }}
        labelMap={{ queued: "Waiting" }}
      />,
    );

    expect(screen.getByText("Waiting")).toBeInTheDocument();
  });

  it("renders a compact status dot", () => {
    const { container } = render(<StatusBadge status="healthy" showDot />);
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass("rounded-full");
  });

  it("exports label helper", () => {
    expect(statusLabel("dead-letter")).toBe("Dead Letter");
  });
});

/* ------------------------------------------------------------------ */
/* Notification                                                         */
/* ------------------------------------------------------------------ */

describe("Notification", () => {
  it("renders title", () => {
    render(<Notification title="File uploaded" />);
    expect(screen.getByText("File uploaded")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<Notification title="Done" description="Your export is ready." />);
    expect(screen.getByText("Your export is ready.")).toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    render(<Notification title="Alert" onClose={() => {}} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <Notification
        title="Update available"
        actions={[{ label: "Install" }, { label: "Dismiss", variant: "ghost" }]}
      />,
    );
    expect(screen.getByText("Install")).toBeInTheDocument();
    expect(screen.getByText("Dismiss")).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = ["default", "success", "error", "warning", "info"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Notification title="T" variant={variant} />);
      expect(screen.getByText("T")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* MediaObject                                                          */
/* ------------------------------------------------------------------ */

describe("MediaObject", () => {
  it("renders media and content", () => {
    render(
      <MediaObject media={<img alt="thumb" src="" />}>
        <p>Content text</p>
      </MediaObject>,
    );
    expect(screen.getByAltText("thumb")).toBeInTheDocument();
    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it('renders mediaPosition="right" without error', () => {
    render(
      <MediaObject media={<span>icon</span>} mediaPosition="right">
        Content
      </MediaObject>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders all gap options without error", () => {
    const gaps = ["sm", "md", "lg"] as const;
    for (const gap of gaps) {
      const { unmount } = render(
        <MediaObject media={<span />} gap={gap}>
          Body
        </MediaObject>,
      );
      expect(screen.getByText("Body")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* MediaAssetCard                                                       */
/* ------------------------------------------------------------------ */

describe("MediaAssetCard", () => {
  it("renders media assets in a responsive semantic list", () => {
    render(
      <MediaAssetGrid columns={5}>
        <MediaAssetGridItem>
          <MediaAssetCard name="hero.png" meta="24 KB" />
        </MediaAssetGridItem>
        <MediaAssetGridItem>
          <MediaAssetCard name="catalog.csv" meta="2 KB" mediaType="file" />
        </MediaAssetGridItem>
      </MediaAssetGrid>,
    );

    expect(screen.getByRole("list")).toHaveClass("divide-y", "sm:grid", "xl:grid-cols-5");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("hero.png")).toBeInTheDocument();
    expect(screen.getByText("catalog.csv")).toBeInTheDocument();
  });

  it("renders image media, name, and meta", () => {
    render(
      <MediaAssetCard
        name="hero.png"
        src="https://cdn.example.com/hero.png"
        alt="Hero"
        meta="24 KB"
      />,
    );

    expect(screen.getByAltText("Hero")).toHaveAttribute("src", "https://cdn.example.com/hero.png");
    expect(screen.getByText("hero.png")).toBeInTheDocument();
    expect(screen.getByText("24 KB")).toBeInTheDocument();
  });

  it("renders file fallback without an image source", () => {
    const { container } = render(<MediaAssetCard name="catalog.csv" meta="2 KB" />);

    expect(screen.getByText("catalog.csv")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<MediaAssetCard name="hero.png" actions={<button type="button">Copy URL</button>} />);

    expect(screen.getByRole("button", { name: "Copy URL" })).toBeInTheDocument();
  });

  it("calls onSelect from the media surface", () => {
    const onSelect = vi.fn();
    render(<MediaAssetCard name="hero.png" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "hero.png" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("marks selected cards", () => {
    const { container } = render(<MediaAssetCard name="hero.png" selected />);

    expect(container.querySelector("[data-slot='media-asset-card']")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Chart                                                                */
/* ------------------------------------------------------------------ */

describe("CHART_COLORS", () => {
  it("primary matches current semantic primary token", () => {
    expect(CHART_COLORS.primary).toBe(tokens.semantic.light.primary);
  });

  it("secondary matches success token (lime)", () => {
    expect(CHART_COLORS.secondary).toBe(tokens.semantic.light.success);
  });

  it("tertiary matches current semantic warning token", () => {
    expect(CHART_COLORS.tertiary).toBe(tokens.semantic.light.warning);
  });

  it("does not contain legacy orange brand color", () => {
    expect(Object.values(CHART_COLORS)).not.toContain("#FF4D01");
  });
});

describe("ChartContainer", () => {
  it("renders the outer wrapper div", () => {
    const { container } = render(
      <ChartContainer>
        <div />
      </ChartContainer>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards className to wrapper div", () => {
    const { container } = render(
      <ChartContainer className="my-chart">
        <div />
      </ChartContainer>,
    );
    expect(container.firstChild).toHaveClass("my-chart");
  });
});

describe("ChartTooltip", () => {
  it("returns null when not active", () => {
    const { container } = render(<ChartTooltip active={false} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders payload entries when active", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = [{ name: "Revenue", value: 1200, color: "#c100f1" }] as any;
    render(<ChartTooltip active payload={payload} label="Jan" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText("Jan")).toBeInTheDocument();
  });
});
