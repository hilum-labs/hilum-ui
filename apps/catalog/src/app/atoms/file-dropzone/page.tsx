import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { FileDropzone } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { FileDropzone } from "@hilum/ui"

const [files, setFiles] = React.useState([])

<FileDropzone
  accept="image/*"
  multiple
  selectedFiles={files}
  onFilesSelected={setFiles}
  description="PNG, JPG, or WebP up to 10 MB each."
/>`,

  states: `<FileDropzone
  loading
  loadingText="Uploading assets..."
  selectedFiles={[{ name: "cover-art.png", size: 384000 }] }
/>

<FileDropzone
  disabled
  label="Uploads are locked"
  description="Enable editing before adding more files."
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FileDropzonePage() {
  const [files, setFiles] = React.useState<Array<{ name: string; size: number }>>([
    { name: "hero-composition.webp", size: 1280000 },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">File Dropzone</span>
        </div>
        <h1 className="display mb-2 text-ground-900">File Dropzone</h1>
        <p className="body max-w-lg text-ground-500">
          Accessible drag-and-drop file input with loading and selected-file states.
        </p>
      </div>

      <PageDocs path="/atoms/file-dropzone/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Input" />
          <PreviewBlock
            title="Selected files"
            description="Tracks selected files and summarizes the upload batch."
            code={CODE.basic}
            previewClassName="flex-col items-stretch"
          >
            <FileDropzone
              accept="image/*"
              multiple
              selectedFiles={files}
              onFilesSelected={setFiles}
              description="PNG, JPG, or WebP up to 10 MB each."
            />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="States" />
          <PreviewBlock
            title="Loading and disabled"
            description="Communicates unavailable upload states without changing layout."
            code={CODE.states}
            previewClassName="grid gap-4 md:grid-cols-2"
          >
            <FileDropzone
              loading
              loadingText="Uploading assets..."
              selectedFiles={[{ name: "cover-art.png", size: 384000 }]}
            />
            <FileDropzone
              disabled
              label="Uploads are locked"
              description="Enable editing before adding more files."
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/file-dropzone/")({
  head: () => createCatalogPageHead("/atoms/file-dropzone/"),
  component: FileDropzonePage,
});
