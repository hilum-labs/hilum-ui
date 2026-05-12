import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@hilum/ui";

export default function SimpleStackedForm() {
  return (
    <form className="flex flex-col gap-5 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="ss-fn"><Input id="ss-fn" placeholder="Jane" /></Field>
        <Field label="Last name" htmlFor="ss-ln"><Input id="ss-ln" placeholder="Smith" /></Field>
      </div>
      <Field label="Email address" htmlFor="ss-email">
        <Input id="ss-email" type="email" placeholder="jane@example.com" />
      </Field>
      <Field label="Country" htmlFor="ss-country">
        <Select>
          <SelectTrigger id="ss-country"><SelectValue placeholder="Select country..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="gb">United Kingdom</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Street address" htmlFor="ss-street">
        <Input id="ss-street" placeholder="123 Main St" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="City" htmlFor="ss-city" className="col-span-1">
          <Input id="ss-city" placeholder="San Francisco" />
        </Field>
        <Field label="State" htmlFor="ss-state" className="col-span-1">
          <Select>
            <SelectTrigger id="ss-state"><SelectValue placeholder="CA" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">CA</SelectItem>
              <SelectItem value="ny">NY</SelectItem>
              <SelectItem value="tx">TX</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="ZIP" htmlFor="ss-zip" className="col-span-1">
          <Input id="ss-zip" placeholder="94105" />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
