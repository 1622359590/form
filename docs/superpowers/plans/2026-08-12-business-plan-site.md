# Business Plan Website Recreation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, locally runnable, responsive recreation of `https://from.shmww.top/` that preserves all 14 source cards and their assets while replacing the polluted browser-saved markup and improving the editorial layout.

**Architecture:** Use the bundled Product Design web prototype as a one-route static frontend. Store the captured business content in a typed content module, render it through focused editorial components, bundle every required image and font locally, and keep the two unavailable calls to action as accessible “Coming soon” controls. Automated tests cover content parity and interaction behavior; browser comparison at desktop and 390 × 844 is the final gate.

**Tech Stack:** Product Design Vite/React prototype, TypeScript, CSS, Vitest, Testing Library, local static assets, browser-based visual QA.

## Global Constraints

- Treat `https://from.shmww.top/` as the authoritative source; the user states that the site is theirs.
- Preserve all meaningful source copy, the 14-card order, company names, dates, claims, statistics, and imagery.
- Keep the finished page in English.
- Improve hierarchy, spacing, alignment, navigation, and responsive composition without inventing business claims or sections.
- Bundle source imagery and fonts locally; the finished page must not hotlink Gamma or browser-extension resources.
- Exclude Google Translate, DeepL, Automa, Immersive Translate, `saved_resource`, `chrome-extension://`, and browser-save markup.
- Keep “Schedule a Meeting” and “Download Full BP” disconnected from external destinations; both announce “Coming soon.”
- Support keyboard use, visible focus, semantic headings, reduced motion, and zero horizontal overflow at 390 px.
- Do not publish or alter `from.shmww.top` during this plan.

## Execution Environment Correction

The active Product Design runtime requires its bundled web prototype instead of initializing a Sites/Vinext starter. This section is authoritative where later task wording mentions the earlier starter or `app/` paths:

- Bootstrap the web prototype into `prototype/` with `bootstrap-prototype.mjs` and preserve its Sites-ready Vite/Worker runtime.
- Use `prototype/src/Prototype.tsx` for page composition, `prototype/src/prototype.css` for the finished visual system, `prototype/src/content/` for typed content, and `prototype/src/components/` for focused components.
- Use `prototype/index.html` for finished title and social metadata.
- Put tests under `prototype/tests/` and assets under `prototype/public/assets/source/`.
- Keep `prototype/src/App.tsx`, `prototype/src/main.tsx`, `prototype/src/styles.css`, `prototype/vite.config.ts`, `prototype/worker/`, and the Sites build scripts intact unless the starter's documented web-template contract explicitly permits a change.
- Run `npm run test:sites` in addition to the plan's automated tests and production build.
- Do not invoke Sites initialization or deploy the prototype unless the user separately requests publishing.

---

## Planned File Structure

- `app/layout.tsx` — site metadata and shared document shell.
- `app/page.tsx` — one-route page composition in source order.
- `app/content/site-content.ts` — typed, exact business-plan content and asset references.
- `app/components/SiteHeader.tsx` — desktop navigation and keyboard-safe mobile menu.
- `app/components/Hero.tsx` — source opening card and reserved actions.
- `app/components/SectionShell.tsx` — chapter wrapper and editorial rhythm.
- `app/components/ContentModules.tsx` — bounded card, metric, matrix, comparison, and roadmap primitives.
- `app/components/ReservedAction.tsx` — accessible unavailable-action notice.
- `app/components/SiteFooter.tsx` — source closing identity and contact details.
- `app/styles.css` — tokens, layouts, component styling, responsive rules, focus, and reduced motion.
- `public/assets/source/` — locally stored source images and fonts.
- `public/og.png` — one bespoke social card derived from the finished visual direction.
- `reference/source-manifest.json` — audit inventory of source cards, text, assets, and ordering.
- `reference/source-desktop.png` — full desktop source capture.
- `reference/source-mobile.png` — full 390 × 844 source capture.
- `tests/site-content.test.ts` — exact card order, content completeness, and contamination checks.
- `tests/site-interactions.test.tsx` — navigation, mobile menu, and reserved-action behavior.
- `tests/asset-integrity.test.ts` — local asset presence and forbidden external-reference checks.
- `design-qa.md` — final comparison and accessibility report.

