import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import InputGroups from "@/components/application-ui/forms/input-groups";
import inputGroupsSource from "@/components/application-ui/forms/input-groups?raw";
import RadioGroups from "@/components/application-ui/forms/radio-groups";
import radioGroupsSource from "@/components/application-ui/forms/radio-groups?raw";
import Selects from "@/components/application-ui/forms/selects";
import selectsSource from "@/components/application-ui/forms/selects?raw";
import Checkboxes from "@/components/application-ui/forms/checkboxes";
import checkboxesSource from "@/components/application-ui/forms/checkboxes?raw";
import Toggles from "@/components/application-ui/forms/toggles";
import togglesSource from "@/components/application-ui/forms/toggles?raw";
import FormLayouts from "@/components/application-ui/forms/form-layouts";
import formLayoutsSource from "@/components/application-ui/forms/form-layouts?raw";
import ActionPanels from "@/components/application-ui/forms/action-panels";
import actionPanelsSource from "@/components/application-ui/forms/action-panels?raw";
import Textareas from "@/components/application-ui/forms/textareas";
import textareasSource from "@/components/application-ui/forms/textareas?raw";
import SignInForms from "@/components/application-ui/forms/sign-in-forms";
import signInFormsSource from "@/components/application-ui/forms/sign-in-forms?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FormsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/application-ui" className="hover:text-ground-700">
            Application UI
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Forms</span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display mb-2 text-ground-900">Forms</h1>
            <p className="body max-w-2xl text-ground-500">
              Input groups, radio groups, selects, checkboxes, toggles, form layouts, and sign-in
              forms.
            </p>
          </div>
          <Badge variant="brand" className="self-start rounded-full px-3 py-1">
            Input · 74 variants
          </Badge>
        </div>
      </div>

      <PageDocs path="/application-ui/forms/" />

      <div className="space-y-10">
        <section>
          <SectionHeading label="SECTION 1 — INPUT GROUPS" />
          <PreviewBlock
            title="Input Groups"
            description="8 variants"
            code={inputGroupsSource}
            previewClassName="p-0"
          >
            <InputGroups />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 2 — RADIO GROUPS" />
          <PreviewBlock
            title="Radio Groups"
            description="4 variants"
            code={radioGroupsSource}
            previewClassName="p-0"
          >
            <RadioGroups />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 3 — SELECT MENUS" />
          <PreviewBlock
            title="Select Menus"
            description="3 variants"
            code={selectsSource}
            previewClassName="p-0"
          >
            <Selects />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 4 — CHECKBOXES" />
          <PreviewBlock
            title="Checkboxes"
            description="2 variants"
            code={checkboxesSource}
            previewClassName="p-0"
          >
            <Checkboxes />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 5 — TOGGLES" />
          <PreviewBlock
            title="Toggles"
            description="3 variants"
            code={togglesSource}
            previewClassName="p-0"
          >
            <Toggles />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 6 — FORM LAYOUTS" />
          <PreviewBlock
            title="Form Layouts"
            description="2 variants"
            code={formLayoutsSource}
            previewClassName="p-0"
          >
            <FormLayouts />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 7 — ACTION PANELS" />
          <PreviewBlock
            title="Action Panels"
            description="3 variants"
            code={actionPanelsSource}
            previewClassName="p-0"
          >
            <ActionPanels />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 8 — TEXTAREAS" />
          <PreviewBlock
            title="Textareas"
            description="3 variants"
            code={textareasSource}
            previewClassName="p-0"
          >
            <Textareas />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="SECTION 9 — SIGN-IN FORMS" />
          <PreviewBlock
            title="Sign-In Forms"
            description="2 variants"
            code={signInFormsSource}
            previewClassName="p-0"
          >
            <SignInForms />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/forms/")({
  head: () => createCatalogPageHead("/application-ui/forms/"),
  component: FormsPage,
});
