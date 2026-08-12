import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site metadata", () => {
  it("uses the finished business-plan identity", () => {
    const html = readFileSync("index.html", "utf8");

    expect(html).toContain("From Silicon to Intelligence");
    expect(html).toContain('rel="canonical" href="/"');
    expect(html).toContain('property="og:url" content="/"');
    expect(html).toContain('property="og:image" content="/og.png"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
    expect(html).toContain('property="og:image:alt"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).not.toMatch(/<title>\s*Prototype\s*<\/title>/i);
  });

  it("ships a 1200 by 630 social-preview image", () => {
    expect(existsSync("public/og.png")).toBe(true);

    const png = readFileSync("public/og.png");
    expect(png.toString("ascii", 1, 4)).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});
