import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../collapsible";
import { Toggle } from "../toggle";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

/* ------------------------------------------------------------------ */
/* Accordion                                                            */
/* ------------------------------------------------------------------ */

describe("Accordion", () => {
  function TestAccordion() {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  it("renders all trigger labels", () => {
    render(<TestAccordion />);
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
  });

  it("expands item on trigger click", async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);
    const triggerA = screen.getByText("Section A");
    await user.click(triggerA);
    expect(screen.getByText("Content A")).toBeVisible();
  });

  it("renders multiple type without error", () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="x">
          <AccordionTrigger>X</AccordionTrigger>
          <AccordionContent>X content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("X")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Tabs                                                                 */
/* ------------------------------------------------------------------ */

describe("Tabs", () => {
  function TestTabs() {
    return (
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Panel 1</TabsContent>
        <TabsContent value="tab2">Panel 2</TabsContent>
      </Tabs>
    );
  }

  it("renders tab triggers", () => {
    render(<TestTabs />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
  });

  it("shows the default tab panel", () => {
    render(<TestTabs />);
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("switches to second tab on click", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Panel 2")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Collapsible                                                          */
/* ------------------------------------------------------------------ */

describe("Collapsible", () => {
  it("renders trigger and content", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Toggle")).toBeInTheDocument();
  });

  it("renders as open by default when defaultOpen is set", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Show</CollapsibleTrigger>
        <CollapsibleContent>Visible</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Toggle                                                               */
/* ------------------------------------------------------------------ */

describe("Toggle", () => {
  it("renders as a button", () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("renders all variants without error", () => {
    const variants = ["default", "outline", "brand"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Toggle variant={variant}>V</Toggle>);
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    }
  });

  it("renders all sizes without error", () => {
    const sizes = ["sm", "default", "lg", "icon", "icon-sm", "icon-lg"] as const;
    for (const size of sizes) {
      const { unmount } = render(<Toggle size={size}>S</Toggle>);
      expect(screen.getByRole("button")).toBeInTheDocument();
      unmount();
    }
  });

  it("toggles pressed state on click", async () => {
    const user = userEvent.setup();
    render(<Toggle>B</Toggle>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-state", "off");
    await user.click(btn);
    expect(btn).toHaveAttribute("data-state", "on");
  });
});

/* ------------------------------------------------------------------ */
/* ToggleGroup                                                          */
/* ------------------------------------------------------------------ */

describe("ToggleGroup", () => {
  // Radix ToggleGroup type="single" uses role="radio" per the ARIA toggle button pattern.
  // type="multiple" uses role="button".

  it("renders items (type=single → role=radio)", () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByText("Bold")).toBeInTheDocument();
    expect(screen.getByText("Italic")).toBeInTheDocument();
  });

  it("activates item on click (type=single)", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Format A</ToggleGroupItem>
      </ToggleGroup>,
    );
    const item = screen.getByRole("radio", { name: "Format A" });
    await user.click(item);
    expect(item).toHaveAttribute("data-state", "on");
  });

  it("supports multiple selection (type=multiple → role=button)", () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="x">X</ToggleGroupItem>
        <ToggleGroupItem value="y">Y</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
