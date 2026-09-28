// @vitest-environment node
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { cliVersion } from "../lib/version";

describe("cliVersion", () => {
  it("reports the package.json version", () => {
    const pkg = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../package.json"), "utf8"),
    );
    expect(cliVersion()).toBe(pkg.version);
    expect(cliVersion()).not.toBe("0.1.0");
  });
});
