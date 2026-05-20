
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@hilum/ui";

const CODE = {
  sixDigit: `import { useState } from "react"
import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from "@hilum/ui"

const [value, setValue] = useState("")

<div className="flex flex-col items-center gap-3">
  <InputOTP maxLength={6} value={value} onChange={setValue}>
    <InputOTPGroup>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTP>
  <p className="caption text-ground-400">
    {value ? \`Code: \${value}\` : "Enter your 6-digit code"}
  </p>
</div>`,

  withSeparator: `import {
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator,
} from "@hilum/ui"

<InputOTP maxLength={6}>
  <InputOTPGroup>
    {[0, 1, 2].map((i) => (
      <InputOTPSlot key={i} index={i} />
    ))}
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    {[3, 4, 5].map((i) => (
      <InputOTPSlot key={i} index={i} />
    ))}
  </InputOTPGroup>
</InputOTP>`,

  fourPin: `import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from "@hilum/ui"

<div className="flex flex-col items-center gap-3">
  <p className="label text-ground-500">Enter your PIN</p>
  <InputOTP maxLength={4}>
    <InputOTPGroup>
      {[0, 1, 2, 3].map((i) => (
        <InputOTPSlot
          key={i}
          index={i}
          className="h-14 w-13"
        />
      ))}
    </InputOTPGroup>
  </InputOTP>
</div>`,

  completed: `import {
  InputOTP, InputOTPGroup, InputOTPSlot,
} from "@hilum/ui"

<div className="flex flex-col items-center gap-3">
  <InputOTP maxLength={6} value="123456" readOnly>
    <InputOTPGroup>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <InputOTPSlot
          key={i}
          index={i}
          className="border-green-400 text-green-700"
        />
      ))}
    </InputOTPGroup>
  </InputOTP>
  <div className="flex items-center gap-1.5 text-green-600">
    <CheckCircle2 size={14} />
    <p className="caption font-medium">Code verified successfully</p>
  </div>
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SixDigitDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col items-center gap-3">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="caption text-ground-400">
        {value ? `Code: ${value}` : "Enter your 6-digit code"}
      </p>
    </div>
  );
}

export default function InputOTPPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Input OTP</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Input OTP</h1>
        <p className="body max-w-lg text-ground-500">
          One-time password input with individual character slots — used for
          verification codes, PINs, and two-factor authentication.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Variants" />

        <PreviewBlock
          title="6-digit code"
          description="Standard verification code input with live value display"
          code={CODE.sixDigit}
        >
          <SixDigitDemo />
        </PreviewBlock>

        <PreviewBlock
          title="With separator"
          description="Two groups of 3 separated by a dash — common for confirmation codes"
          code={CODE.withSeparator}
        >
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              {[0, 1, 2].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {[3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </PreviewBlock>

        <PreviewBlock
          title="4-digit PIN"
          description="Slightly larger slots for numeric PIN entry"
          code={CODE.fourPin}
        >
          <div className="flex flex-col items-center gap-3">
            <p className="label text-ground-500">Enter your PIN</p>
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-14 w-13"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Completed state"
          description="All slots filled — shows a success treatment with a verified badge"
          code={CODE.completed}
        >
          <div className="flex flex-col items-center gap-3">
            <InputOTP maxLength={6} value="123456" readOnly>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={cn(
                      "border-green-400 text-green-700",
                      "first:rounded-l-xl last:rounded-r-xl"
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 size={14} />
              <p className="caption font-medium">Code verified successfully</p>
            </div>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
