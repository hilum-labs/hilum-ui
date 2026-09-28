import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../form";
import { Input } from "../input";

type Values = { email: string; name: string };

function Example({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({ defaultValues: { email: "", name: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem required>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription>Receipts go here.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          rules={{ minLength: { value: 2, message: "Too short" } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              {/* No FormControl: wiring comes through FieldContext. */}
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Save</button>
      </form>
    </Form>
  );
}

describe("@hilum/ui/form", () => {
  it("labels and describes controls", () => {
    render(<Example onSubmit={() => {}} />);
    const email = screen.getByRole("textbox", { name: /Email/ });
    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(email).toHaveAttribute("aria-required", "true");
    expect(email).toHaveAccessibleDescription("Receipts go here.");
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("shows validation errors wired via aria-describedby / aria-invalid", async () => {
    const onSubmit = vi.fn();
    render(<Example onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "A" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
    });
    await waitFor(() => expect(screen.getByText("Email is required")).toBeInTheDocument());
    const email = screen.getByRole("textbox", { name: /Email/ });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Receipts go here. Email is required");
    const name = screen.getByRole("textbox", { name: "Name" });
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Too short");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

void React;
