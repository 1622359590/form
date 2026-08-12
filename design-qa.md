# Design QA — From Silicon to Intelligence

## Comparison Target

- Source visual truth: `reference/source-desktop-steps/`, `reference/source-mobile-steps/`, and the supplied production capture at `reference/source-desktop.png`.
- Rendered implementation: `http://localhost:4173/` from `prototype/`.
- Primary source captures: `reference/source-desktop-steps/step-01.png`, `step-08.png`, `step-12.png`, `step-18.png`; `reference/source-mobile-steps/step-01.png`, `step-45.png`.
- Primary implementation captures: `reference/implementation/desktop-top.png`, `desktop-solutions-revised.png`, `desktop-team.png`, `desktop-bottom.png`, `mobile-top.png`, `mobile-table.png`, `mobile-bottom.png`.
- Desktop viewport: 1440 × 900 CSS px. Source and implementation screenshots are both 1440 × 900 image px; comparison copies use the same 0.5 scale on both sides.
- Mobile viewport: 390 × 844 CSS px. Source and implementation screenshots are both 390 × 844 image px; comparison copies preserve a 1:1 scale.
- Additional responsive checks: 1024 × 768 and 768 × 900 CSS px.
- State: public landing page, English content, light theme, no authentication. Focused states cover the hero, GPGPU comparison table, team, final vision CTA, opened mobile navigation, anchor navigation, and reserved-action feedback.

## Full-View Comparison Evidence

- Hero, source left / implementation right: `reference/comparisons/desktop-hero-source-left-implementation-right.jpg`.
- Mobile hero, source left / implementation right: `reference/comparisons/mobile-hero-source-left-implementation-right.jpg`.
- The implementation keeps the source chip image, title, metadata, pale-blue/white treatment, navy type, and sky-blue actions. Its hero receives more vertical space by design so the title is not compressed into the following chapter.
- At 390 px, the source truncates action labels and begins the next chapter inside the first viewport. The implementation preserves complete labels, a clear hierarchy, and a 390 px document width with no horizontal overflow.

## Focused Region Comparison Evidence

- GPGPU table after the navigation-offset fix: `reference/comparisons/desktop-solutions-postfix-source-left-implementation-right.jpg`.
  - The source table collapses its first label column into one-character lines. The implementation preserves the same values in readable columns and converts rows to labeled cards below 700 px (`reference/implementation/mobile-table.png`).
- Team, source left / implementation right: `reference/comparisons/desktop-team-source-left-implementation-right.jpg`.
  - All four source portraits and the source copy are retained. The dedicated section grid removes the source's collision with the preceding robotics content.
- Final CTA, source left / implementation right: `reference/comparisons/desktop-bottom-source-left-implementation-right.jpg` and `reference/comparisons/mobile-bottom-source-left-implementation-right.jpg`.
  - The implementation retains the roadmap, three certainty cards, statement, attribution, and two actions. Captured Google Translate controls and the nginx 404 iframe are absent.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The larger hero and dedicated per-chapter vertical rhythm are intentional deviations requested to improve the source's crowded composition. They preserve the source narrative and visual identity rather than introducing a new direction.
- Reserved actions intentionally announce `Coming soon`, matching the requested placeholder behavior.

## Required Fidelity Surfaces

- Fonts and typography: local Barlow is used for display hierarchy and local Montserrat for body/UI copy. Weight, tracking, line height, and wrapping were checked at 1440, 1024, 768, and 390 px. No truncation remains in the implementation.
- Spacing and layout rhythm: a single 1180 px content frame, consistent section padding, card radii, table spacing, and responsive grid collapse are used. Anchor targets now clear the sticky header by 19 px without a duplicate offset.
- Colors and tokens: the implementation maps the source's white, pale blue, sky blue, deep navy, soft borders, and restrained gradients into shared CSS variables. Text and controls retain strong visible contrast.
- Image quality and asset fidelity: the source chip visual, blue texture, robot image, and four team portraits are served locally. Browser checks found zero failed images. No visible source asset was replaced with handcrafted SVG, CSS illustration, emoji, or placeholder art; interface icons come from one consistent library.
- Copy and content: all 14 source cards render in the original order. Automated checks reject Google Translate, DeepL, Automa, `saved_resource`, `chrome-extension://`, and similar capture residue.
- Interactions and accessibility: desktop anchors, the mobile menu, Escape-to-close, link-to-close, keyboard focus outlines, and `Coming soon` status feedback were exercised. Navigation and actions use semantic links/buttons and the mobile menu exposes its expanded state.
- Responsiveness: measured document width equals viewport width at 1440, 1024, 768, and 390 px. The 390 px table renders as readable row cards instead of overflowing.

## Comparison History

### Pass 1

- [P2] Duplicate sticky-header anchor offset.
  - Evidence: `reference/implementation/desktop-solutions.png` placed the target section 176 px below the viewport top, leaving about 103 px of the previous white section beneath the 73 px header.
  - Cause: both `html { scroll-padding-top: 92px; }` and `.section-region { scroll-margin-top: 84px; }` were applied.
  - Fix: removed the section-level scroll margin and kept the document-level sticky-header offset. Added a regression test in `prototype/tests/asset-integrity.test.js`.

### Pass 2

- Post-fix evidence: `reference/implementation/desktop-solutions-revised.png` and `reference/comparisons/desktop-anchor-before-left-after-right.jpg`.
- Measured result: header bottom 73 px, section top 91.95 px, visual clearance 18.95 px.
- Source comparison: `reference/comparisons/desktop-solutions-postfix-source-left-implementation-right.jpg` confirms the section is now framed cleanly while resolving the source table collapse.
- Result: the P2 issue is resolved; no new P0/P1/P2 issue appeared.

## Runtime Verification

- Browser-rendered sections: 14.
- Failed images: 0.
- Duplicate element IDs: 0.
- Console: no warnings or errors; only Vite connection/debug and the React development-tools informational message.
- Primary interactions tested: desktop anchor navigation; mobile menu open, Escape close, link close; reserved CTA status; final footer visibility.

## Implementation Checklist

- [x] Preserve source content order and source imagery.
- [x] Remove captured browser-extension and 404 content.
- [x] Provide stable desktop, tablet, and mobile layouts.
- [x] Convert dense mobile tables to labeled cards.
- [x] Keep reserved actions interactive without inventing destinations.
- [x] Verify metadata, local assets, browser console, and responsive widths.

## Follow-up Polish

- No blocking polish remains. A future publishing pass may replace the reserved actions with real form/download destinations when those URLs are supplied.

final result: passed
