/**
 * Accessibility smoke tests for @hilum/app-shell layouts.
 * See tests/axe.ts for the rules disabled under happy-dom.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "../axe";

import { AppAccountMenu } from "../../packages/app-shell/src/app-account-menu";
import { AppShell } from "../../packages/app-shell/src/app-shell";
import { AppHeader } from "../../packages/app-shell/src/app-header";
import { AppSidebar } from "../../packages/app-shell/src/app-sidebar";

const sections = [
  {
    label: "Workspace",
    items: [
      { label: "Home", href: "/home", active: true, badge: "3" },
      { label: "Templates", href: "/templates" },
    ],
  },
];

describe("a11y: @hilum/app-shell", () => {
  it("AppShell", async () => {
    // AppShell owns the landmarks: children are wrapped in <main id="main-content">.
    render(
      <AppShell>
        <h1>Dashboard</h1>
        <p>App content</p>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("AppHeader with breadcrumbs and actions", async () => {
    render(
      <AppShell
        header={
          <AppHeader
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Users" }]}
            actions={<button type="button">Export</button>}
          />
        }
      >
        <h1>Users</h1>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("AppSidebar with sections, footer and user", async () => {
    render(
      <AppShell
        sidebar={
          <AppSidebar
            logo={<span aria-hidden="true">H</span>}
            brand="Hilum"
            subtitle="Admin"
            headerAction={<button type="button">New</button>}
            sections={sections}
            footer={<button type="button">Upgrade</button>}
            user={{ name: "Ada Lovelace", email: "ada@example.com", initials: "AL" }}
          />
        }
      >
        <h1>Home</h1>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("AppHeader with AppAccountMenu", async () => {
    render(
      <AppShell
        header={
          <AppHeader
            breadcrumbs={[{ label: "Home" }]}
            actions={
              <AppAccountMenu
                user={{ name: "Ada Lovelace", email: "ada@example.com", initials: "AL" }}
                items={[{ label: "Log out", destructive: true }]}
              />
            }
          />
        }
      >
        <h1>Home</h1>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("AppSidebar collapsed", async () => {
    render(
      <AppShell sidebar={<AppSidebar collapsed brand="Hilum" sections={sections} />}>
        <h1>Home</h1>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("full layout: sidebar + header + main", async () => {
    render(
      <AppShell
        sidebar={<AppSidebar brand="Hilum" sections={sections} />}
        header={<AppHeader breadcrumbs={[{ label: "Home" }]} />}
      >
        <h1>Home</h1>
      </AppShell>,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });
});
