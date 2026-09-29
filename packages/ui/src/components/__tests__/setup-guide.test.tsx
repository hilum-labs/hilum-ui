import { describe, it, expect, vi } from "vitest";
import type * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SetupGuide, type SetupGuideTask } from "../setup-guide";
import { LinkProvider } from "../../lib/link-context";

const tasks: SetupGuideTask[] = [
  { id: "product", title: "Add your first product", complete: true, group: "required" },
  {
    id: "theme",
    title: "Customize your online store",
    description: "Choose a theme and add your logo.",
    complete: false,
    group: "required",
    action: { label: "Customize theme", href: "/themes" },
    secondaryAction: { label: "Learn more", href: "https://help.example.com", external: true },
  },
  {
    id: "domain",
    title: "Add a custom domain",
    complete: false,
    group: "recommended",
    action: { label: "Add domain", onAction: vi.fn() },
  },
];

const groups = [
  { id: "required", title: "Required" },
  { id: "recommended", title: "Recommended", description: "Nice to have before launch" },
];

describe("SetupGuide", () => {
  it("shows the title, progress text and bar", () => {
    render(<SetupGuide title="Setup guide" description="Get ready to sell" tasks={tasks} />);
    expect(screen.getByRole("heading", { level: 2, name: "Setup guide" })).toBeInTheDocument();
    expect(screen.getByText("1 of 3 tasks complete")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar", { name: "1 of 3 tasks complete" });
    expect(bar).toHaveAttribute("aria-valuenow", String((1 / 3) * 100));
  });

  it("expands the first incomplete task by default, with a visible primary CTA", () => {
    render(<SetupGuide title="Setup guide" tasks={tasks} groups={groups} />);
    const theme = screen.getByRole("button", { name: /Customize your online store/ });
    expect(theme).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(theme.getAttribute("aria-controls")!)!;
    expect(panel).toBeVisible();
    expect(within(panel).getByRole("link", { name: "Customize theme" })).toHaveAttribute(
      "href",
      "/themes",
    );
    const learn = within(panel).getByRole("link", { name: "Learn more" });
    expect(learn).toHaveAttribute("target", "_blank");
    expect(learn).toHaveAttribute("rel", "noreferrer");
    expect(screen.getByRole("button", { name: /Add your first product/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("is a disclosure list: one task open at a time, keyboard operable", async () => {
    const user = userEvent.setup();
    render(<SetupGuide title="Setup guide" tasks={tasks} groups={groups} />);
    const domain = screen.getByRole("button", { name: /Add a custom domain/ });
    domain.focus();
    await user.keyboard("{Enter}");
    expect(domain).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Customize your online store/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await user.click(screen.getByRole("button", { name: "Add domain" }));
    expect(tasks[2]!.action!.onAction).toHaveBeenCalled();
    domain.focus();
    await user.keyboard(" ");
    expect(domain).toHaveAttribute("aria-expanded", "false");
  });

  it("announces each task's status and renders groups with headings", () => {
    render(<SetupGuide title="Setup guide" tasks={tasks} groups={groups} />);
    expect(screen.getByRole("button", { name: "Add your first product (Complete)" })).toBeVisible();
    const recommended = screen.getByRole("region", { name: "Recommended" });
    expect(within(recommended).getByText("Nice to have before launch")).toBeInTheDocument();
    expect(within(recommended).getAllByRole("listitem")).toHaveLength(1);
  });

  it("collapses and dismisses", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <SetupGuide
        title="Setup guide"
        tasks={tasks}
        onDismiss={onDismiss}
        onOpenChange={onOpenChange}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Collapse setup guide" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Expand setup guide" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("button", { name: /Customize your online store/ })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Dismiss setup guide" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("lets merchants tick tasks off when onTaskCompleteChange is set", async () => {
    const onTaskCompleteChange = vi.fn();
    render(
      <SetupGuide title="Setup guide" tasks={tasks} onTaskCompleteChange={onTaskCompleteChange} />,
    );
    const status = screen.getByRole("button", { name: 'Mark "Add a custom domain" as done' });
    expect(status).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(status);
    expect(onTaskCompleteChange).toHaveBeenCalledWith("domain", true);
    expect(
      screen.getByRole("button", { name: 'Mark "Add your first product" as not done' }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("supports a controlled expanded task, LinkProvider links and localized labels", async () => {
    const onExpandedTaskChange = vi.fn();
    const Link = ({ href, children, ...rest }: { href: string; children?: React.ReactNode }) => (
      <a data-router-link="" href={href} {...rest}>
        {children}
      </a>
    );
    render(
      <LinkProvider value={Link}>
        <SetupGuide
          title="Guía"
          tasks={tasks}
          expandedTaskId="theme"
          onExpandedTaskChange={onExpandedTaskChange}
          headingLevel={3}
          labels={{
            progress: (done, total) => `${done} de ${total} tareas completadas`,
            collapse: "Contraer",
          }}
        />
      </LinkProvider>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Guía" })).toBeInTheDocument();
    expect(screen.getByText("1 de 3 tareas completadas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contraer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Customize theme" })).toHaveAttribute(
      "data-router-link",
    );
    await userEvent.click(screen.getByRole("button", { name: /Add a custom domain/ }));
    expect(onExpandedTaskChange).toHaveBeenCalledWith("domain");
    // Controlled: stays on "theme" until the parent updates.
    expect(screen.getByRole("button", { name: /Customize your online store/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
