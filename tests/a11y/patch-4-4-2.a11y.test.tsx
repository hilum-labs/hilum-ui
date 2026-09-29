/**
 * Accessibility smoke tests for the 4.4.2 fixes: active nav items (their
 * colour contrast is checked with axe in a real browser, in
 * tests/browser/nav-contrast.browser.test.tsx) and clickable DataTable rows
 * with a row action's ConfirmDialog open. See tests/axe.ts for the rules
 * disabled under happy-dom.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { axe } from "../axe";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../packages/ui/src/components/sidebar";
import { DataTable } from "../../packages/ui/src/components/data-table";
import { ConfirmDialog } from "../../packages/ui/src/components/alert-dialog";
import { AppMobileNav } from "../../packages/app-shell/src/app-mobile-nav";

describe("a11y: 4.4.2", () => {
  it("active SidebarMenuButton and SidebarMenuSubButton", async () => {
    render(
      <nav aria-label="Store">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <a href="/orders" aria-current="page">
                <Inbox aria-hidden="true" />
                <span>Orders</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton href="/orders/drafts" isActive>
                  Drafts
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </nav>,
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("data-active", "true");
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("AppMobileNav tabs with an active item", async () => {
    render(
      <AppMobileNav
        brand="Shop"
        variant="tabs"
        sections={[
          {
            items: [
              { label: "Home", href: "/", active: true },
              { label: "Orders", href: "/orders" },
            ],
          },
        ]}
      />,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("clickable DataTable rows with a row action's ConfirmDialog open", async () => {
    render(
      <DataTable
        columns={[
          { id: "name", header: "Product", cell: ({ row }) => row.original.name },
          {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
              <ConfirmDialog
                open
                title={`Delete ${row.original.name}?`}
                description="This can't be undone."
                confirmLabel="Delete"
                destructive
                onConfirm={() => {}}
              />
            ),
          },
        ]}
        data={[{ id: "1", name: "Linen shirt" }]}
        onRowClick={() => {}}
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });
});
