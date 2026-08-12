import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/content/site-content.js";

describe("production assets", () => {
  it("stores every content image locally", () => {
    const serialized = JSON.stringify(siteContent);
    expect(serialized).not.toMatch(/https?:\/\//);

    const paths = [
      ...serialized.matchAll(/\/assets\/source\/[^\"']+/g),
    ].map((match) => match[0]);

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(resolve("public", path.slice(1)))).toBe(true);
    }
  });

  it("does not bundle source hotlinks into the production content model", () => {
    const manifest = readFileSync("src/content/source-manifest.json", "utf8");

    expect(manifest).not.toMatch(/https?:\/\//);
  });

  it("contains no captured extension or missing-resource references", () => {
    const files = ["src/App.jsx", "src/styles.css", "src/content/site-content.js"];
    const source = files
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(
      /saved_resource|chrome-extension:\/\/|goog-gt|automa|deepl/i,
    );
  });

  it("uses one sticky-header offset for anchor navigation", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toMatch(/scroll-padding-top:/);
    expect(css).not.toMatch(
      /\.section-region\s*\{[^}]*scroll-margin-top:/s,
    );
  });

  it("keeps exact financial values visible on mobile", () => {
    const css = readFileSync("src/styles.css", "utf8");
    const mobileRules = css.match(/@media \(max-width: 700px\) \{([\s\S]*?)\n\}/)?.[1];

    expect(mobileRules).not.toMatch(
      /\.financial-chart__values\s*\{[^}]*display:\s*none/s,
    );
  });

  it("uses contrast-safe small text and focus tokens", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toContain("--blue: #2879ad;");
    expect(css).toMatch(/:focus-visible\s*\{[^}]*box-shadow:/s);
  });
});
