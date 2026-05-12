
import { PreviewBlock } from "@/components/catalog/preview-block";
import LabelsOnLeftForm from "@/components/blocks/form-layout/labels-on-left-form";
import labelsOnLeftFormSource from "@/components/blocks/form-layout/labels-on-left-form?raw";
import SimpleStackedForm from "@/components/blocks/form-layout/simple-stacked-form";
import simpleStackedFormSource from "@/components/blocks/form-layout/simple-stacked-form?raw";
import TwoColumnCardsForm from "@/components/blocks/form-layout/two-column-cards-form";
import twoColumnCardsFormSource from "@/components/blocks/form-layout/two-column-cards-form?raw";
import WithSidebarForm from "@/components/blocks/form-layout/with-sidebar-form";
import withSidebarFormSource from "@/components/blocks/form-layout/with-sidebar-form?raw";

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function FormLayoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/blocks" className="hover:text-taupe-700">Blocks</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Form Layout</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Form Layout</h1>
        <p className="body max-w-md text-taupe-400">
          Full-form layout patterns — labels on left, simple stacked, per-section cards, and sidebar navigation.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Block</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Field · Input · Textarea · Select · Switch · Button</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Form Layout · Labels on left" />
          <PreviewBlock
            title="3-column grid: sidebar label + controls"
            description="Profile · Notifications · Password"
            code={labelsOnLeftFormSource}
            previewClassName="items-start p-0"
          >
            <div className="w-full px-6 py-4">
              <LabelsOnLeftForm />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Form Layout · Simple stacked" />
          <PreviewBlock
            title="Single-column vertical stack"
            description="Address / personal info form"
            code={simpleStackedFormSource}
            previewClassName="items-start"
          >
            <SimpleStackedForm />
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Form Layout · Cards with separate submits" />
          <PreviewBlock
            title="Each section in its own card"
            description="Independent save/cancel per section"
            code={twoColumnCardsFormSource}
            previewClassName="items-start"
          >
            <TwoColumnCardsForm />
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Form Layout · With sidebar navigation" />
          <PreviewBlock
            title="Sidebar nav + main form area"
            description="Vertical nav on left, form content on right"
            code={withSidebarFormSource}
            previewClassName="items-start"
          >
            <WithSidebarForm />
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
