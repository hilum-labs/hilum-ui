import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Switch } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@hilum/ui";

const CARD_SECTIONS = [
  {
    id: "profile",
    title: "Personal information",
    description: "Use a permanent address where you can receive mail.",
    fields: (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="tc-fn"><Input id="tc-fn" placeholder="Jane" /></Field>
          <Field label="Last name" htmlFor="tc-ln"><Input id="tc-ln" placeholder="Smith" /></Field>
        </div>
        <Field label="Email address" htmlFor="tc-email">
          <Input id="tc-email" type="email" placeholder="jane@example.com" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Country" htmlFor="tc-country">
            <Select>
              <SelectTrigger id="tc-country"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Timezone" htmlFor="tc-tz">
            <Select>
              <SelectTrigger id="tc-tz"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">PST (UTC-8)</SelectItem>
                <SelectItem value="est">EST (UTC-5)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>
    ),
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Choose how and when you want to be notified.",
    fields: (
      <div className="flex flex-col gap-5">
        {[
          { id: "tc-n1", label: "New followers", desc: "When someone follows your account." },
          { id: "tc-n2", label: "Direct messages", desc: "When you receive a new message." },
          { id: "tc-n3", label: "Mentions", desc: "When someone mentions you in a post." },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={item.id} className="body font-medium text-taupe-900">{item.label}</Label>
              <p className="caption text-taupe-400 mt-0.5">{item.desc}</p>
            </div>
            <Switch id={item.id} />
          </div>
        ))}
      </div>
    ),
  },
];

export default function TwoColumnCardsForm() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {CARD_SECTIONS.map((section) => (
        <form key={section.id} className="rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden" onSubmit={(e) => e.preventDefault()}>
          <div className="border-b border-taupe-100 px-5 py-4">
            <p className="body font-semibold text-taupe-900">{section.title}</p>
            <p className="caption text-taupe-400 mt-0.5">{section.description}</p>
          </div>
          <div className="p-5">
            {section.fields}
          </div>
          <div className="border-t border-taupe-100 bg-taupe-50 flex justify-end gap-2 px-5 py-3">
            <Button variant="outline" size="sm" type="button">Cancel</Button>
            <Button size="sm" type="submit">Save</Button>
          </div>
        </form>
      ))}
    </div>
  );
}
