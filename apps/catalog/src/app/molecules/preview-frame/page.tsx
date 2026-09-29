import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Button, PreviewFrame, type PreviewDevice } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

// A self-contained demo storefront (a data: URL keeps the catalog offline).
const STOREFRONT =
  "data:text/html;charset=utf-8," +
  encodeURIComponent(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { margin: 0; font-family: system-ui, sans-serif; color: #171717; }
  header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e5e5e5; }
  .hero { padding: 48px 24px; background: #fff5bf; }
  .hero h1 { margin: 0 0 8px; font-size: clamp(28px, 6vw, 56px); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; padding: 24px; }
  .card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 12px; }
  .img { aspect-ratio: 1; border-radius: 8px; background: #c100f1; opacity: .8; margin-bottom: 8px; }
</style></head><body>
<header><strong>Casa Tienda</strong><span>Cart (2)</span></header>
<section class="hero"><h1>Summer essentials</h1><p>Linen, ceramics and everything for long evenings.</p></section>
<section class="grid">
  <div class="card"><div class="img"></div>Ceramic mug<br><small>S/ 45.00</small></div>
  <div class="card"><div class="img"></div>Linen tea towel<br><small>S/ 29.00</small></div>
  <div class="card"><div class="img"></div>Oak tray<br><small>S/ 120.00</small></div>
  <div class="card"><div class="img"></div>Beeswax candle<br><small>S/ 19.00</small></div>
</section></body></html>`);

const CODE = {
  basic: `import { PreviewFrame } from "@hilum/ui"

<PreviewFrame
  src={themePreviewUrl}
  title={\`Preview of \${theme.name}\`}   // required: names the frame
  height={560}
  showOpenInNewTab
/>`,
  controlled: `const [device, setDevice] = useState<PreviewDevice>("mobile")

<PreviewFrame
  src={previewUrl}
  title="Store preview"
  device={device}
  onDeviceChange={setDevice}
  sandbox="allow-scripts allow-same-origin"   // default adds forms and popups
  loadTimeout={15000}                         // error state if it never loads
  toolbar={<Button size="sm" onClick={publish}>Publish</Button>}
/>`,
  error: `<PreviewFrame
  src={previewUrl}
  title="Store preview"
  error={renderError ?? false}   // string replaces the description
  onRetry={refetchPreview}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ControlledDemo() {
  const [device, setDevice] = useState<PreviewDevice>("mobile");
  return (
    <div className="w-full">
      <PreviewFrame
        src={STOREFRONT}
        title="Store preview"
        device={device}
        onDeviceChange={setDevice}
        height={520}
        toolbar={<Button size="sm">Publish</Button>}
      />
    </div>
  );
}

function ErrorDemo() {
  const [failed, setFailed] = useState(true);
  return (
    <div className="w-full">
      <PreviewFrame
        src={STOREFRONT}
        title="Store preview"
        devices={["desktop"]}
        height={320}
        error={failed ? "The theme failed to render. Check the template for Liquid errors." : false}
        onRetry={() => setFailed(false)}
      />
    </div>
  );
}

function PreviewFramePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Preview Frame</span>
        </div>
        <h1 className="display mb-2 text-foreground">Preview Frame</h1>
        <p className="body max-w-lg text-muted-foreground">
          Sandboxed iframe for storefront and theme previews: mobile, tablet and desktop widths, the
          page scaled to fit its container, a loading skeleton and an error state with retry. Use it
          instead of a raw iframe.
        </p>
      </div>

      <PageDocs path="/molecules/preview-frame/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Basic" />
          <PreviewBlock
            title="Desktop, scaled to fit"
            description="The page is laid out at 1280px (or the container width, if wider) and scaled down to fit. The frame is sandboxed and sends no referrer."
            code={CODE.basic}
            previewClassName="flex-col items-stretch"
          >
            <PreviewFrame src={STOREFRONT} title="Store preview" height={420} showOpenInNewTab />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Devices" />
          <PreviewBlock
            title="Controlled device"
            description="Mobile (390px) and tablet (820px) render at their width, framed and centred when the container is wider, scaled when it's narrower."
            code={CODE.controlled}
            previewClassName="flex-col items-stretch"
          >
            <ControlledDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Error" />
          <PreviewBlock
            title="Failed preview"
            description="error (or loadTimeout) shows the error state; Try again reloads the frame and calls onRetry."
            code={CODE.error}
            previewClassName="flex-col items-stretch"
          >
            <ErrorDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/preview-frame/")({
  head: () => createCatalogPageHead("/molecules/preview-frame/"),
  component: PreviewFramePage,
});
