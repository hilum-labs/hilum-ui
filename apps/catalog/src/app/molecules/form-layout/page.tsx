import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Card, Field, FormLayout, Input } from "@hilum/ui";

const CODE = `import { FormLayout, Field, Input } from "@hilum/ui"

<FormLayout>
  <Field label="Store name"><Input /></Field>
  <FormLayout.Group>
    <Field label="First name"><Input /></Field>
    <Field label="Last name"><Input /></Field>
  </FormLayout.Group>
  <FormLayout.Group condensed title="Dimensions" helpText="In centimetres">
    <Field label="Length"><Input type="number" /></Field>
    <Field label="Width"><Input type="number" /></Field>
    <Field label="Height"><Input type="number" /></Field>
    <Field label="Weight"><Input type="number" /></Field>
  </FormLayout.Group>
</FormLayout>`;

const RHF_CODE = `// react-hook-form bindings live in an optional entry: npm i react-hook-form
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@hilum/ui/form"
import { FormLayout, Input } from "@hilum/ui"

const form = useForm<{ email: string }>({ defaultValues: { email: "" } })

<Form {...form}>
  <form onSubmit={form.handleSubmit(save)}>
    <FormLayout>
      <FormField
        control={form.control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field }) => (
          <FormItem required>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormDescription>Order receipts go here.</FormDescription>
            <FormMessage />            {/* wired via aria-describedby / aria-invalid */}
          </FormItem>
        )}
      />
    </FormLayout>
  </form>
</Form>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function FormLayoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Form Layout</span>
        </div>
        <h1 className="display mb-2 text-foreground">Form Layout</h1>
        <p className="body max-w-lg text-muted-foreground">
          Consistent vertical rhythm for forms, with FormLayout.Group rows that wrap responsively
          and a condensed variant for short fields. Pairs with Field or the @hilum/ui/form
          react-hook-form bindings.
        </p>
      </div>

      <PageDocs path="/molecules/form-layout/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Groups" />
          <PreviewBlock
            title="Shipping profile"
            description="Groups keep a minimum field width and wrap when space runs out."
            code={CODE}
            previewClassName="flex-col items-stretch"
          >
            <Card className="w-full max-w-2xl p-4">
              <FormLayout>
                <Field label="Store name">
                  <Input defaultValue="Linen & Co." />
                </Field>
                <FormLayout.Group>
                  <Field label="First name">
                    <Input />
                  </Field>
                  <Field label="Last name">
                    <Input />
                  </Field>
                </FormLayout.Group>
                <FormLayout.Group condensed title="Dimensions" helpText="In centimetres">
                  <Field label="Length">
                    <Input type="number" />
                  </Field>
                  <Field label="Width">
                    <Input type="number" />
                  </Field>
                  <Field label="Height">
                    <Input type="number" />
                  </Field>
                  <Field label="Weight">
                    <Input type="number" />
                  </Field>
                </FormLayout.Group>
              </FormLayout>
            </Card>
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="react-hook-form" />
          <PreviewBlock
            title="@hilum/ui/form"
            description="Form, FormField, FormItem, FormLabel, FormControl, FormDescription and FormMessage (optional peer dependency)."
            code={RHF_CODE}
            previewClassName="flex-col items-stretch"
          >
            <p className="body text-muted-foreground">
              See the code tab for the react-hook-form adapter.
            </p>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/form-layout/")({
  head: () => createCatalogPageHead("/molecules/form-layout/"),
  component: FormLayoutPage,
});
