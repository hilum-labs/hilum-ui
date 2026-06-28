import { createFileRoute } from "@tanstack/react-router";
import { AskUserQuestions } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { AskUserQuestions } from "@hilum/ui"

<AskUserQuestions
  questions={[
    {
      title: "Which workflow should we prioritize?",
      options: [{ title: "Import review" }, { title: "Theme builder" }],
    },
    {
      title: "Should notifications be realtime?",
      options: [{ title: "Yes, for admins" }, { title: "Batch digest" }],
    },
  ]}
/>`;

function AskUserQuestionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Ask User Questions</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Question prompt panel for clarifications, answers, and review decisions.
      </p>
      <PageDocs path="/molecules/ask-user-questions/" />
      <PreviewBlock title="Default" description="Clarification questions" code={CODE}>
        <div className="w-full max-w-lg">
          <AskUserQuestions
            questions={[
              {
                title: "Which workflow should we prioritize?",
                options: [{ title: "Import review" }, { title: "Theme builder" }],
              },
              {
                title: "Should notifications be realtime?",
                options: [{ title: "Yes, for admins" }, { title: "Batch digest" }],
              },
            ]}
          />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/ask-user-questions/")({
  head: () => createCatalogPageHead("/molecules/ask-user-questions/"),
  component: AskUserQuestionsPage,
});
