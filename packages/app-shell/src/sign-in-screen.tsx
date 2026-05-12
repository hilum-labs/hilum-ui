import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface SignInScreenProps {
  /** Logo / brand block above the form. */
  logo?: ReactNode;
  /** Title — e.g. "Sign in to your account". */
  title: ReactNode;
  /** Optional description under the title. */
  description?: ReactNode;
  /** The form itself — fields + submit button. */
  children: ReactNode;
  /** Footer content under the form (e.g. "Don't have an account? Sign up"). */
  footer?: ReactNode;
  /** Right-side decorative panel. Hidden on mobile. */
  decoration?: ReactNode;
  className?: string;
}

/**
 * Auth shell — centered card with optional decorative panel beside it.
 * Wrap your form in <SignInScreen> and pass it as children.
 */
function SignInScreen({
  logo,
  title,
  description,
  children,
  footer,
  decoration,
  className,
}: SignInScreenProps) {
  return (
    <div className={cn("flex min-h-screen bg-taupe-50", className)}>
      <div
        className={cn(
          "flex flex-1 items-center justify-center p-6",
          decoration && "lg:flex-none lg:w-1/2",
        )}
      >
        <div className="w-full max-w-sm">
          {logo && <div className="mb-8">{logo}</div>}
          <div className="mb-6">
            <h1 className="heading-xl text-taupe-900">{title}</h1>
            {description && <p className="body text-taupe-500 mt-2">{description}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 caption text-taupe-500">{footer}</div>}
        </div>
      </div>

      {decoration && (
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white border-l border-taupe-100">
          {decoration}
        </div>
      )}
    </div>
  );
}

export { SignInScreen };
export type { SignInScreenProps };
