import { createFileRoute } from "@tanstack/react-router";
import { FileThumbnail } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { FileThumbnail } from "@hilum/ui"

<FileThumbnail name="brand-guidelines.pdf" type="PDF" size="1.8 MB" />`;

function FileThumbnailPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">File Thumbnail</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Compact file preview row with icon, type, and size metadata.
      </p>
      <PageDocs path="/atoms/file-thumbnail/" />
      <PreviewBlock title="Default" description="File metadata preview" code={CODE}>
        <div className="w-80">
          <FileThumbnail name="brand-guidelines.pdf" type="PDF" size="1.8 MB" />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/file-thumbnail/")({
  head: () => createCatalogPageHead("/atoms/file-thumbnail/"),
  component: FileThumbnailPage,
});
