
import { Steps } from "@hilum/ui";
import type { Step } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const stepsBase: Step[] = [
  { name: "Details", status: "complete" },
  { name: "Review", status: "complete" },
  { name: "Confirm", status: "current" },
  { name: "Payment", status: "upcoming" },
  { name: "Done", status: "upcoming" },
];

const stepsShort: Step[] = [
  { name: "Account", description: "Email & password", status: "complete" },
  { name: "Profile", description: "Your info", status: "current" },
  { name: "Plan", description: "Choose tier", status: "upcoming" },
];

const CODE = {
  circles: `import { Steps } from "@hilum/ui"
import type { Step } from "@hilum/ui"

const steps: Step[] = [
  { name: "Details", status: "complete" },
  { name: "Review", status: "complete" },
  { name: "Confirm", status: "current" },
  { name: "Payment", status: "upcoming" },
  { name: "Done", status: "upcoming" },
]

<Steps steps={steps} variant="circles" />`,

  bullets: `import { Steps } from "@hilum/ui"

<Steps steps={steps} variant="bullets" />`,

  progress: `import { Steps } from "@hilum/ui"

<Steps steps={steps} variant="progress" />`,

  withDesc: `import { Steps } from "@hilum/ui"

const steps: Step[] = [
  { name: "Account", description: "Email & password", status: "complete" },
  { name: "Profile", description: "Your info", status: "current" },
  { name: "Plan", description: "Choose tier", status: "upcoming" },
]

<Steps steps={steps} variant="circles" />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function StepsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Steps</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Steps</h1>
        <p className="body max-w-md text-taupe-400">
          A progress indicator for multi-step flows. Supports circles, bullets, and progress-bar variants. Each step has complete, current, or upcoming status.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Atom</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Progress</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Steps · Circles" />
          <PreviewBlock title="Circles" description="Circle indicators with connector lines" code={CODE.circles}>
            <div className="w-full">
              <Steps steps={stepsBase} variant="circles" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Steps · Bullets" />
          <PreviewBlock title="Bullets" description="Minimal dots with step counter" code={CODE.bullets}>
            <Steps steps={stepsBase} variant="bullets" />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Steps · Progress bar" />
          <PreviewBlock title="Progress bar" description="Horizontal fill bar with step labels" code={CODE.progress}>
            <div className="w-full max-w-md">
              <Steps steps={stepsBase} variant="progress" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Steps · With descriptions" />
          <PreviewBlock title="Circles with descriptions" description="Each step has a sub-label" code={CODE.withDesc}>
            <div className="w-full">
              <Steps steps={stepsShort} variant="circles" />
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
