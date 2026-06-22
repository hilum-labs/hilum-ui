import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import { Separator } from "@hilum/ui";
import { Label } from "@hilum/ui";

export default function SignInCard() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary">
          <span className="body font-bold text-white">D</span>
        </div>
        <h1 className="heading text-ground-900">Sign in to your account</h1>
        <p className="mt-1 body text-ground-400">
          Or{" "}
          <a href="#" className="font-medium text-ground-900 underline underline-offset-2">
            start your free trial
          </a>
        </p>
      </div>
      <div className="rounded-xl border border-ground-100 bg-white p-6 shadow-natural">
        <form className="flex flex-col gap-4">
          <Field label="Email address" htmlFor="sign-in-email">
            <Input
              id="sign-in-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password" htmlFor="sign-in-pw">
            <Input
              id="sign-in-pw"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <a href="#" className="caption font-medium text-ground-500 hover:text-ground-900">
              Forgot password?
            </a>
          </div>
          <Button className="mt-1 w-full">Sign in</Button>
        </form>
        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="caption text-ground-400">Or continue with</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["GitHub", "Google", "Apple"].map((provider) => (
            <Button key={provider} variant="outline" size="sm" className="w-full">
              {provider}
            </Button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center caption text-ground-400">
        Don&apos;t have an account?{" "}
        <a href="#" className="font-semibold text-ground-900 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