---

### Task 1: Capture the Complete Source Evidence

**Files:**
- Create: `reference/source-manifest.json`
- Create: `reference/source-desktop.png`
- Create: `reference/source-mobile.png`
- Create: `public/assets/source/`

**Interfaces:**
- Consumes: live source page `https://from.shmww.top/`.
- Produces: a 14-card ordered manifest and a local asset set consumed by `app/content/site-content.ts`.

- [ ] **Step 1: Capture the desktop source from top to bottom**

Open the source in the approved browser at 1440 px width. Scroll in small increments until all 14 cards have rendered, capture every visible section and interaction, return to the top, then save a full-page image as `reference/source-desktop.png`.

- [ ] **Step 2: Capture the mobile source from top to bottom**

Resize to 390 × 844, reload, scroll through the entire document, note every responsive change or overflow defect, return to the top, then save a full-page image as `reference/source-mobile.png`.

- [ ] **Step 3: Extract an ordered source manifest**

Parse the source page's `__NEXT_DATA__` document and save a normalized JSON manifest whose top-level contract is:

```ts
type SourceManifest = {
  sourceUrl: "https://from.shmww.top/";
  capturedAt: string;
  cards: Array<{
    sourceOrder: number;
    sourceId: string;
    headings: string[];
    paragraphs: string[];
    labels: string[];
    imageUrls: string[];
  }>;
};
```

Confirm `cards.length === 14` and that the first heading of each ordered card is:

```ts
[
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
  "Chapter 9 · Vision"
]
```

- [ ] **Step 4: Download every referenced source image and font locally**

Resolve each meaningful visual used by the 14 cards, save it under `public/assets/source/` with stable descriptive names, and update the manifest image entries to include the local file path. Do not copy extension icons, translation assets, browser UI, or missing `saved_resource` files.

- [ ] **Step 5: Verify capture completeness**

Compare the manifest headings and asset count against both screenshots. Confirm all source regions and all meaningful visuals have an entry before creating application code.

- [ ] **Step 6: Commit the source evidence**

```bash
git add reference public/assets/source
git commit -m "chore: capture business plan source evidence"
```

---

### Task 2: Scaffold the Sites App and Lock Content Parity

**Files:**
- Create or modify: `package.json`
- Create or modify: `vite.config.ts`
- Modify: `app/layout.tsx`
- Create: `app/content/site-content.ts`
- Create: `tests/site-content.test.ts`
- Remove: starter-only `app/_sites-preview/` and its imports

**Interfaces:**
- Consumes: `reference/source-manifest.json` and local paths under `public/assets/source/`.
- Produces: `siteContent: SiteContent`, the sole content source for page components.

- [ ] **Step 1: Start the Sites capability starter**

Create the site in the workspace root using the Sites starter. Preserve its Vinext runtime, Cloudflare-compatible ESM output, `.openai/hosting.json`, and supported development/build scripts. Remove the starter loading experience and preview-only imports.

- [ ] **Step 2: Install the test harness without replacing the starter runtime**

Add Vitest, jsdom, Testing Library React, Testing Library user-event, and jest-dom. Configure `npm test` as `vitest run` and load jest-dom from a test setup file.

- [ ] **Step 3: Write the failing content-parity test**

```ts
import { describe, expect, it } from "vitest";
import { siteContent } from "../app/content/site-content";

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
});
```

- [ ] **Step 4: Run the test and verify the expected failure**

Run: `npm test -- tests/site-content.test.ts`

Expected: FAIL because `app/content/site-content.ts` and `siteContent` do not exist.

- [ ] **Step 5: Implement the typed content module**

Define and export these exact public contracts:

