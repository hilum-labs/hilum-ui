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
import { StatCard } from "../stat-card";
import { Notification } from "../notification";
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
    const variants = ["default", "muted", "ghost"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Card variant={variant}>Card</Card>);
      expect(screen.getByText("Card")).toBeInTheDocument();
      unmount();
    }
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
