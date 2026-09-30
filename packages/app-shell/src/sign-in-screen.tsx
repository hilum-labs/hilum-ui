import type { ReactNode } from "react";
import { MediaObject, cn } from "@hilum/ui";

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
  /** Id of the `<main>` region wrapping the form. Default: `main-content`. */
  mainId?: string;
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
  mainId = "main-content",
  className,
}: SignInScreenProps) {
  return (
    <div className={cn("flex min-h-dvh bg-muted", className)}>
      <main
        id={mainId}
        tabIndex={-1}
        className={cn(
          "focus:outline-none",
          "flex flex-1 items-center justify-center p-6",
          decoration && "lg:flex-none lg:w-1/2",
        )}
      >
        <div className="w-full max-w-sm">
          {logo && <div className="mb-8">{logo}</div>}
          <div className="mb-6">
            <h1 className="heading-xl text-balance text-foreground">{title}</h1>
            {description && (
              <p className="body mt-2 text-pretty text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
          {footer && <div className="mt-6 caption text-muted-foreground">{footer}</div>}
        </div>
      </main>

      {decoration && (
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-card border-s border-border">
          {decoration}
        </div>
      )}
    </div>
  );
}

interface SignInHighlight {
  /** Icon element, e.g. `<ShieldCheck />`. Sized for you. */
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

interface SignInDecorationProps {
  /** Headline, e.g. "Everything your store needs, in one place." */
  title: ReactNode;
  description?: ReactNode;
  /** Short reasons to sign in, each with an icon. */
  highlights?: SignInHighlight[];
  className?: string;
}

/**
 * The standard content for `<SignInScreen decoration>`: a headline, a line of
 * copy and a few icon highlights, so every app's sign-in page reads the same.
 */
function SignInDecoration({
  title,
  description,
  highlights = [],
  className,
}: SignInDecorationProps) {
  return (
    <div
      className={cn("flex max-w-xl flex-col gap-8 p-10", className)}
      data-slot="sign-in-decoration"
    >
      <div className="flex flex-col gap-4">
        <h2 className="heading-xl max-w-lg text-balance text-foreground">{title}</h2>
        {description && (
          <p className="body max-w-lg text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {highlights.length > 0 && (
        <ul className="flex flex-col gap-3">
          {highlights.map((highlight, index) => (
            <li key={index}>
              <MediaObject
                gap="sm"
                media={
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground [&_svg]:size-4"
                    aria-hidden="true"
                  >
                    {highlight.icon}
                  </span>
                }
              >
                <p className="body-sm font-semibold text-foreground">{highlight.title}</p>
                {highlight.description && (
                  <p className="caption mt-0.5 text-muted-foreground">{highlight.description}</p>
                )}
              </MediaObject>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { SignInScreen, SignInDecoration };
export type { SignInScreenProps, SignInDecorationProps, SignInHighlight };
