import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";
import { siteContent } from "../src/content/site-content.js";

const orderedTitles = [
  "From Silicon to Intelligence — Defining the New Productive Forces of the Smart Era",
  "Chapter 1 · Project Overview",
  "Chapter 2 · Strategic Positioning",
  "Strategic Priority Matrix",
  "Chapter 3 · Industry Pain Points",
  "Chapter 4 · Solution · Core 1",
  "Chapter 4 · Solution · Core 2",
  "Chapter 4 · Solution · Core 3",
  "Chapter 5 · Team",
  "Chapter 6 · Business Model",
  "VV-BOT Unit Economics",
  "Chapter 7 · Competitive Moats",
  "Chapter 8 · Financials & Fundraising",
  "Chapter 9 · Vision",
];

describe("site content", () => {
  it("preserves all source cards in order", () => {
    expect(siteContent.cards).toHaveLength(14);
    expect(siteContent.cards.map((card) => card.sourceTitle)).toEqual(orderedTitles);
  });

  it("contains no captured browser-extension markup", () => {
    const serialized = JSON.stringify(siteContent);

    for (const forbidden of [
      "goog-gt-tt",
      "saved_resource",
      "chrome-extension://",
      "deepl-input-controller",
      "automa-palette",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("renders all 14 source cards as ordered page regions", () => {
    render(<App />);

    const regions = screen.getAllByRole("region");
    expect(regions).toHaveLength(14);
    expect(regions[0]).toHaveAccessibleName(orderedTitles[0]);
    expect(regions[13]).toHaveAccessibleName(orderedTitles[13]);
  });

  it("labels exact revenue and profit values in the financial chart", () => {
    render(<App />);

    expect(
      screen.getByLabelText("Revenue ¥1621 million; profit ¥243 million"),
    ).toBeVisible();
    expect(
      screen.getByLabelText("Revenue ¥2813 million; profit ¥826 million"),
    ).toBeVisible();
  });

  it("gives each data table a valid accessible heading reference", () => {
    render(<App />);

    for (const table of screen.getAllByRole("table")) {
      const labelId = table.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      expect(document.getElementById(labelId)).not.toBeNull();
    }
  });
});
