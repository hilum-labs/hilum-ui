import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Textarea } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Switch } from "@hilum/ui";
import { Label } from "@hilum/ui";

export default function LabelsOnLeftForm() {
  return (
    <form className="flex flex-col divide-y divide-taupe-100" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-3 gap-8 py-8">
        <div>
          <p className="body font-semibold text-taupe-900">Profile</p>
          <p className="mt-1 caption text-taupe-400">
            This information will be displayed publicly.
          </p>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" htmlFor="lol-fn" required><Input id="lol-fn" placeholder="Jane" /></Field>
            <Field label="Last name" htmlFor="lol-ln" required><Input id="lol-ln" placeholder="Smith" /></Field>
          </div>
          <Field label="Username" htmlFor="lol-user" hint="yourcompany.com/username">
            <Input id="lol-user" placeholder="janesmith" />
          </Field>
          <Field label="Email address" htmlFor="lol-email" required>
            <Input id="lol-email" type="email" placeholder="jane@example.com" />
          </Field>
          <Field label="Bio" htmlFor="lol-bio">
            <Textarea id="lol-bio" placeholder="Write a few sentences about yourself." rows={3} />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 py-8">
        <div>
          <p className="body font-semibold text-taupe-900">Notifications</p>
          <p className="mt-1 caption text-taupe-400">Choose how you want to be notified.</p>
        </div>
        <div className="col-span-2 flex flex-col gap-5">
          {[
            { id: "lol-c", label: "Comments", desc: "Get notified when someone comments." },
            { id: "lol-u", label: "Product updates", desc: "News about new features." },
            { id: "lol-m", label: "Marketing", desc: "Promotions and offers." },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={item.id} className="body font-medium text-taupe-900">{item.label}</Label>
                <p className="caption text-taupe-400">{item.desc}</p>
              </div>
              <Switch id={item.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 py-8">
        <div>
          <p className="body font-semibold text-taupe-900">Password</p>
          <p className="mt-1 caption text-taupe-400">Update your account password.</p>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <Field label="Current password" htmlFor="lol-cpw">
            <Input id="lol-cpw" type="password" placeholder="••••••••" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New password" htmlFor="lol-npw">
              <Input id="lol-npw" type="password" placeholder="••••••••" />
            </Field>
            <Field label="Confirm password" htmlFor="lol-confpw">
              <Input id="lol-confpw" type="password" placeholder="••••••••" />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
