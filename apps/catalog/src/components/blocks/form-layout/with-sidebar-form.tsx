import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Textarea } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Separator } from "@hilum/ui";

const SIDEBAR_NAV = ["Profile", "Account", "Notifications", "Billing", "Security"];

export default function WithSidebarForm() {
  return (
    <div className="flex gap-8 w-full">
      {/* Sidebar nav */}
      <nav className="w-44 shrink-0">
        <ul className="flex flex-col gap-0.5">
          {SIDEBAR_NAV.map((item, i) => (
            <li key={item}>
              <a
                href="#"
                className={`flex rounded-lg px-3 py-2 caption transition-colors ${
                  i === 0
                    ? "bg-brand-primary/10 font-semibold text-brand-primary"
                    : "text-ground-600 hover:bg-ground-50 hover:text-ground-900"
                }`}
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main form */}
      <form className="flex-1 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h2 className="subheading text-ground-900 mb-1">Profile</h2>
          <p className="caption text-ground-400">This information will be displayed on your public profile.</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" htmlFor="wsb-fn"><Input id="wsb-fn" placeholder="Jane" /></Field>
            <Field label="Last name" htmlFor="wsb-ln"><Input id="wsb-ln" placeholder="Smith" /></Field>
          </div>
          <Field label="Email" htmlFor="wsb-email">
            <Input id="wsb-email" type="email" placeholder="jane@example.com" />
          </Field>
          <Field label="Bio" htmlFor="wsb-bio" cornerHint="Max 200 chars">
            <Textarea id="wsb-bio" rows={3} placeholder="Write a few sentences about yourself." />
          </Field>
          <Field label="Website" htmlFor="wsb-web" cornerHint="Optional">
            <Input id="wsb-web" placeholder="https://yoursite.com" />
          </Field>
        </div>
        <Separator />
        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
