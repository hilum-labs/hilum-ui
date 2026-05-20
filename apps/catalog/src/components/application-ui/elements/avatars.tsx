import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";

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
    <div className={`rounded-2xl border border-ground-100 bg-ground-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-ground-400">{title}</p>
      {children}
    </div>
  );
}

export default function Avatars() {
  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 lg:grid-cols-2">
        <VariantCard title="1. Circular avatars">
          <div className="flex flex-wrap items-end gap-4">
            {["size-6", "size-8", "size-10", "size-12", "size-16"].map((size, index) => (
              <Avatar key={size} className={size}>
                <AvatarFallback className="bg-brand-primary text-white">
                  {["TC", "AP", "MF", "GL", "SR"][index]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </VariantCard>

        <VariantCard title="2. With top notification">
          <div className="flex items-center gap-6">
            {["TC", "AP", "MF"].map((initials) => (
              <div key={initials} className="relative">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-brand-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-brand-secondary ring-2 ring-white" />
              </div>
            ))}
          </div>
        </VariantCard>

        <VariantCard title="3. With text">
          <div className="space-y-4">
            {[
              ["Tom Cook", "tom@example.com", "TC"],
              ["Ana Portillo", "ana@example.com", "AP"],
            ].map(([name, email, initials]) => (
              <div key={email} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-brand-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="body font-medium text-ground-900">{name}</p>
                  <p className="caption text-ground-400">{email}</p>
                </div>
              </div>
            ))}
          </div>
        </VariantCard>

        <VariantCard title="4. Avatar group stacked">
          <div className="flex -space-x-2">
            {["TC", "AP", "MF", "GL", "SR"].map((initials) => (
              <Avatar key={initials} className="ring-2 ring-white">
                <AvatarFallback className="bg-brand-primary text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </VariantCard>

        <VariantCard title="5. With placeholder icon" className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-ground-100 text-ground-400">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-14">
              <AvatarFallback className="bg-ground-100 text-ground-400">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
