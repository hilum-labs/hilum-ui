import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AskUserQuestions } from "../ask-user-questions";
import type { AskUserQuestion } from "../ask-user-questions";

const questions: AskUserQuestion[] = [
  {
    id: "q1",
    title: "Pick a colour",
    options: [
      { id: "red", title: "Red" },
      { id: "blue", title: "Blue" },
    ],
  },
];

describe("AskUserQuestions", () => {
  it("renders the empty state when there are no questions", () => {
    render(<AskUserQuestions questions={[]} />);
    expect(screen.getByText("No questions.")).toBeInTheDocument();
  });

  it("keeps hook order stable when questions load after the first render", () => {
    const { rerender } = render(<AskUserQuestions questions={[]} />);
    expect(screen.getByText("No questions.")).toBeInTheDocument();

    // Previously an early return before several hooks made this rerender
    // throw "Rendered more hooks than during the previous render".
    expect(() => rerender(<AskUserQuestions questions={questions} />)).not.toThrow();
    expect(screen.getByRole("heading", { name: "Pick a colour" })).toBeInTheDocument();
    expect(screen.getAllByText("Red").length).toBeGreaterThan(0);

    // …and back to empty again.
    expect(() => rerender(<AskUserQuestions questions={[]} />)).not.toThrow();
    expect(screen.getByText("No questions.")).toBeInTheDocument();
  });
});
