
import { useState } from "react";
import { Check, ChevronRight, CreditCard, Package, User } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hilum/ui";

const STATES = ["California", "New York", "Texas", "Washington"];
const COUNTRIES = ["United States", "Canada", "Mexico"];
const STEPS = [
  { label: "Contact", icon: User },
  { label: "Shipping", icon: Package },
  { label: "Payment", icon: CreditCard },
];

function FormField({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  );
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField id={`${prefix}-first-name`} label="First name" placeholder="Ava" />
      <FormField id={`${prefix}-last-name`} label="Last name" placeholder="Mitchell" />
      <div className="sm:col-span-2">
        <FormField id={`${prefix}-email`} label="Email" type="email" placeholder="ava@example.com" />
      </div>
    </div>
  );
}

function ShippingFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField id={`${prefix}-address`} label="Address" placeholder="123 Market Street" />
      </div>
      <FormField id={`${prefix}-city`} label="City" placeholder="San Francisco" />
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-state`}>State</Label>
        <Select defaultValue="California">
          <SelectTrigger id={`${prefix}-state`}>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FormField id={`${prefix}-postal`} label="Postal code" placeholder="94105" />
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-country`}>Country</Label>
        <Select defaultValue="United States">
          <SelectTrigger id={`${prefix}-country`}>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PaymentFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2 sm:col-span-3">
        <Label htmlFor={`${prefix}-card-number`}>Card number</Label>
        <Input id={`${prefix}-card-number`} placeholder="4242 4242 4242 4242" />
      </div>
      <FormField id={`${prefix}-expiry`} label="Expiry" placeholder="04 / 28" />
      <FormField id={`${prefix}-cvc`} label="CVC" placeholder="243" />
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-taupe-100 p-5">
      <div className="mb-5">
        <h3 className="subheading text-taupe-900">{title}</h3>
        <p className="caption mt-1 text-taupe-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function MultiStepCheckout() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-[32px] border border-taupe-200 bg-white p-8 shadow-natural">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  isCompleted
                    ? "border-brand-primary/20 bg-brand-primary/10"
                    : isCurrent
                      ? "border-brand-primary bg-white"
                      : "border-taupe-200 bg-taupe-50"
                }`}
              >
                <div
                  className={`flex size-9 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-brand-primary text-white"
                      : isCurrent
                        ? "ring-2 ring-brand-primary text-brand-primary"
                        : "bg-white text-taupe-400"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div>
                  <p className={`label ${isCompleted || isCurrent ? "text-brand-primary" : "text-taupe-400"}`}>
                    Step {index + 1}
                  </p>
                  <p className="body font-medium text-taupe-900">{step.label}</p>
                </div>
              </button>
            );
          })}
        </div>
        {currentStep === 0 ? (
          <FormSection title="Contact information" description="Start with the customer details for this order.">
            <ContactFields prefix="step-contact" />
          </FormSection>
        ) : null}
        {currentStep === 1 ? (
          <FormSection title="Shipping address" description="Set the destination before selecting payment.">
            <ShippingFields prefix="step-shipping" />
          </FormSection>
        ) : null}
        {currentStep === 2 ? (
          <FormSection title="Payment" description="Finish the order with a payment method.">
            <PaymentFields prefix="step-payment" />
          </FormSection>
        ) : null}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{STEPS[currentStep].label}</Badge>
            <Button onClick={() => setCurrentStep((step) => Math.min(STEPS.length - 1, step + 1))}>
              {currentStep === STEPS.length - 1 ? "Pay now" : "Continue"}
              {currentStep === STEPS.length - 1 ? null : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