```ts
import sourceManifestJson from "../../reference/source-manifest.json";

export type SourceManifest = {
  sourceUrl: "https://from.shmww.top/";
  capturedAt: string;
  cards: Array<{
    sourceOrder: number;
    sourceId: string;
    headings: string[];
    paragraphs: string[];
    labels: string[];
    imageUrls: string[];
  }>;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "metric"; value: string; label: string; detail?: string }
  | { type: "item"; title: string; body: string; iconName?: string }
  | { type: "image"; src: string; alt: string };

export type SiteCard = {
  id: string;
  sourceOrder: number;
  sourceTitle: string;
  chapterLabel?: string;
  heading: string;
  intro?: string;
  layout: "hero" | "editorial" | "grid" | "matrix" | "timeline" | "financial";
  blocks: ContentBlock[];
};

export type SiteContent = {
  company: string;
  contact: string;
  date: string;
  cards: SiteCard[];
};

export function normalizeSourceManifest(manifest: SourceManifest): SiteContent;

const sourceManifest = sourceManifestJson as SourceManifest;
export const siteContent: SiteContent = normalizeSourceManifest(sourceManifest);
```

Import the captured JSON manifest, implement `normalizeSourceManifest` as a deterministic mapping from its ordered cards to the six `layout` variants, and preserve every captured text block and local asset path. Use stable kebab-case IDs for anchor navigation.

- [ ] **Step 6: Run the content tests**

Run: `npm test -- tests/site-content.test.ts`

Expected: PASS with 2 tests.

- [ ] **Step 7: Commit the content foundation**

```bash
git add package.json package-lock.json vite.config.ts app tests
git commit -m "feat: add verified business plan content model"
```

---

### Task 3: Build the Accessible Navigation and Reserved Actions

**Files:**
- Create: `app/components/SiteHeader.tsx`
- Create: `app/components/ReservedAction.tsx`
- Create: `tests/site-interactions.test.tsx`

**Interfaces:**
- Consumes: card IDs and labels from `siteContent.cards`.
- Produces: `SiteHeader({ items })` and `ReservedAction({ children })` used by `app/page.tsx` and `Hero`.

- [ ] **Step 1: Write failing interaction tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReservedAction } from "../app/components/ReservedAction";
import { SiteHeader } from "../app/components/SiteHeader";

const items = [
  { id: "project-overview", label: "Overview" },
  { id: "solutions", label: "Solutions" },
  { id: "financials", label: "Financials" },
  { id: "vision", label: "Vision" },
];

describe("site interactions", () => {
  it("opens, closes, and dismisses the mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader items={items} />);
    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);
    expect(screen.getByRole("navigation", { name: /mobile/i })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
  });

  it("announces that a reserved action is coming soon", async () => {
    const user = userEvent.setup();
    render(<ReservedAction>Download Full BP</ReservedAction>);
    await user.click(screen.getByRole("button", { name: "Download Full BP" }));
    expect(screen.getByRole("status")).toHaveTextContent("Coming soon");
  });
});
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `npm test -- tests/site-interactions.test.tsx`

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement `ReservedAction`**

Use a real `<button type="button">`, local open state, and a visible `role="status"` notice containing exactly `Coming soon`. Do not add an empty `href` or navigation side effect.

- [ ] **Step 4: Implement `SiteHeader`**

Render a desktop `<nav aria-label="Primary">`, a mobile toggle with changing accessible name, and a conditional `<nav aria-label="Mobile">`. Close the mobile navigation when an anchor is selected or Escape is pressed. Each item links to `#${item.id}`.

- [ ] **Step 5: Run the interaction tests**

Run: `npm test -- tests/site-interactions.test.tsx`

Expected: PASS with 2 tests.

- [ ] **Step 6: Commit navigation behavior**

```bash
git add app/components tests/site-interactions.test.tsx
git commit -m "feat: add accessible site navigation and reserved actions"
```

---

### Task 4: Render the Full 14-Card Editorial Page

**Files:**
- Create: `app/components/Hero.tsx`
- Create: `app/components/SectionShell.tsx`
- Create: `app/components/ContentModules.tsx`
- Create: `app/components/SiteFooter.tsx`
- Modify: `app/page.tsx`
- Extend: `tests/site-content.test.ts`

**Interfaces:**
- Consumes: `SiteCard`, `ContentBlock`, and `siteContent` from `app/content/site-content.ts`.
- Produces: a semantic page with one source-ordered `<section>` for each card and valid anchor targets.

- [ ] **Step 1: Add the failing render-order test**

