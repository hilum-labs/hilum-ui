import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  PreviewFrame,
  PREVIEW_FRAME_DEFAULT_LABELS,
  PREVIEW_FRAME_DEFAULT_SANDBOX,
} from "../preview-frame";

const SRC = "about:blank";

function iframe() {
  return screen.getByTitle("Preview of Dawn") as HTMLIFrameElement;
}

describe("PreviewFrame", () => {
  it("renders a sandboxed, titled iframe with a no-referrer policy", () => {
    render(<PreviewFrame src={SRC} title="Preview of Dawn" allow="clipboard-write" />);
    const frame = iframe();
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute("sandbox", PREVIEW_FRAME_DEFAULT_SANDBOX);
    expect(frame).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(frame).toHaveAttribute("allow", "clipboard-write");
    expect(frame).toHaveAttribute("src", SRC);
  });

  it("accepts a custom sandbox and referrer policy", () => {
    render(
      <PreviewFrame
        src={SRC}
        title="Preview of Dawn"
        sandbox="allow-scripts"
        referrerPolicy="origin"
      />,
    );
    expect(iframe()).toHaveAttribute("sandbox", "allow-scripts");
    expect(iframe()).toHaveAttribute("referrerpolicy", "origin");
  });

  it("shows a loading skeleton until the page loads", () => {
    const onLoad = vi.fn();
    const { container } = render(
      <PreviewFrame src={SRC} title="Preview of Dawn" onLoad={onLoad} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(PREVIEW_FRAME_DEFAULT_LABELS.loading);
    expect(container.querySelector("[data-slot=preview-frame-stage]")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    fireEvent.load(iframe());
    expect(onLoad).toHaveBeenCalled();
    expect(container.querySelector("[data-slot=preview-frame-loading]")).toBeNull();
    expect(container.querySelector("[data-slot=preview-frame-stage]")).not.toHaveAttribute(
      "aria-busy",
    );
  });

  it("switches devices with the toggle (uncontrolled and controlled)", () => {
    const onDeviceChange = vi.fn();
    const { container, rerender } = render(
      <PreviewFrame src={SRC} title="Preview of Dawn" onDeviceChange={onDeviceChange} />,
    );
    const root = container.querySelector("[data-slot=preview-frame]")!;
    expect(root).toHaveAttribute("data-device", "desktop");
    expect(screen.getByRole("group", { name: "Preview device" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Mobile" }));
    expect(onDeviceChange).toHaveBeenCalledWith("mobile");
    expect(root).toHaveAttribute("data-device", "mobile");
    expect(iframe().style.width).toBe("390px");

    rerender(
      <PreviewFrame
        src={SRC}
        title="Preview of Dawn"
        device="tablet"
        devices={["tablet", "desktop"]}
        deviceWidths={{ tablet: 768 }}
      />,
    );
    expect(root).toHaveAttribute("data-device", "tablet");
    expect(iframe().style.width).toBe("768px");
    expect(screen.queryByRole("radio", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("hides the toggle for a single device and shows toolbar content", () => {
    render(
      <PreviewFrame
        src="https://shop.example/preview"
        title="Preview of Dawn"
        devices={["desktop"]}
        showOpenInNewTab
        toolbar={<button type="button">Publish</button>}
      />,
    );
    expect(screen.queryByRole("group", { name: "Preview device" })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Open in new tab" });
    expect(link).toHaveAttribute("href", "https://shop.example/preview");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  it("shows the error state and reloads on retry", () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <PreviewFrame
        src={SRC}
        title="Preview of Dawn"
        error="The theme has a Liquid error."
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("The preview couldn't load");
    expect(screen.getByRole("alert")).toHaveTextContent("The theme has a Liquid error.");
    expect(screen.queryByTitle("Preview of Dawn")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
    rerender(<PreviewFrame src={SRC} title="Preview of Dawn" onRetry={onRetry} />);
    expect(iframe()).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading preview");
  });

  it("fails after loadTimeout and recovers with retry", () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    render(<PreviewFrame src={SRC} title="Preview of Dawn" loadTimeout={5000} onError={onError} />);
    act(() => {
      vi.advanceTimersByTime(5001);
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.load(iframe());
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(onError).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("localizes its strings and inserts no <style>", () => {
    const { container } = render(
      <PreviewFrame
        src={SRC}
        title="Preview of Dawn"
        labels={{ device: "Dispositivo", mobile: "Móvil", loading: "Cargando vista previa" }}
      />,
    );
    expect(screen.getByRole("group", { name: "Dispositivo" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Móvil" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Cargando vista previa");
    expect(container.querySelector("style")).toBeNull();
    expect(document.head.querySelector("style[data-hilum]")).toBeNull();
  });
});
