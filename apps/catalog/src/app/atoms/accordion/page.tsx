
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  accordion: `import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@hilum/ui"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is a voice clone?</AccordionTrigger>
    <AccordionContent>
      A voice clone is an AI model trained on your voice samples
      that can generate speech in your voice.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How many samples do I need?</AccordionTrigger>
    <AccordionContent>
      For best results, provide at least 10 minutes of clean,
      studio-quality audio with no background noise.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Can I share my voice clone?</AccordionTrigger>
    <AccordionContent>
      Yes — you can share your voice clone with collaborators
      from the Voice Library tab in your dashboard.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function AccordionPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Accordion</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Accordion</h1>
        <p className="body max-w-lg text-ground-500">
          Vertically stacked sections that expand and collapse.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Accordion" />

        <PreviewBlock
          title="FAQ style"
          description="Collapsible sections with animated open/close"
          code={CODE.accordion}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-sm">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a voice clone?</AccordionTrigger>
                <AccordionContent>
                  A voice clone is an AI model trained on your voice samples
                  that can generate speech that sounds like you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How many samples do I need?</AccordionTrigger>
                <AccordionContent>
                  For best results, provide at least 10 minutes of clean,
                  studio-quality audio with no background noise or music.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I share my voice clone?</AccordionTrigger>
                <AccordionContent>
                  Yes — you can share your voice clone with collaborators
                  from the Voice Library tab in your dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
