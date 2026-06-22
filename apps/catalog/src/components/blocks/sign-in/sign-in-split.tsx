import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Separator } from "@hilum/ui";

export default function SignInSplit() {
  return (
    <div className="flex overflow-hidden rounded-xl border border-ground-100 shadow-natural">
      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-8 py-10">
        <div className="mx-auto w-full max-w-xs">
          <div className="mb-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary">
              <span className="caption font-bold text-white">D</span>
            </div>
            <h1 className="subheading font-semibold text-ground-900">Sign in to your account</h1>
            <p className="mt-1 caption text-ground-400">
              Or{" "}
              <a href="#" className="font-medium text-ground-900 underline underline-offset-2">
                start your free trial
              </a>
            </p>
          </div>
          <form className="flex flex-col gap-3">
            <Field label="Email" htmlFor="split-email">
              <Input id="split-email" type="email" placeholder="you@example.com" />
            </Field>
            <Field label="Password" htmlFor="split-pw">
              <Input id="split-pw" type="password" placeholder="••••••••" />
            </Field>
            <a
              href="#"
              className="caption font-medium text-ground-500 hover:text-ground-900 self-end -mt-0.5"
            >
              Forgot password?
            </a>
            <Button className="w-full mt-1">Sign in</Button>
          </form>
          <div className="mt-4 flex flex-col gap-2">
            <Separator />
            {["GitHub", "Google"].map((p) => (
              <Button key={p} variant="outline" size="sm" className="w-full">
                Continue with {p}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Brand side */}
      <div className="hidden w-64 flex-col items-center justify-center bg-brand-primary px-8 md:flex">
        <p className="heading font-semibold text-white text-center leading-snug">
          Build beautiful interfaces, faster.
        </p>
        <p className="mt-3 caption text-white/70 text-center">
          Join thousands of teams using our design system to ship faster.
        </p>
      </div>
    </div>
  );
}
