import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip, TooltipProvider } from "../tooltip";
import { FileThumbnail, loadPdfjs, setPdfWorkerSrc } from "../file-thumbnail";

vi.mock("pdfjs-dist", () => ({
  version: "9.9.9",
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(),
}));

describe("Tooltip hook order", () => {
  it("survives content toggling between undefined and defined", () => {
    const { rerender } = render(
      <TooltipProvider>
        <Tooltip content={undefined}>
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(() =>
      rerender(
        <TooltipProvider>
          <Tooltip content="Hello">
            <button type="button">Trigger</button>
          </Tooltip>
        </TooltipProvider>,
      ),
    ).not.toThrow();
    expect(() =>
      rerender(
        <TooltipProvider>
          <Tooltip content={undefined}>
            <button type="button">Trigger</button>
          </Tooltip>
        </TooltipProvider>,
      ),
    ).not.toThrow();
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });
});

describe("FileThumbnail", () => {
  it("survives going from no file to a file", () => {
    const createObjectURL = vi.fn(() => "blob:preview");
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });

    const { rerender } = render(<FileThumbnail name="a.png" type="PNG" />);
    expect(screen.getByText("a.png")).toBeInTheDocument();

    const file = new File(["x"], "a.png", { type: "image/png" });
    expect(() => rerender(<FileThumbnail file={file} />)).not.toThrow();
    expect(screen.getByRole("img", { name: "a.png" })).toHaveAttribute("src", "blob:preview");

    expect(() => rerender(<FileThumbnail name="a.png" />)).not.toThrow();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });
});

describe("pdf.js worker source", () => {
  beforeEach(async () => {
    const mod = await import("pdfjs-dist");
    mod.GlobalWorkerOptions.workerSrc = "";
    setPdfWorkerSrc(undefined);
  });

  it("falls back to the jsDelivr build matching the pdfjs version", async () => {
    const mod = await loadPdfjs();
    expect(mod.GlobalWorkerOptions.workerSrc).toBe(
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@9.9.9/build/pdf.worker.min.mjs",
    );
  });

  it("uses the app-wide worker set via setPdfWorkerSrc", async () => {
    setPdfWorkerSrc("/assets/pdf.worker.mjs");
    const mod = await loadPdfjs();
    expect(mod.GlobalWorkerOptions.workerSrc).toBe("/assets/pdf.worker.mjs");
  });

  it("prefers a per-call worker source", async () => {
    setPdfWorkerSrc("/assets/pdf.worker.mjs");
    const mod = await loadPdfjs("/other/worker.mjs");
    expect(mod.GlobalWorkerOptions.workerSrc).toBe("/other/worker.mjs");
  });

  it("keeps a worker the app configured on pdfjs-dist directly", async () => {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/app/worker.mjs";
    const mod = await loadPdfjs();
    expect(mod.GlobalWorkerOptions.workerSrc).toBe("/app/worker.mjs");
  });
});
