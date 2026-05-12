
import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Textarea } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { Field } from "@hilum/ui"
import { Input } from "@hilum/ui"

<Field label="Email">
  <Input placeholder="you@example.com" />
</Field>`,

  hint: `import { Field } from "@hilum/ui"
import { Input } from "@hilum/ui"

<Field label="Username" hint="Only letters, numbers, and underscores.">
  <Input placeholder="your_username" />
</Field>`,

  required: `import { Field } from "@hilum/ui"
import { Input } from "@hilum/ui"

<Field label="Full name" required>
  <Input placeholder="Jane Smith" />
</Field>`,

  error: `import { Field } from "@hilum/ui"
import { Input } from "@hilum/ui"

<Field label="Email" error="Enter a valid email address.">
  <Input placeholder="you@example.com" className="border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400" />
</Field>`,

  textarea: `import { Field } from "@hilum/ui"
import { Textarea } from "@hilum/ui"

<Field label="Message" hint="Up to 500 characters.">
  <Textarea placeholder="Write something..." />
</Field>`,

  group: `import { Field } from "@hilum/ui"
import { Input } from "@hilum/ui"

<div className="flex flex-col gap-4">
  <div className="grid grid-cols-2 gap-3">
    <Field label="First name" required>
      <Input placeholder="Jane" />
    </Field>
    <Field label="Last name" required>
      <Input placeholder="Smith" />
    </Field>
  </div>
  <Field label="Email" required hint="We'll never share your email.">
    <Input placeholder="you@example.com" />
  </Field>
  <Field label="Bio">
    <Textarea placeholder="Tell us about yourself..." />
  </Field>
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function FieldPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-taupe-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Field</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Field</h1>
        <p className="body max-w-md text-taupe-400">
          A labeled form control. Composes Label, Input or Textarea, and optional hint or error text into a single reusable unit.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Molecule</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Label · Input · Textarea</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Field · Basic" />
          <PreviewBlock title="Default" description="Label with an input" code={CODE.basic}>
            <div className="w-72">
              <Field label="Email">
                <Input placeholder="you@example.com" />
              </Field>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Field · States" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="With hint" description="Helper text below the input" code={CODE.hint}>
              <div className="w-72">
                <Field label="Username" hint="Only letters, numbers, and underscores.">
                  <Input placeholder="your_username" />
                </Field>
              </div>
            </PreviewBlock>
            <PreviewBlock title="Required" description="Asterisk marks mandatory fields" code={CODE.required}>
              <div className="w-72">
                <Field label="Full name" required>
                  <Input placeholder="Jane Smith" />
                </Field>
              </div>
            </PreviewBlock>
            <PreviewBlock title="Error" description="Validation message replaces hint" code={CODE.error}>
              <div className="w-72">
                <Field label="Email" error="Enter a valid email address.">
                  <Input
                    placeholder="you@example.com"
                    className="border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400"
                  />
                </Field>
              </div>
            </PreviewBlock>
          </div>
        </div>

        <div>
          <SectionHeading label="Field · Textarea" />
          <PreviewBlock title="With Textarea" description="Swap Input for Textarea — same API" code={CODE.textarea}>
            <div className="w-72">
              <Field label="Message" hint="Up to 500 characters.">
                <Textarea placeholder="Write something..." />
              </Field>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Field · Form group" />
          <PreviewBlock title="Composed form" description="Multiple fields compose naturally" code={CODE.group} previewClassName="items-start">
            <div className="w-full max-w-sm">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" required>
                    <Input placeholder="Jane" />
                  </Field>
                  <Field label="Last name" required>
                    <Input placeholder="Smith" />
                  </Field>
                </div>
                <Field label="Email" required hint="We'll never share your email.">
                  <Input placeholder="you@example.com" />
                </Field>
                <Field label="Bio">
                  <Textarea placeholder="Tell us about yourself..." />
                </Field>
              </div>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
