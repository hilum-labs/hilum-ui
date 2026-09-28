import { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AskUserQuestions } from "../ask-user-questions";
import type { AskUserAnswer, AskUserQuestion } from "../ask-user-questions";

const questions: AskUserQuestion[] = [
  {
    id: "colour",
    title: "Pick a colour",
    options: [
      { id: "red", title: "Red", description: "Warm" },
      { id: "blue", title: "Blue" },
    ],
    allowOther: true,
    otherPlaceholder: "Something else",
  },
  {
    id: "toppings",
    title: "Pick toppings",
    multiSelect: true,
    layout: "stacked",
    chipPosition: "left",
    options: [
      { id: "cheese", title: "Cheese", description: "Mozzarella" },
      { id: "olives", title: "Olives" },
      { id: "basil", title: "Basil" },
    ],
  },
  {
    id: "size",
    title: "Pick a size",
    skippable: false,
    options: [{ title: "Small" }, { title: "Large" }],
  },
];

function heading() {
  return screen.getByRole("heading", { level: 3 });
}

describe("AskUserQuestions flow", () => {
  it("single-select advances, multi-select continues, and the last answer completes", async () => {
    const onAnswersChange = vi.fn();
    const onComplete = vi.fn();
    const onCurrentIndexChange = vi.fn();
    render(
      <AskUserQuestions
        questions={questions}
        onAnswersChange={onAnswersChange}
        onComplete={onComplete}
        onCurrentIndexChange={onCurrentIndexChange}
      />,
    );

    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Pick a colour" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Blue" }));

    expect(onAnswersChange).toHaveBeenLastCalledWith({
      colour: { questionId: "colour", selectedIds: ["blue"], skipped: false },
    });
    expect(onCurrentIndexChange).toHaveBeenLastCalledWith(1);
    expect(heading()).toHaveTextContent("Pick toppings");

    // Multi-select: toggling keeps us on the question; Continue is disabled until
    // something is chosen.
    const continueBtn = screen.getByRole("button", { name: /Continue/ });
    expect(continueBtn).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: "Cheese Mozzarella" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Basil" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Cheese Mozzarella" }));
    expect(screen.getByRole("checkbox", { name: "Basil" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "Cheese Mozzarella" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(heading()).toHaveTextContent("Pick toppings");
    fireEvent.click(screen.getByRole("button", { name: /Continue/ }));

    expect(heading()).toHaveTextContent("Pick a size");
    // Not skippable → no Skip button; last question → selecting completes.
    await waitFor(() => expect(screen.queryByRole("button", { name: /Skip/ })).toBeNull());
    fireEvent.click(screen.getByRole("radio", { name: "Large" }));
    expect(onComplete).toHaveBeenCalledWith({
      colour: { questionId: "colour", selectedIds: ["blue"], skipped: false },
      toppings: { questionId: "toppings", selectedIds: ["basil"], skipped: false },
      size: { questionId: "size", selectedIds: ["o-1"], skipped: false },
    });
  });

  it("skips and goes back", async () => {
    const onSkip = vi.fn();
    render(<AskUserQuestions questions={questions} onSkip={onSkip} skipLabel="Not now" />);

    fireEvent.click(screen.getByRole("button", { name: /Not now/ }));
    expect(onSkip).toHaveBeenCalledWith("colour", 0);
    expect(heading()).toHaveTextContent("Pick toppings");

    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(heading()).toHaveTextContent("Pick a colour");
    await waitFor(() => expect(screen.queryByRole("button", { name: /Back/ })).toBeNull());
  });

  it("submits a free-text Other answer with Enter", () => {
    const onAnswersChange = vi.fn();
    render(<AskUserQuestions questions={questions} onAnswersChange={onAnswersChange} />);
    const other = screen.getByRole("textbox", { name: "Something else" });

    fireEvent.change(other, { target: { value: "  Teal  " } });
    expect(onAnswersChange).toHaveBeenLastCalledWith({
      colour: { questionId: "colour", selectedIds: [], otherText: "  Teal  ", skipped: false },
    });
    // Shift+Enter is a newline, not a submit.
    fireEvent.keyDown(other, { key: "Enter", shiftKey: true });
    expect(heading()).toHaveTextContent("Pick a colour");

    fireEvent.keyDown(other, { key: "Enter" });
    expect(onAnswersChange).toHaveBeenLastCalledWith({
      colour: { questionId: "colour", selectedIds: [], otherText: "Teal", skipped: false },
    });
    expect(heading()).toHaveTextContent("Pick toppings");
  });

  it("ignores Enter on an empty Other field", () => {
    render(<AskUserQuestions questions={questions} />);
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Something else" }), { key: "Enter" });
    expect(heading()).toHaveTextContent("Pick a colour");
  });

  it("selects with number keys and focuses Other with the next number", () => {
    const onAnswersChange = vi.fn();
    render(<AskUserQuestions questions={questions} onAnswersChange={onAnswersChange} />);

    fireEvent.keyDown(document.body, { key: "3" });
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Something else" }));
    // Typing digits inside the field must not trigger shortcuts.
    fireEvent.keyDown(document.activeElement!, { key: "1" });
    expect(onAnswersChange).not.toHaveBeenCalled();

    fireEvent.keyDown(document.body, { key: "1", metaKey: true });
    expect(onAnswersChange).not.toHaveBeenCalled();

    fireEvent.keyDown(document.body, { key: "1" });
    expect(onAnswersChange).toHaveBeenLastCalledWith({
      colour: { questionId: "colour", selectedIds: ["red"], skipped: false },
    });

    // Multi-select question: number keys toggle.
    fireEvent.keyDown(document.body, { key: "2" });
    fireEvent.keyDown(document.body, { key: "3" });
    expect(screen.getByRole("checkbox", { name: "Olives" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "Basil" })).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(document.body, { key: "9" });
    expect(heading()).toHaveTextContent("Pick toppings");
  });

  it("navigates rows with arrows / Home / End and selects with Enter and Space", () => {
    const onAnswersChange = vi.fn();
    render(<AskUserQuestions questions={questions} onAnswersChange={onAnswersChange} />);
    const group = screen.getByRole("radiogroup");
    const red = screen.getByRole("radio", { name: "Red Warm" });
    const blue = screen.getByRole("radio", { name: "Blue" });
    const other = screen.getByRole("textbox", { name: "Something else" });

    fireEvent.keyDown(group, { key: "ArrowDown" });
    expect(document.activeElement).toBe(red);
    fireEvent.keyDown(red, { key: "ArrowDown" });
    expect(document.activeElement).toBe(blue);
    fireEvent.keyDown(blue, { key: "End" });
    expect(document.activeElement).toBe(other);
    // ArrowDown from the (empty) Other field wraps to the first row.
    fireEvent.keyDown(other, { key: "ArrowDown" });
    expect(document.activeElement).toBe(red);
    fireEvent.keyDown(red, { key: "ArrowUp" });
    expect(document.activeElement).toBe(other);
    // Home/End inside the text field move the caret, not the row focus.
    fireEvent.keyDown(other, { key: "Home" });
    expect(document.activeElement).toBe(other);
    fireEvent.keyDown(other, { key: "ArrowDown" });
    fireEvent.keyDown(red, { key: "Home" });
    expect(document.activeElement).toBe(red);

    // ⌘/Ctrl+Enter on a row falls through (it's the multi-select Continue key).
    fireEvent.keyDown(red, { key: "Enter", ctrlKey: true });
    expect(onAnswersChange).not.toHaveBeenCalled();
    fireEvent.keyDown(red, { key: " " });
    expect(onAnswersChange).toHaveBeenCalledTimes(1);
    expect(heading()).toHaveTextContent("Pick toppings");

    // ArrowRight skips, ArrowLeft goes back.
    const toppings = screen.getByRole("group", { name: "Pick toppings" });
    fireEvent.keyDown(toppings, { key: "ArrowRight" });
    expect(heading()).toHaveTextContent("Pick a size");
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
    expect(heading()).toHaveTextContent("Pick toppings");
    fireEvent.keyDown(screen.getByRole("checkbox", { name: "Olives" }), { key: "Enter" });
    expect(screen.getByRole("checkbox", { name: "Olives" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("keeps caret movement inside a multi-line Other draft", () => {
    render(<AskUserQuestions questions={questions} />);
    const other = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Something else" });
    fireEvent.change(other, { target: { value: "line 1\nline 2" } });
    act(() => other.focus());
    other.setSelectionRange(3, 3);

    fireEvent.keyDown(other, { key: "ArrowUp" });
    fireEvent.keyDown(other, { key: "ArrowDown" });
    fireEvent.keyDown(other, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(other);
    expect(heading()).toHaveTextContent("Pick a colour");
  });

  it("commits a multi-select question with Ctrl+Enter", () => {
    const onComplete = vi.fn();
    render(<AskUserQuestions questions={[questions[1]!]} onComplete={onComplete} />);
    const root = screen.getByRole("group").closest(".max-w-\\[520px\\]") as HTMLElement;

    fireEvent.keyDown(root, { key: "Enter", ctrlKey: true });
    expect(onComplete).not.toHaveBeenCalled(); // nothing selected yet

    fireEvent.click(screen.getByRole("checkbox", { name: "Olives" }));
    fireEvent.keyDown(root, { key: "Enter" });
    expect(onComplete).not.toHaveBeenCalled(); // needs the modifier
    fireEvent.keyDown(root, { key: "Enter", ctrlKey: true });
    expect(onComplete).toHaveBeenCalledWith({
      toppings: { questionId: "toppings", selectedIds: ["olives"], skipped: false },
    });
    expect(screen.getByRole("button", { name: /Finish/ })).toBeInTheDocument();
  });

  it("works fully controlled", () => {
    function Controlled() {
      const [index, setIndex] = useState(1);
      const [answers, setAnswers] = useState<Record<string, AskUserAnswer>>({
        toppings: { questionId: "toppings", selectedIds: ["olives"] },
      });
      return (
        <>
          <output data-testid="state">{JSON.stringify({ index, answers })}</output>
          <AskUserQuestions
            questions={questions}
            currentIndex={index}
            onCurrentIndexChange={setIndex}
            answers={answers}
            onAnswersChange={setAnswers}
          />
        </>
      );
    }
    render(<Controlled />);
    expect(heading()).toHaveTextContent("Pick toppings");
    expect(screen.getByRole("checkbox", { name: "Olives" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Basil" }));
    fireEvent.click(screen.getByRole("button", { name: /Continue/ }));
    const state = JSON.parse(screen.getByTestId("state").textContent!);
    expect(state.index).toBe(2);
    expect(state.answers.toppings.selectedIds).toEqual(["olives", "basil"]);
  });

  it("starts from defaultCurrentIndex / defaultAnswers and keeps Other text on select", () => {
    const onAnswersChange = vi.fn();
    render(
      <AskUserQuestions
        questions={questions}
        defaultCurrentIndex={0}
        defaultAnswers={{
          colour: { questionId: "colour", selectedIds: [], otherText: "Teal" },
        }}
        onAnswersChange={onAnswersChange}
      />,
    );
    expect(screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Something else" }).value).toBe(
      "Teal",
    );
    fireEvent.click(screen.getByRole("radio", { name: "Red Warm" }));
    expect(onAnswersChange).toHaveBeenLastCalledWith({
      colour: { questionId: "colour", selectedIds: ["red"], skipped: false, otherText: "Teal" },
    });
  });
});
