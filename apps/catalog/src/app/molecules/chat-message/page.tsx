import { createFileRoute } from "@tanstack/react-router";
import { ChatMessage } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { ChatMessage } from "@hilum/ui"

<ChatMessage from="assistant">The import is ready to review.</ChatMessage>`;

function ChatMessagePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Chat Message</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Chat transcript row with avatar, metadata, alignment, and bubble tone.
      </p>
      <PageDocs path="/molecules/chat-message/" />
      <PreviewBlock title="Default" description="Assistant and user messages" code={CODE}>
        <div className="grid w-full max-w-xl gap-4">
          <ChatMessage from="assistant">The import is ready to review.</ChatMessage>
          <ChatMessage from="user" time="Now">
            Open the review queue.
          </ChatMessage>
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/chat-message/")({
  head: () => createCatalogPageHead("/molecules/chat-message/"),
  component: ChatMessagePage,
});
