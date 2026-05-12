import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";
import { Badge } from "../badge";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Label } from "../label";
import { Spinner } from "../spinner";
import { Skeleton } from "../skeleton";
import { Separator } from "../separator";
import { Kbd } from "../kbd";

/* ------------------------------------------------------------------ */
/* Button                                                               */
/* ------------------------------------------------------------------ */

describe("Button", () => {
  it("renders as a button element by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("forwards data-slot attribute", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("renders all variants without error", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "brand",
      "ghost",
      "link",
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>Btn</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders all sizes without error", () => {
    const sizes = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const;
    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>B</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/* Badge                                                                */
/* ------------------------------------------------------------------ */

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = [
      "default",
      "secondary",
      "outline",
      "brand",
      "success",
      "warning",
      "destructive",
    ] as const;
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>v</Badge>);
      expect(screen.getByText("v")).toBeInTheDocument();
      unmount();
    }
  });

  it("forwards className", () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});

/* ------------------------------------------------------------------ */
/* Input                                                                */
/* ------------------------------------------------------------------ */

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("carries data-slot attribute", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });

  it("accepts a placeholder", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/* Textarea                                                             */
/* ------------------------------------------------------------------ */

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("carries data-slot attribute", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "textarea");
  });

  it("accepts placeholder", () => {
    render(<Textarea placeholder="Write here" />);
    expect(screen.getByPlaceholderText("Write here")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Label                                                                */
/* ------------------------------------------------------------------ */

describe("Label", () => {
  it("renders label text", () => {
    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("associates with an input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="input-id">Name</Label>
        <input id="input-id" />
      </>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Spinner                                                              */
/* ------------------------------------------------------------------ */

describe("Spinner", () => {
  it('renders with role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("renders all sizes without error", () => {
    const sizes = ["xs", "sm", "default", "lg", "xl"] as const;
    for (const size of sizes) {
      const { unmount } = render(<Spinner size={size} />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* Skeleton                                                             */
/* ------------------------------------------------------------------ */

describe("Skeleton", () => {
  it("renders a div with data-slot", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("data-slot", "skeleton");
  });

  it("forwards className", () => {
    const { container } = render(<Skeleton className="w-24 h-4" />);
    expect(container.firstChild).toHaveClass("w-24", "h-4");
  });
});

/* ------------------------------------------------------------------ */
/* Separator                                                            */
/* ------------------------------------------------------------------ */

describe("Separator", () => {
  it("renders a separator with role", () => {
    render(<Separator />);
    expect(screen.getByRole("none")).toBeInTheDocument();
  });

  it("renders horizontal orientation without error", () => {
    const { unmount } = render(<Separator orientation="horizontal" />);
    expect(screen.getByRole("none")).toBeInTheDocument();
    unmount();
  });

  it("renders vertical orientation without error", () => {
    const { unmount } = render(<Separator orientation="vertical" />);
    expect(screen.getByRole("none")).toBeInTheDocument();
    unmount();
  });
});

/* ------------------------------------------------------------------ */
/* Kbd                                                                  */
/* ------------------------------------------------------------------ */

describe("Kbd", () => {
  it("renders keyboard shortcut text", () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("renders as kbd element", () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    expect(container.querySelector("kbd")).toBeInTheDocument();
  });
});
