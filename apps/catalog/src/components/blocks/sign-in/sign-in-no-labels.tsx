import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import { Separator } from "@hilum/ui";
import { Label } from "@hilum/ui";

export default function SignInNoLabels() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary">
          <span className="body font-bold text-white">D</span>
        </div>
        <h1 className="heading text-ground-900">Sign in</h1>
        <p className="mt-1 body text-ground-400">
          New here?{" "}
          <a href="#" className="font-medium text-ground-900 underline underline-offset-2">
            Create an account
          </a>
        </p>
      </div>
      <form className="flex flex-col gap-4">
        <div>
          <label className="sr-only" htmlFor="nolabel-email">
            Email address
          </label>
          <label className="sr-only" htmlFor="nolabel-pw">
            Password
          </label>
          <Input
            id="nolabel-email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className="rounded-b-none border-b-ground-100"
          />
          <Input
            id="nolabel-pw"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="rounded-t-none -mt-px"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember2" />
            <Label htmlFor="remember2">Remember me</Label>
          </div>
          <a href="#" className="caption font-medium text-ground-500 hover:text-ground-900">
            Forgot password?
          </a>
        </div>
        <Button className="w-full">Sign in</Button>
      </form>
      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="caption text-ground-400">Or</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        {["Continue with GitHub", "Continue with Google"].map((label) => (
          <Button key={label} variant="outline" className="w-full">
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
