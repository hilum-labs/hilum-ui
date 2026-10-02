"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { useFieldControl } from "../lib/field-context";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * input-otp appends a `<style id="input-otp-style">` the first time an OTP
 * input mounts, unless an element with that id already exists. Under a strict
 * Content-Security-Policy that tag is blocked and logged as a violation, and
 * its rules never apply; tokens.css ships the same rules statically. Claim the
 * id with an inert `<meta>` first (layout effects run before input-otp's
 * effect), so no `<style>` is attempted.
 */
function useStaticOtpStyles() {
  useIsomorphicLayoutEffect(() => {
    if (document.getElementById("input-otp-style")) return;
    const marker = document.createElement("meta");
    marker.id = "input-otp-style";
    marker.setAttribute("data-hilum", "input-otp styles ship in @hilum/ui tokens.css");
    document.head.appendChild(marker);
  }, []);
}

function InputOTP({
  className,
  containerClassName,
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: React.ComponentProps<typeof OTPInput>) {
  // Inside a <Field>, the (visually hidden) input takes the field's label,
  // hint / error, invalid, required and disabled state; the slots show the
  // error border.
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  });
  useStaticOtpStyles();
  return (
    <OTPInput
      data-slot="input-otp"
      {...fieldProps}
      containerClassName={cn(
        "group/input-otp flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}
InputOTP.displayName = "InputOTP";

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      className={cn(
        "relative flex h-12 w-11 items-center justify-center",
        "border-y border-e border-border body font-medium text-foreground",
        "first:rounded-s-xl first:border-s last:rounded-e-xl",
        "transition-[border-color,box-shadow]",
        // Error state from the input's aria-invalid (e.g. <Field error>).
        "group-has-[input[aria-invalid=true]]/input-otp:border-destructive-text",
        isActive && "z-10 ring-2 ring-brand-primary/40 border-brand-primary",
        isActive &&
          "group-has-[input[aria-invalid=true]]/input-otp:border-destructive-text group-has-[input[aria-invalid=true]]/input-otp:ring-destructive/35",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}
InputOTPSlot.displayName = "InputOTPSlot";

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <Minus size={14} className="text-muted-foreground" />
    </div>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