```tsx
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Page from "../app/page";

it("renders all 14 source cards as ordered page regions", () => {
  render(<Page />);
  const regions = screen.getAllByRole("region");
  expect(regions).toHaveLength(14);
  expect(regions[0]).toHaveAccessibleName(
    "From Silicon to Intelligence — Defining the New Productive Forces of the Smart Era",
  );
  expect(regions[13]).toHaveAccessibleName("Chapter 9 · Vision");
});
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run: `npm test -- tests/site-content.test.ts`

Expected: FAIL because the page does not render the 14 source regions.

- [ ] **Step 3: Implement the bounded editorial primitives**

Export these public components from `ContentModules.tsx`:

```ts
export function InfoCard(props: { title: string; body: string; iconName?: string }): JSX.Element;
export function MetricCard(props: { value: string; label: string; detail?: string }): JSX.Element;
export function MatrixGrid(props: { blocks: ContentBlock[] }): JSX.Element;
export function Roadmap(props: { blocks: ContentBlock[] }): JSX.Element;
export function EditorialBlocks(props: { blocks: ContentBlock[] }): JSX.Element;
```

Use the source content type, not copied strings inside components. Use a maintained icon component set only where the source has a meaningful icon; do not use emoji or handmade SVG icons.

- [ ] **Step 4: Implement source-specific composition**

Render card 1 with `Hero`; cards 2–14 with `SectionShell`. Map each card's `layout` to the matching module while retaining deliberate source-specific composition for the team, unit economics, financial forecast, and closing vision. Do not reduce the page to a uniform card grid.

- [ ] **Step 5: Implement the footer**

Render the original company, contact, and date details. Include both reserved actions only where the source includes the closing actions; do not create duplicate destinations.

- [ ] **Step 6: Run the render and content tests**

Run: `npm test -- tests/site-content.test.ts`

Expected: PASS, including ordered region coverage.

- [ ] **Step 7: Commit the complete semantic page**

```bash
git add app/page.tsx app/components tests/site-content.test.ts
git commit -m "feat: render complete business plan narrative"
```

---

### Task 5: Apply the Responsive Visual System and Verify Assets

**Files:**
- Create: `app/styles.css`
- Modify: `app/layout.tsx`
- Create: `tests/asset-integrity.test.ts`

**Interfaces:**
- Consumes: semantic class names from all page components and local asset paths from `siteContent`.
- Produces: the approved blue editorial system at desktop, tablet, and mobile widths.

- [ ] **Step 1: Write the failing asset-integrity test**

```ts
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { siteContent } from "../app/content/site-content";

