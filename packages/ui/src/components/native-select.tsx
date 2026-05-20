import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "peer h-9 w-full appearance-none rounded-lg border border-ground-200 bg-white pl-3 pr-8",
        "body text-ground-900",
        "focus:outline-none focus:ring-2 focus:ring-ground-400/30 focus:border-ground-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ground-400 peer-disabled:opacity-50"
    />
  </div>
));
NativeSelect.displayName = "NativeSelect";

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>((props, ref) => <option ref={ref} {...props} />);
NativeSelectOption.displayName = "NativeSelectOption";

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  React.OptgroupHTMLAttributes<HTMLOptGroupElement>
>((props, ref) => <optgroup ref={ref} {...props} />);
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
