import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as ai from "../../ai";
import * as main from "../../index";
import {
  AskUserQuestions,
  ASK_USER_QUESTIONS_DEFAULT_LABELS,
  ChatMessage,
  InputMessage,
  INPUT_MESSAGE_DEFAULT_LABELS,
  ThinkingIndicator,
  ThinkingSteps,
  ThinkingStepsHeader,
  UrlRedirectPrompt,
} from "../../ai";

describe("@hilum/ui/ai entry", () => {
  it("exports the AI components and they are gone from the main entry", () => {
    for (const name of [
      "AskUserQuestions",
      "ChatMessage",
      "InputMessage",
      "ThinkingIndicator",
      "ThinkingSteps",
      "ThinkingStep",
      "UrlRedirectPrompt",
      "normalizeUrlHandle",
    ]) {
      expect(ai).toHaveProperty(name);
      expect(main).not.toHaveProperty(name);
    }
  });
});

describe("AI components: ref + data-slot", () => {
  it("ChatMessage forwards ref and sets data-slot", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ChatMessage ref={ref} from="user">
        Hi
      </ChatMessage>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "chat-message");
  });

  it("ThinkingIndicator forwards ref and uses labels.phrases", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ThinkingIndicator ref={ref} labels={{ phrases: ["Réflexion"] }} />);
    expect(ref.current).toHaveAttribute("data-slot", "thinking-indicator");
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Réflexion");
  });

  it("ThinkingSteps forwards ref and localizes the shorthand header", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ThinkingSteps ref={ref} labels={{ title: "Denken" }} steps={[{ label: "Step one" }]} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByRole("button", { name: /Denken/ })).toBeInTheDocument();
  });

  it("ThinkingStepsHeader defaults to the English title", () => {
    render(
      <ThinkingSteps>
        <ThinkingStepsHeader />
      </ThinkingSteps>,
    );
    expect(screen.getByRole("button", { name: /Thinking/ })).toBeInTheDocument();
  });

  it("UrlRedirectPrompt forwards ref and accepts labels", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <UrlRedirectPrompt
        ref={ref}
        originalHandle="a"
        nextHandle="b"
        pathPrefix="products"
        checked={false}
        onCheckedChange={() => {}}
        labels={{
          title: "Weiterleitung",
          switchLabel: "Weiterleitung erstellen",
          description: (from, to) => (
            <>
              Von {from} nach {to}
            </>
          ),
        }}
      />,
    );
    expect(ref.current).toHaveAttribute("data-slot", "url-redirect-prompt");
    expect(screen.getByText("Weiterleitung")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Weiterleitung erstellen" })).toBeInTheDocument();
    expect(screen.getByText("/products/a")).toBeInTheDocument();
  });
});

describe("InputMessage labels", () => {
  it("uses English defaults and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<InputMessage ref={ref} value="" onValueChange={() => {}} />);
    expect(ref.current).toHaveAttribute("data-slot", "input-message");
    expect(
      screen.getByRole("textbox", { name: INPUT_MESSAGE_DEFAULT_LABELS.message }),
    ).toHaveAttribute("placeholder", INPUT_MESSAGE_DEFAULT_LABELS.placeholder);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("overrides strings via labels; explicit props win", () => {
    render(
      <InputMessage
        value=""
        onValueChange={() => {}}
        sendLabel="Go"
        labels={{ message: "Nachricht", placeholder: "Frag mich", send: "Senden" }}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Nachricht" })).toHaveAttribute(
      "placeholder",
      "Frag mich",
    );
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("localizes queued rows", () => {
    render(
      <InputMessage
        value=""
        onValueChange={() => {}}
        status="streaming"
        queue={[{ id: "1", text: "", files: [new File(["x"], "a.png")] }]}
        onQueueChange={() => {}}
        labels={{
          attachments: (n) => `${n} Anhang`,
          queuedMessage: (i, t, l) => `Warteschlange ${i}/${t}: ${l}`,
        }}
      />,
    );
    expect(screen.getByLabelText("Warteschlange 1/1: 1 Anhang")).toBeInTheDocument();
  });
});

describe("AskUserQuestions labels", () => {
  const questions = [
    { id: "a", title: "First", options: [{ title: "One" }], allowOther: true },
    { id: "b", title: "Second", options: [{ title: "Two" }], multiSelect: true },
  ];

  it("uses English defaults", () => {
    render(<AskUserQuestions questions={questions} />);
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: ASK_USER_QUESTIONS_DEFAULT_LABELS.otherLabel }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Skip/ })).toBeInTheDocument();
  });

  it("overrides strings via labels and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AskUserQuestions
        ref={ref}
        questions={questions}
        labels={{
          progress: (c, t) => `Frage ${c} von ${t}`,
          skip: "Überspringen",
          back: "Zurück",
          finish: "Fertig",
          otherLabel: "Eigene Antwort",
        }}
      />,
    );
    expect(ref.current).toHaveAttribute("data-slot", "ask-user-questions");
    expect(screen.getByText("Frage 1 von 2")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Eigene Antwort" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Überspringen/ }));
    expect(screen.getByRole("button", { name: /Zurück/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fertig/ })).toBeInTheDocument();
  });

  it("localizes the empty state", () => {
    render(<AskUserQuestions questions={[]} labels={{ empty: "Keine Fragen." }} />);
    expect(screen.getByText("Keine Fragen.")).toBeInTheDocument();
  });
});