describe("production assets", () => {
  it("stores every content image locally", () => {
    const serialized = JSON.stringify(siteContent);
    expect(serialized).not.toMatch(/https?:\/\//);
    const paths = [...serialized.matchAll(/\/assets\/source\/[^\"']+/g)].map((m) => m[0]);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(resolve("public", path.slice(1)))).toBe(true);
    }
  });

  it("contains no captured extension or missing-resource references", () => {
    const files = ["app/page.tsx", "app/layout.tsx", "app/styles.css"];
    const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
    expect(source).not.toMatch(/saved_resource|chrome-extension:\/\/|goog-gt|automa|deepl/i);
  });
});
```

- [ ] **Step 2: Run the asset test and verify the expected failure**

Run: `npm test -- tests/asset-integrity.test.ts`

Expected: FAIL until all content references use verified local files and `app/styles.css` exists.

- [ ] **Step 3: Define the visual tokens**

In `app/styles.css`, define the approved system with CSS custom properties for pale-blue and white surfaces, deep-navy text, sky-blue accents, restrained gradient accents, spacing, radius, shadow, content widths, and typographic scale. Use the locally bundled Barlow/Montserrat files or the nearest source-faithful open-source equivalents captured in Task 1.

- [ ] **Step 4: Build the responsive layouts**

Implement wide editorial sections, controlled two-/three-/four-column grids, financial tables that remain readable, a vertical mobile roadmap, a compact mobile header, and full-width mobile actions. Add breakpoints based on content at approximately 1120 px, 820 px, and 560 px, adjusting them when browser evidence shows a better boundary.

- [ ] **Step 5: Add accessible state styling**

Add visible `:focus-visible` rings, hover states that do not shift layout, `scroll-margin-top` for anchor targets, `prefers-reduced-motion: reduce`, and safe overflow rules. Do not hide meaningful focus or content at any breakpoint.

- [ ] **Step 6: Run the asset and complete test suite**

Run: `npm test`

Expected: PASS with no missing local assets or forbidden resource references.

- [ ] **Step 7: Commit the responsive visual system**

```bash
git add app public/assets/source tests/asset-integrity.test.ts
git commit -m "feat: apply responsive business plan visual system"
```

---

### Task 6: Add Finished Metadata and the Bespoke Social Card

**Files:**
- Modify: `app/layout.tsx`
- Create: `public/og.png`
- Create: `tests/metadata.test.ts`

**Interfaces:**
- Consumes: the frozen page title, summary, palette, typography, and hero motifs.
- Produces: site-specific metadata and one validated landscape preview image.

- [ ] **Step 1: Write the failing metadata test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site metadata", () => {
  it("replaces starter metadata with the finished business-plan identity", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("From Silicon to Intelligence");
    expect(layout).toContain("og.png");
    expect(layout).not.toMatch(/starter|codex-preview|loading skeleton/i);
  });
});
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run: `npm test -- tests/metadata.test.ts`

Expected: FAIL until finished metadata and `og.png` are wired.

- [ ] **Step 3: Generate exactly one social-preview candidate**

Use one image-generation request to create a complete 1200 × 630 landscape card based on the finished page: pale-blue/white background, deep-navy title treatment, sky-blue compute motif, the exact title “From Silicon to Intelligence,” and the same restrained visual identity. Inspect the result for incorrect or invented text; retry once only if unusable.

- [ ] **Step 4: Wire final metadata**

Save the approved result as `public/og.png`. Update `app/layout.tsx` with the exact site title, a concise source-faithful description, Open Graph metadata, X metadata, and an absolute image URL derived from the incoming request host.

- [ ] **Step 5: Run the metadata and complete tests**

Run: `npm test`

Expected: PASS with no starter metadata.

- [ ] **Step 6: Commit metadata and preview artwork**

```bash
git add app/layout.tsx public/og.png tests/metadata.test.ts
git commit -m "feat: add finished metadata and social preview"
```

---

### Task 7: Build, Compare, and Pass the Visual QA Gate

**Files:**
- Create: `design-qa.md`
- Modify: only files required to fix verified P0/P1/P2 issues

**Interfaces:**
- Consumes: complete local app, source screenshots, source manifest, and all automated tests.
- Produces: a healthy local preview and `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0 with no broken asset references or runtime warnings.

- [ ] **Step 2: Start the supported local preview**

Start the Sites preview with the starter's supported development command, keep it running, and open the exact local URL in the approved browser.

- [ ] **Step 3: Verify desktop behavior and fidelity**

At 1440 px width, compare the local page with `reference/source-desktop.png` and the source manifest. Verify all 14 ordered regions, all meaningful images, navigation anchors, sticky header, both reserved actions, focus states, and the absence of console errors.

- [ ] **Step 4: Verify mobile behavior and fidelity**

At 390 × 844, compare with `reference/source-mobile.png`. Verify the mobile menu, single-column reading order, table/roadmap treatment, full-width actions, readable type, and zero horizontal overflow.

- [ ] **Step 5: Run the blocking design QA review**

Record source comparison, responsive behavior, interaction results, accessibility checks, asset integrity, and console status in `design-qa.md`. Fix every P0, P1, and P2 finding, recapture the affected view, and repeat the review until the file ends with:

```md
final result: passed
```

- [ ] **Step 6: Re-run the final verification after QA fixes**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0 after the final visual changes.

- [ ] **Step 7: Commit the verified result**

```bash
git add app public tests design-qa.md package.json package-lock.json vite.config.ts
git commit -m "feat: complete verified business plan website recreation"
```

- [ ] **Step 8: Hand off the local preview**

Keep the local preview available and provide its clickable local URL. Do not deploy or modify the existing public domain unless the user separately requests publishing.
