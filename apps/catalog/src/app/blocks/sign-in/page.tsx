import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import SignInCard from "@/components/blocks/sign-in/sign-in-card";
import signInCardSource from "@/components/blocks/sign-in/sign-in-card?raw";
import SignInNoLabels from "@/components/blocks/sign-in/sign-in-no-labels";
import signInNoLabelsSource from "@/components/blocks/sign-in/sign-in-no-labels?raw";
import SignInSplit from "@/components/blocks/sign-in/sign-in-split";
import signInSplitSource from "@/components/blocks/sign-in/sign-in-split?raw";

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SignInPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/blocks" className="hover:text-foreground">
            Blocks
          </a>
          <span>/</span>
          <span className="body font-semibold text-foreground">Sign In</span>
        </div>
        <h1 className="display mb-2 text-foreground">Sign In</h1>
        <p className="body max-w-md text-muted-foreground">
          Authentication form layouts — card, compact stacked, and split-screen.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Block</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">
            Field · Input · Button · Checkbox · Separator
          </p>
        </div>
      </div>

      <PageDocs path="/blocks/sign-in/" />

      <div className="flex flex-col gap-10">
        <div>
          <Heading label="Sign In · Card" />
          <PreviewBlock
            title="Card layout"
            description="Centered card with social login"
            code={signInCardSource}
          >
            <SignInCard />
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Sign In · Compact / no labels" />
          <PreviewBlock
            title="Stacked inputs, hidden labels"
            description="Email + password with shared border, no visible labels"
            code={signInNoLabelsSource}
          >
            <SignInNoLabels />
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Sign In · Split screen" />
          <PreviewBlock
            title="Form left, brand panel right"
            description="Two-column layout — works full-page"
            code={signInSplitSource}
            previewClassName="p-0"
          >
            <SignInSplit />
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/blocks/sign-in/")({
  head: () => createCatalogPageHead("/blocks/sign-in/"),
  component: SignInPage,
});
