import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { CreditCard, LogOut, Settings, UserPlus } from "lucide-react";
import {
  AccountMenuContent,
  AccountMenuHeader,
  AccountMenuItem,
  AccountMenuSection,
  AccountMenuSeparator,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  menu: `import {
  AccountMenuContent, AccountMenuHeader, AccountMenuItem,
  AccountMenuSection, AccountMenuSeparator, DropdownMenu, DropdownMenuTrigger,
} from "@hilum/ui"
import { Button } from "@hilum/ui"
import { Settings, LogOut } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open account menu</Button>
  </DropdownMenuTrigger>
  <AccountMenuContent align="end">
    <AccountMenuHeader name="Sofia Perez" email="sofia@hilum.dev" fallback="SP" />
    <AccountMenuSeparator />
    <AccountMenuSection>
      <AccountMenuItem icon={<Settings aria-hidden="true" />}>Settings</AccountMenuItem>
      <AccountMenuItem icon={<LogOut aria-hidden="true" />} destructive>
        Sign out
      </AccountMenuItem>
    </AccountMenuSection>
  </AccountMenuContent>
</DropdownMenu>`,

  sections: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open detailed account menu</Button>
  </DropdownMenuTrigger>
  <AccountMenuContent align="center">
    <AccountMenuHeader name="Sofia Perez" email="sofia@hilum.dev" fallback="SP" />
    <AccountMenuSeparator />
    <AccountMenuSection>
      <AccountMenuItem icon={<UserPlus />} description="Invite a teammate">
        Add account
      </AccountMenuItem>
      <AccountMenuItem icon={<CreditCard />} trailing="Pro">
        Billing
      </AccountMenuItem>
    </AccountMenuSection>
  </AccountMenuContent>
</DropdownMenu>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function AccountMenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Account Menu</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Account Menu</h1>
        <p className="body max-w-lg text-ground-500">
          Structured account dropdown with profile header, sections, action rows, and separators.
        </p>
      </div>

      <PageDocs path="/molecules/account-menu/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Dropdown" />
          <PreviewBlock
            title="Account dropdown"
            description="Use with DropdownMenu so focus, keyboard support, and dismissal stay consistent."
            code={CODE.menu}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open account menu</Button>
              </DropdownMenuTrigger>
              <AccountMenuContent align="end">
                <AccountMenuHeader name="Sofia Perez" email="sofia@hilum.dev" fallback="SP" />
                <AccountMenuSeparator />
                <AccountMenuSection>
                  <AccountMenuItem icon={<Settings aria-hidden="true" />}>Settings</AccountMenuItem>
                  <AccountMenuItem icon={<LogOut aria-hidden="true" />} destructive>
                    Sign out
                  </AccountMenuItem>
                </AccountMenuSection>
              </AccountMenuContent>
            </DropdownMenu>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Content Model" />
          <PreviewBlock
            title="Header and sections"
            description="Account rows support icons, descriptions, trailing metadata, and destructive actions."
            code={CODE.sections}
            previewClassName="flex-col items-center"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open detailed account menu</Button>
              </DropdownMenuTrigger>
              <AccountMenuContent align="center">
                <AccountMenuHeader name="Sofia Perez" email="sofia@hilum.dev" fallback="SP" />
                <AccountMenuSeparator />
                <AccountMenuSection>
                  <AccountMenuItem
                    icon={<UserPlus aria-hidden="true" />}
                    description="Invite a teammate"
                  >
                    Add account
                  </AccountMenuItem>
                  <AccountMenuItem icon={<CreditCard aria-hidden="true" />} trailing="Pro">
                    Billing
                  </AccountMenuItem>
                </AccountMenuSection>
              </AccountMenuContent>
            </DropdownMenu>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/account-menu/")({
  head: () => createCatalogPageHead("/molecules/account-menu/"),
  component: AccountMenuPage,
});
