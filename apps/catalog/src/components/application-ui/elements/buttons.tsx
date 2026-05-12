import { type ReactNode } from "react";
import { Mail, Plus } from "lucide-react";
import { Button } from "@hilum/ui";

function ButtonRow({
  label,
  render,
}: {
  label: string;
  render: (size: "sm" | "default" | "lg") => ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-taupe-100 py-4 last:border-b-0 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
      <p className="body font-medium text-taupe-900">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {render("sm")}
        {render("default")}
        {render("lg")}
      </div>
    </div>
  );
}

export default function Buttons() {
  return (
    <div className="bg-white px-8 py-10">
      <div className="rounded-2xl border border-taupe-100 bg-taupe-50/60 px-5 py-2">
        <ButtonRow
          label="Primary"
          render={(size) => <Button size={size === "default" ? "default" : size}>Save</Button>}
        />
        <ButtonRow
          label="Secondary"
          render={(size) => (
            <Button variant="secondary" size={size === "default" ? "default" : size}>
              Save
            </Button>
          )}
        />
        <ButtonRow
          label="Outline"
          render={(size) => (
            <Button variant="outline" size={size === "default" ? "default" : size}>
              Save
            </Button>
          )}
        />
        <ButtonRow
          label="Ghost"
          render={(size) => (
            <Button variant="ghost" size={size === "default" ? "default" : size}>
              Save
            </Button>
          )}
        />
        <ButtonRow
          label="Destructive"
          render={(size) => (
            <Button variant="destructive" size={size === "default" ? "default" : size}>
              Delete
            </Button>
          )}
        />
        <ButtonRow
          label="Brand"
          render={(size) => (
            <Button variant="brand" size={size === "default" ? "default" : size}>
              Publish
            </Button>
          )}
        />
        <ButtonRow
          label="With leading icon"
          render={(size) => (
            <Button size={size === "default" ? "default" : size}>
              <Mail size={14} />
              Email
            </Button>
          )}
        />
        <ButtonRow
          label="Circular"
          render={(size) => {
            const buttonSize =
              size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon";
            return (
              <Button size={buttonSize} className="rounded-full">
                <Plus size={16} />
              </Button>
            );
          }}
        />
      </div>
    </div>
  );
}
