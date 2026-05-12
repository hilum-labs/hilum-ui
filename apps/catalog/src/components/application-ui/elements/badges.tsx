import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@hilum/ui";

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "brand"
  | "success"
  | "warning";

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-taupe-100 bg-taupe-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-taupe-400">{title}</p>
      {children}
    </div>
  );
}

export default function Badges() {
  const [removableBadges, setRemovableBadges] = useState<
    Array<{ id: string; label: string; variant: BadgeVariant }>
  >([
    { id: "active", label: "Active", variant: "default" },
    { id: "review", label: "In review", variant: "brand" },
    { id: "success", label: "Synced", variant: "success" },
  ]);

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5">
        <VariantCard title="1. Basic badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </VariantCard>

        <VariantCard title="2. Rounded badges">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full px-3 py-1">Default</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Secondary
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Outline
            </Badge>
            <Badge variant="brand" className="rounded-full px-3 py-1">
              Brand
            </Badge>
            <Badge variant="success" className="rounded-full px-3 py-1">
              Success
            </Badge>
            <Badge variant="warning" className="rounded-full px-3 py-1">
              Warning
            </Badge>
          </div>
        </VariantCard>

        <VariantCard title="3. With dot">
          <div className="flex flex-wrap gap-2">
            <Badge>
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              Active
            </Badge>
            <Badge variant="secondary">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              Draft
            </Badge>
            <Badge variant="outline">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              Paused
            </Badge>
            <Badge variant="brand">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              New
            </Badge>
            <Badge variant="success">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              Synced
            </Badge>
            <Badge variant="warning">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
              Review
            </Badge>
          </div>
        </VariantCard>

        <VariantCard title="4. Large badges">
          <div className="flex flex-wrap gap-2">
            <Badge className="px-3 py-1 text-sm">Default</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Secondary
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              Outline
            </Badge>
            <Badge variant="brand" className="px-3 py-1 text-sm">
              Brand
            </Badge>
            <Badge variant="success" className="px-3 py-1 text-sm">
              Success
            </Badge>
            <Badge variant="warning" className="px-3 py-1 text-sm">
              Warning
            </Badge>
          </div>
        </VariantCard>

        <VariantCard title="5. With remove button">
          <div className="flex flex-wrap gap-2">
            {removableBadges.map((badge) => (
              <Badge key={badge.id} variant={badge.variant}>
                {badge.label}
                <button
                  type="button"
                  onClick={() =>
                    setRemovableBadges((current) =>
                      current.filter((item) => item.id !== badge.id)
                    )
                  }
                  className="ml-1 hover:text-current/80"
                  aria-label={`Remove ${badge.label}`}
                >
                  <X size={10} />
                </button>
              </Badge>
            ))}
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
