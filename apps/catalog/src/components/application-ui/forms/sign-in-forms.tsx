
import { type ReactNode, useState } from "react";
import { Button } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ground-100 bg-ground-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-ground-400">{title}</p>
      {children}
    </div>
  );
}

export default function SignInForms() {
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-8">
        <VariantCard title="1. Simple card" className="bg-ground-50 p-0">
          <div className="mx-auto max-w-sm rounded-3xl border border-ground-100 bg-white p-8 shadow-elevated">
            <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-brand-primary text-sm font-semibold text-white">
              DS
            </div>
            <div className="mb-6 text-center">
              <h3 className="heading text-ground-900">Sign in to your account</h3>
              <p className="caption mt-1 text-ground-400">
                Use your work email to continue.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sign-in-email">Email</Label>
                <Input id="sign-in-email" type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-password">Password</Label>
                <Input
                  id="sign-in-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <span className="caption text-ground-500">Remember me</span>
                </label>
                <a href="#" className="caption text-brand-primary hover:text-brand-primary/80">
                  Forgot password?
                </a>
              </div>
              <Button className="w-full">Sign in</Button>
            </div>
          </div>
        </VariantCard>

        <VariantCard title="2. Split screen" className="p-0">
          <div className="overflow-hidden rounded-3xl border border-ground-100 bg-white shadow-elevated">
            <div className="grid md:grid-cols-2">
              <div className="bg-brand-primary px-8 py-10 text-white">
                <div className="mb-10 flex size-12 items-center justify-center rounded-2xl bg-white/15 text-sm font-semibold">
                  DS
                </div>
                <h3 className="heading mb-3">Build faster with a consistent system</h3>
                <p className="body max-w-sm text-white/80">
                  Access shared foundations, reusable patterns, and the latest release
                  notes for every application team.
                </p>
              </div>
              <div className="px-8 py-10">
                <div className="mb-6">
                  <h3 className="heading text-ground-900">Welcome back</h3>
                  <p className="caption mt-1 text-ground-400">
                    Sign in with the account you use for internal tools.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="split-email">Email</Label>
                    <Input id="split-email" type="email" defaultValue="tom@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="split-password">Password</Label>
                    <Input id="split-password" type="password" defaultValue="password" />
                  </div>
                  <Button className="w-full">Sign in</Button>
                </div>
              </div>
            </div>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
