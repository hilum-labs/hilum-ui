import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "../alert";
import { Card } from "../card";
import { Breadcrumb, BreadcrumbSeparator } from "../breadcrumb";
import { CheckboxCard } from "../checkbox-card";
import { CodeBlock, CODE_BLOCK_DEFAULT_LABELS } from "../code-block";
import { ColorInput } from "../color-input";
import { ColorPicker } from "../color-picker";
import { Combobox } from "../combobox";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { FileDropzone } from "../file-dropzone";
import { FileThumbnail } from "../file-thumbnail";
import { HelpTooltip } from "../help-tooltip";
import { AvatarWithStatus } from "../avatar";

describe("React 19 ref-as-prop", () => {
  it("forwards refs on plain and custom-prop components", () => {
    const alertRef = React.createRef<HTMLDivElement>();
    const cardRef = React.createRef<HTMLDivElement>();
    const labelRef = React.createRef<HTMLLabelElement>();
    render(
      <>
        <Alert ref={alertRef}>Heads up</Alert>
        <Card ref={cardRef}>Body</Card>
        <CheckboxCard ref={labelRef} label="Opt in" />
      </>,
    );
    expect(alertRef.current).toBeInstanceOf(HTMLDivElement);
    expect(alertRef.current).toHaveAttribute("data-slot", "alert");
    expect(cardRef.current).toHaveAttribute("data-slot", "card");
    expect(labelRef.current?.tagName).toBe("LABEL");
    expect(labelRef.current).toHaveAttribute("data-slot", "checkbox-card");
  });

  it("lets a caller-supplied data-slot win", () => {
    render(<Alert data-slot="custom">x</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "custom");
  });

  it("keeps the separator prop off the DOM", () => {
    const { container } = render(
      <Breadcrumb separator="/">
        <ol>
          <BreadcrumbSeparator />
        </ol>
      </Breadcrumb>,
    );
    const nav = container.querySelector("nav")!;
    expect(nav).toHaveAttribute("data-slot", "breadcrumb");
    expect(nav).not.toHaveAttribute("separator");
    // Directional separator chevron mirrors in RTL.
    expect(container.querySelector("svg")).toHaveClass("rtl:-scale-x-100");
  });

  it("positions the avatar status dot on the logical end edge", () => {
    const { container } = render(<AvatarWithStatus status="online" />);
    expect(
      container.querySelector("[data-slot='avatar-with-status'] > span:last-child"),
    ).toHaveClass("end-0");
  });
});

describe("i18n label overrides", () => {
  it("CodeBlock uses default and overridden copy labels", () => {
    const { rerender } = render(<CodeBlock>npm i</CodeBlock>);
    expect(
      screen.getByRole("button", { name: CODE_BLOCK_DEFAULT_LABELS.copy }),
    ).toBeInTheDocument();
    rerender(<CodeBlock labels={{ copy: "Copier" }}>npm i</CodeBlock>);
    expect(screen.getByRole("button", { name: "Copier" })).toBeInTheDocument();
  });

  it("HelpTooltip trigger label is overridable", () => {
    render(<HelpTooltip text="Explains things" labels={{ trigger: "Aide" }} />);
    expect(screen.getByRole("button", { name: "Aide" })).toBeInTheDocument();
  });

  it("ColorInput field labels are overridable", () => {
    render(
      <ColorInput
        value="#ff0000"
        onChange={() => {}}
        opacity={50}
        onOpacityChange={() => {}}
        labels={{ hex: "Hex", opacity: "Opacité" }}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Hex" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Opacité" })).toBeInTheDocument();
  });

  it("ColorPicker passes labels to its controls through context", () => {
    render(<ColorPicker labels={{ hexValue: "Valeur hex" }} />);
    expect(screen.getByRole("textbox", { name: "Valeur hex" })).toBeInTheDocument();
  });

  it("Combobox toggle label is overridable", () => {
    render(
      <Combobox
        options={[{ value: "a", label: "A" }]}
        labels={{ open: "Ouvrir" }}
        aria-label="Pick"
      />,
    );
    expect(screen.getByRole("button", { name: "Ouvrir" })).toBeInTheDocument();
  });

  it("DialogContent close label is overridable", () => {
    render(
      <Dialog open>
        <DialogContent closeLabel="Fermer">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });

  it("FileDropzone multi-file summary is overridable", () => {
    render(
      <FileDropzone
        multiple
        selectedFiles={[
          { name: "a.txt", size: 10 },
          { name: "b.txt", size: 20 },
        ]}
        labels={{ filesSelected: (n) => `${n} fichiers`, readyToUpload: "Prêt" }}
      />,
    );
    expect(screen.getByText("2 fichiers")).toBeInTheDocument();
    expect(screen.getByText("Prêt")).toBeInTheDocument();
  });

  it("FileThumbnail fallback strings are overridable", () => {
    render(<FileThumbnail labels={{ untitled: "Sans titre", file: "Fichier" }} />);
    expect(screen.getByText("Sans titre")).toBeInTheDocument();
    expect(screen.getAllByText("Fichier").length).toBeGreaterThan(0);
  });
});
