import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";
import { Callout } from "../callout";
import { Button } from "../button";
import { Progress } from "../progress";
import { Steps } from "../steps";
import { ThinkingIndicator } from "../thinking-indicator";
import { ThinkingSteps } from "../thinking-steps";
import { EmptyState } from "../empty-state";
import { StatusBadge } from "../status-badge";
import {
  UrlRedirectPrompt,
  hasUrlHandleChanged,
  normalizeUrlHandle,
  urlResourcePath,
} from "../url-redirect-prompt";
import type { Step } from "../steps";

/* ------------------------------------------------------------------ */
/* Alert                                                                */
/* ------------------------------------------------------------------ */

describe("Alert", () => {
  it('renders with role="alert"', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders sub-components together", () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = ["default", "info", "success", "warning", "destructive"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Alert variant={variant}>Alert</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* Callout                                                              */
/* ------------------------------------------------------------------ */

describe("Callout", () => {
  it("renders title and description", () => {
    render(<Callout title="Redirect recommended" description="Preserve old links." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Redirect recommended")).toBeInTheDocument();
    expect(screen.getByText("Preserve old links.")).toBeInTheDocument();
  });

  it("uses alert role for destructive tone by default", () => {
    render(<Callout tone="destructive" title="Could not load products" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders icon, children, and actions", () => {
    render(
      <Callout
        icon={<span data-testid="icon" />}
        title="Review hold"
        actions={<Button size="sm">Resolve</Button>}
      >
        <span>2 orders need attention.</span>
      </Callout>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("2 orders need attention.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resolve" })).toBeInTheDocument();
  });

  it("renders all tones without error", () => {
    const tones = ["default", "info", "success", "warning", "destructive"] as const;
    for (const tone of tones) {
      const { unmount } = render(<Callout tone={tone} title={`${tone} callout`} />);
      expect(screen.getByText(`${tone} callout`)).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* StatusBadge                                                          */
/* ------------------------------------------------------------------ */

describe("StatusBadge", () => {
  it("renders an icon from an icon map", () => {
    function CheckIcon({ className }: { className?: string }) {
      return <svg data-testid="status-icon" className={className} />;
    }

    render(<StatusBadge status="confirmed" iconMap={{ confirmed: CheckIcon }} />);

    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* UrlRedirectPrompt                                                    */
/* ------------------------------------------------------------------ */

describe("UrlRedirectPrompt", () => {
  it("normalizes handles and builds resource paths", () => {
    expect(normalizeUrlHandle("/summer-sale/")).toBe("summer-sale");
    expect(urlResourcePath("/products/", "/linen-shirt/")).toBe("/products/linen-shirt");
  });

  it("detects changed handles only when both handles are present", () => {
    expect(hasUrlHandleChanged("old", "new")).toBe(true);
    expect(hasUrlHandleChanged("old", "old")).toBe(false);
    expect(hasUrlHandleChanged("", "new")).toBe(false);
  });

  it("does not render when the handle is unchanged", () => {
    const { container } = render(
      <UrlRedirectPrompt
        originalHandle="linen-shirt"
        nextHandle="linen-shirt"
        pathPrefix="products"
        checked
        onCheckedChange={() => undefined}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders old and new paths with a switch", () => {
    const onCheckedChange = vi.fn();
    render(
      <UrlRedirectPrompt
        originalHandle="linen-shirt"
        nextHandle="linen-shirt-v2"
        pathPrefix="products"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("/products/linen-shirt")).toBeInTheDocument();
    expect(screen.getByText("/products/linen-shirt-v2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Create URL redirect" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

/* ------------------------------------------------------------------ */
/* Progress                                                             */
/* ------------------------------------------------------------------ */

describe("Progress", () => {
  it("renders with a progressbar role", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("reflects the correct value", () => {
    render(<Progress value={75} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders at 0%", () => {
    render(<Progress value={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders at 100%", () => {
    render(<Progress value={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});

/* ------------------------------------------------------------------ */
/* Steps                                                                */
/* ------------------------------------------------------------------ */

const STEPS: Step[] = [
  { name: "Cart", status: "complete" },
  { name: "Shipping", status: "current" },
  { name: "Payment", status: "upcoming" },
];

describe("Steps", () => {
  it("renders all step names in circles variant (default)", () => {
    render(<Steps steps={STEPS} />);
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("renders bullets variant without error", () => {
    render(<Steps steps={STEPS} variant="bullets" />);
    expect(screen.getByRole("navigation", { name: /progress/i })).toBeInTheDocument();
  });

  it("renders progress variant without error", () => {
    render(<Steps steps={STEPS} variant="progress" />);
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("bullets variant shows step count", () => {
    render(<Steps steps={STEPS} variant="bullets" />);
    expect(screen.getByText(/Step 2 of 3/i)).toBeInTheDocument();
  });

  it("bullets variant: dots carry aria-labels describing status", () => {
    render(<Steps steps={STEPS} variant="bullets" />);
    expect(screen.getByLabelText(/Cart: completed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shipping: current step/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment: upcoming/i)).toBeInTheDocument();
  });

  it("renders with descriptions in circles variant", () => {
    const stepsWithDesc: Step[] = [
      { name: "Step 1", description: "First step", status: "complete" },
      { name: "Step 2", status: "current" },
    ];
    render(<Steps steps={stepsWithDesc} />);
    expect(screen.getByText("First step")).toBeInTheDocument();
  });
});

describe("ThinkingIndicator", () => {
  it("renders an accessible status", () => {
    render(<ThinkingIndicator label="Working" />);
    expect(screen.getByRole("status", { name: "Working" })).toBeInTheDocument();
  });
});

describe("ThinkingSteps", () => {
  it("renders reasoning steps with status content", () => {
    render(
      <ThinkingSteps
        steps={[
          { label: "Read request", status: "complete" },
          { label: "Draft response", status: "current" },
        ]}
      />,
    );

    expect(screen.getByText("Read request")).toBeInTheDocument();
    expect(screen.getByText("Draft response")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* EmptyState                                                           */
/* ------------------------------------------------------------------ */

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="Try a different search." />);
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("renders action button with label", () => {
    render(<EmptyState title="Empty" action={{ label: "Add item" }} />);
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("renders action as anchor when href is provided", () => {
    render(<EmptyState title="Empty" action={{ label: "Create", href: "/new" }} />);
    expect(screen.getByRole("link", { name: "Create" })).toHaveAttribute("href", "/new");
  });

  it("renders icon when provided", () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">📭</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
