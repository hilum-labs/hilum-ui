import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";
import { Progress } from "../progress";
import { Steps } from "../steps";
import { EmptyState } from "../empty-state";
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

  it("renders with descriptions in circles variant", () => {
    const stepsWithDesc: Step[] = [
      { name: "Step 1", description: "First step", status: "complete" },
      { name: "Step 2", status: "current" },
    ];
    render(<Steps steps={stepsWithDesc} />);
    expect(screen.getByText("First step")).toBeInTheDocument();
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
