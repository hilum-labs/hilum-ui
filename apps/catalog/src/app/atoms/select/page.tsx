
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, SelectLabel, SelectGroup,
} from "@hilum/ui"

<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select voice..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="roger">Roger</SelectItem>
    <SelectItem value="aria">Aria</SelectItem>
    <SelectItem value="sarah">Sarah</SelectItem>
  </SelectContent>
</Select>`,

  grouped: `<Select>
  <SelectTrigger className="w-[240px]">
    <SelectValue placeholder="Select a city..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="sf">San Francisco</SelectItem>
      <SelectItem value="ny">New York</SelectItem>
      <SelectItem value="toronto">Toronto</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="london">London</SelectItem>
      <SelectItem value="paris">Paris</SelectItem>
      <SelectItem value="berlin">Berlin</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,

  native: `<select
  className="h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900
    focus:outline-none focus:ring-2 focus:ring-ground-400/30 focus:border-ground-400"
>
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="gb">United Kingdom</option>
</select>`,

  inField: `import { Field } from "@hilum/ui"

<Field label="Country" htmlFor="country">
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select country..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
    </SelectContent>
  </Select>
</Field>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function SelectPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Select</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Select</h1>
        <p className="body max-w-lg text-ground-500">
          Dropdown list for choosing a single option. Custom Radix-based component with grouped and native variants.
        </p>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Select · Basic" />
          <PreviewBlock title="Single-value dropdown" description="Custom Radix select with search support" code={CODE.basic}>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a voice..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Featured</SelectLabel>
                  <SelectItem value="roger">Roger</SelectItem>
                  <SelectItem value="aria">Aria</SelectItem>
                  <SelectItem value="sarah">Sarah</SelectItem>
                  <SelectItem value="charlie">Charlie</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Select · Grouped" />
          <PreviewBlock title="Options grouped by category" description="Use SelectGroup + SelectLabel for categorization" code={CODE.grouped}>
            <Select>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a city..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="toronto">Toronto</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="berlin">Berlin</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Asia Pacific</SelectLabel>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="sydney">Sydney</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Select · Native" />
          <PreviewBlock title="Native HTML select" description="OS-rendered dropdown, works without JavaScript" code={CODE.native} previewClassName="flex-col items-start">
            <div className="flex flex-col gap-3 w-64">
              <select
                className="h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900 focus:outline-none focus:ring-2 focus:ring-ground-400/30 focus:border-ground-400"
                defaultValue=""
              >
                <option value="" disabled>Select a country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="gb">United Kingdom</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
              </select>
              <select
                className="h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900 focus:outline-none focus:ring-2 focus:ring-ground-400/30 focus:border-ground-400"
                defaultValue=""
                disabled
              >
                <option value="" disabled>Disabled</option>
              </select>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Select · Sizes and states" />
          <PreviewBlock title="Width variations" description="Full-width vs fixed-width, disabled state" code={CODE.basic} previewClassName="flex-col items-start">
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <Select defaultValue="mp3">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3 — Full width</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="flac">FLAC</SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">Option</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
