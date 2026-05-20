
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  alert: `import { Alert, AlertTitle, AlertDescription } from "@hilum/ui"
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
</Alert>
<Alert variant="info">
  <Info size={15} />
  <AlertTitle>New update available</AlertTitle>
  <AlertDescription>Version 2.0 includes performance improvements.</AlertDescription>
</Alert>
<Alert variant="success">
  <CheckCircle2 size={15} />
  <AlertTitle>Payment successful</AlertTitle>
  <AlertDescription>Your subscription has been activated.</AlertDescription>
</Alert>
<Alert variant="warning">
  <AlertTriangle size={15} />
  <AlertTitle>Storage almost full</AlertTitle>
  <AlertDescription>You've used 90% of your storage quota.</AlertDescription>
</Alert>
<Alert variant="destructive">
  <XCircle size={15} />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function AlertPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Alert</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Alert</h1>
        <p className="body max-w-lg text-ground-500">
          Inline message communicating status or feedback.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Alert" />

        <PreviewBlock
          title="Variants"
          description="Default · Info · Success · Warning · Destructive"
          code={CODE.alert}
          previewClassName="flex-col items-stretch"
        >
          <div className="flex w-full max-w-md flex-col gap-2">
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>You can add components using the CLI.</AlertDescription>
            </Alert>
            <Alert variant="info">
              <Info size={15} />
              <AlertTitle>New update available</AlertTitle>
              <AlertDescription>Version 2.0 includes performance improvements.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 size={15} />
              <AlertTitle>Payment successful</AlertTitle>
              <AlertDescription>Your subscription has been activated.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTriangle size={15} />
              <AlertTitle>Storage almost full</AlertTitle>
              <AlertDescription>You&apos;ve used 90% of your storage quota.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <XCircle size={15} />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong. Please try again.</AlertDescription>
            </Alert>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
