
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import LogoCloudSimple from "@/components/marketing/logo-clouds/logo-cloud-simple";
import logoCloudSimpleSource from "@/components/marketing/logo-clouds/logo-cloud-simple?raw";
import LogoCloudWithHeading from "@/components/marketing/logo-clouds/logo-cloud-with-heading";
import logoCloudWithHeadingSource from "@/components/marketing/logo-clouds/logo-cloud-with-heading?raw";
import LogoCloudBrandHeading from "@/components/marketing/logo-clouds/logo-cloud-brand-heading";
import logoCloudBrandHeadingSource from "@/components/marketing/logo-clouds/logo-cloud-brand-heading?raw";
import LogoCloudGrid from "@/components/marketing/logo-clouds/logo-cloud-grid";
import logoCloudGridSource from "@/components/marketing/logo-clouds/logo-cloud-grid?raw";
import LogoCloudSplit from "@/components/marketing/logo-clouds/logo-cloud-split";
import logoCloudSplitSource from "@/components/marketing/logo-clouds/logo-cloud-split?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function LogoCloudsPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="/" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="/marketing" className="hover:text-ground-700">
              Marketing
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Logo Clouds</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Social Proof</Badge>
            <span className="caption text-ground-400">5 variants</span>
          </div>
          <h1 className="display mb-2 text-ground-900">Logo Clouds</h1>
          <p className="body max-w-2xl text-ground-400">
            A compact catalog of logo cloud layouts for trust-building moments, from quiet
            white sections to stronger brand-backed treatments.
          </p>
        </div>

        <SectionHeading label="Variants" />

        <div className="space-y-8">
          <PreviewBlock
            title="Simple"
            code={logoCloudSimpleSource}
            previewClassName="block bg-white p-0"
          >
            <LogoCloudSimple />
          </PreviewBlock>

          <PreviewBlock
            title="Simple with heading"
            code={logoCloudWithHeadingSource}
            previewClassName="block bg-white p-0"
          >
            <LogoCloudWithHeading />
          </PreviewBlock>

          <PreviewBlock
            title="Simple with heading on brand"
            code={logoCloudBrandHeadingSource}
            previewClassName="block bg-white p-0"
          >
            <LogoCloudBrandHeading />
          </PreviewBlock>

          <PreviewBlock
            title="Off-white grid"
            code={logoCloudGridSource}
            previewClassName="block bg-white p-0"
          >
            <LogoCloudGrid />
          </PreviewBlock>

          <PreviewBlock
            title="Split with grid on right"
            code={logoCloudSplitSource}
            previewClassName="block bg-white p-0"
          >
            <LogoCloudSplit />
          </PreviewBlock>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
