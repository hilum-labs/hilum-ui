import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import {
  Smile, Paperclip, AtSign, Link2, Bold, Italic, List,
  CalendarDays, Tag, UserCircle, ChevronDown,
} from "lucide-react";
import { Textarea } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { cn } from "@hilum/ui";

const CODE = {
  basic: `import { Textarea } from "@hilum/ui"

<Textarea placeholder="Write something..." />
<Textarea disabled placeholder="Disabled" />`,

  withActions: `// Textarea with avatar and action toolbar below
<div className="flex gap-3">
  <Avatar size="sm">
    <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
  </Avatar>
  <div className="flex-1">
    <Textarea placeholder="Add a comment..." className="rounded-b-none border-b-0 focus-visible:ring-0 focus-visible:border-ground-200" />
    <div className="flex items-center justify-between rounded-b-lg border border-t-0 border-ground-200 bg-ground-50 px-3 py-2">
      <div className="flex items-center gap-1">
        <button type="button" className="p-1 text-ground-400 hover:text-ground-700 rounded"><Smile size={16} /></button>
        <button type="button" className="p-1 text-ground-400 hover:text-ground-700 rounded"><Paperclip size={16} /></button>
        <button type="button" className="p-1 text-ground-400 hover:text-ground-700 rounded"><AtSign size={16} /></button>
        <button type="button" className="p-1 text-ground-400 hover:text-ground-700 rounded"><Link2 size={16} /></button>
      </div>
      <Button size="sm">Post</Button>
    </div>
  </div>
</div>`,

  withPreview: `// Write/Preview tab interface with formatting toolbar
<div className="rounded-lg border border-ground-200 overflow-hidden">
  <Tabs defaultValue="write">
    <div className="flex items-center border-b border-ground-200 bg-ground-50 px-3">
      <TabsList className="bg-transparent">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="write">
      <Textarea className="rounded-none border-0 focus-visible:ring-0" rows={6} />
    </TabsContent>
    <TabsContent value="preview">
      <div className="min-h-[120px] p-3 caption text-ground-400">Nothing to preview</div>
    </TabsContent>
  </Tabs>
</div>`,

  underlineActions: `// Textarea with bottom border only + action buttons below
<div>
  <Textarea
    placeholder="Add your note..."
    className="rounded-none border-0 border-b border-ground-200 px-0 focus-visible:ring-0 focus-visible:border-ground-900"
  />
  <div className="mt-2 flex justify-between">
    <div className="flex gap-1">
      <button className="p-1.5 rounded text-ground-400 hover:bg-ground-100 hover:text-ground-700"><Bold size={15} /></button>
      <button className="p-1.5 rounded text-ground-400 hover:bg-ground-100 hover:text-ground-700"><Italic size={15} /></button>
      <button className="p-1.5 rounded text-ground-400 hover:bg-ground-100 hover:text-ground-700"><List size={15} /></button>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button size="sm">Save</Button>
    </div>
  </div>
</div>`,

  titleAndPills: `// Title input + body textarea + pill action buttons
<div className="rounded-lg border border-ground-200 overflow-hidden">
  <input placeholder="Title" className="w-full border-b border-ground-200 px-4 py-3 body font-medium text-ground-900 placeholder:text-ground-400 focus:outline-none" />
  <Textarea placeholder="Write a description..." className="rounded-none border-0 focus-visible:ring-0" rows={4} />
  <div className="flex items-center gap-2 border-t border-ground-100 px-3 py-2 bg-ground-50 flex-wrap">
    {pillActions.map((p) => (
      <button key={p.label} className="flex items-center gap-1.5 rounded-full border border-ground-200 bg-white px-3 py-1 caption text-ground-600 hover:bg-ground-50">
        <p.icon size={12} />
        {p.label}
        <ChevronDown size={10} className="text-ground-400" />
      </button>
    ))}
  </div>
</div>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

const PILL_ACTIONS = [
  { label: "Assignee", icon: UserCircle },
  { label: "Label", icon: Tag },
  { label: "Due date", icon: CalendarDays },
];

function TextareaPage() {
  const [previewContent, setPreviewContent] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Textarea</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Textarea</h1>
        <p className="body max-w-lg text-ground-500">
          Multi-line text input. Multiple composition variants for comment boxes, editors, and note fields.
        </p>
      </div>

      <PageDocs path="/atoms/textarea/" />

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Textarea · Basic" />
          <PreviewBlock title="Default" description="Multi-line text input" code={CODE.basic} previewClassName="flex-col items-stretch">
            <div className="flex w-full max-w-sm flex-col gap-2">
              <Textarea placeholder="Start typing here or paste any text..." />
              <Textarea disabled placeholder="Disabled" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Textarea · With avatar and actions" />
          <PreviewBlock title="Comment box with toolbar" description="Avatar on left, emoji/attachment/mention icons + post button" code={CODE.withActions} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <div className="flex gap-3">
                <Avatar size="sm">
                  <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    rows={3}
                    className="rounded-b-none border-b-0 focus-visible:ring-0 focus-visible:border-ground-200 resize-none"
                  />
                  <div className="flex items-center justify-between rounded-b-lg border border-t-0 border-ground-200 bg-ground-50 px-3 py-2">
                    <div className="flex items-center gap-1">
                      {[Smile, Paperclip, AtSign, Link2].map((Icon, i) => (
                        <button key={i} type="button" className="rounded p-1 text-ground-400 hover:bg-ground-100 hover:text-ground-700 transition-colors">
                          <Icon size={15} />
                        </button>
                      ))}
                    </div>
                    <Button size="sm">Post</Button>
                  </div>
                </div>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Textarea · With write/preview tabs" />
          <PreviewBlock title="Write and preview tabs" description="Toggle between editing mode and rendered output" code={CODE.withPreview} previewClassName="items-start">
            <div className="w-full max-w-lg overflow-hidden rounded-lg border border-ground-200">
              <Tabs defaultValue="write">
                <div className="flex items-center gap-2 border-b border-ground-200 bg-ground-50 px-3 pt-2">
                  <TabsList className="h-8 bg-transparent p-0 gap-0">
                    <TabsTrigger value="write" className="rounded-none rounded-t-md border-x border-t border-transparent data-[state=active]:border-ground-200 data-[state=active]:bg-white caption px-3 h-8">
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="rounded-none rounded-t-md border-x border-t border-transparent data-[state=active]:border-ground-200 data-[state=active]:bg-white caption px-3 h-8">
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-1 pb-1">
                    {[Bold, Italic, List, Link2].map((Icon, i) => (
                      <button key={i} type="button" className="rounded p-1 text-ground-400 hover:bg-ground-100 hover:text-ground-700 transition-colors">
                        <Icon size={13} />
                      </button>
                    ))}
                  </div>
                </div>
                <TabsContent value="write" className="mt-0">
                  <Textarea
                    className="rounded-none border-0 focus-visible:ring-0 resize-none"
                    rows={6}
                    placeholder="Write markdown..."
                    value={previewContent}
                    onChange={(e) => setPreviewContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-0">
                  <div className={cn("min-h-[144px] p-3 body", previewContent ? "text-ground-900 whitespace-pre-wrap" : "text-ground-400")}>
                    {previewContent || "Nothing to preview yet."}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Textarea · Underline with actions" />
          <PreviewBlock title="Minimal underline style" description="No full border — just a bottom line with formatting buttons below" code={CODE.underlineActions} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <Textarea
                placeholder="Add your note..."
                className="rounded-none border-0 border-b border-ground-200 px-0 focus-visible:ring-0 focus-visible:border-ground-900 resize-none"
                rows={3}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[Bold, Italic, List].map((Icon, i) => (
                    <button key={i} type="button" className="rounded p-1.5 text-ground-400 hover:bg-ground-100 hover:text-ground-700 transition-colors">
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Cancel</Button>
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Textarea · Title and pill actions" />
          <PreviewBlock title="Issue / task composer" description="Title input + body textarea + pill buttons for assignee, label, due date" code={CODE.titleAndPills} previewClassName="items-start">
            <div className="w-full max-w-lg overflow-hidden rounded-lg border border-ground-200">
              <input
                placeholder="New issue title..."
                className="w-full border-b border-ground-200 px-4 py-3 body font-medium text-ground-900 placeholder:text-ground-400 focus:outline-none bg-white"
              />
              <Textarea
                placeholder="Add a description..."
                className="rounded-none border-0 focus-visible:ring-0 resize-none"
                rows={4}
              />
              <div className="flex items-center gap-2 border-t border-ground-100 bg-ground-50 px-3 py-2 flex-wrap justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {PILL_ACTIONS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="flex items-center gap-1.5 rounded-full border border-ground-200 bg-white px-3 py-1 caption text-ground-600 hover:bg-ground-50 transition-colors"
                    >
                      <p.icon size={12} />
                      {p.label}
                      <ChevronDown size={10} className="text-ground-400" />
                    </button>
                  ))}
                </div>
                <Button size="sm">Submit</Button>
              </div>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/textarea/")({
  head: () => createCatalogPageHead("/atoms/textarea/"),
  component: TextareaPage,
});
