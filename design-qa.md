# Design QA — From Silicon to Intelligence

## Comparison Target

- Source visual truth: `reference/source-desktop-steps/`, `reference/source-mobile-steps/`, and the supplied production capture at `reference/source-desktop.png`.
- Rendered implementation: `http://localhost:4173/` from `prototype/`.
- Primary source captures: `reference/source-desktop-steps/step-01.png`, `step-08.png`, `step-12.png`, `step-18.png`; `reference/source-mobile-steps/step-01.png`, `step-45.png`.
- Primary implementation captures: `reference/implementation/desktop-top.png`, `desktop-solutions-revised.png`, `desktop-team.png`, `desktop-bottom.png`, `desktop-actions-launch.png`, `mobile-top.png`, `mobile-table.png`, `mobile-bottom.png`, `mobile-actions-launch.png`.
- Desktop viewport: 1440 × 900 CSS px. Source and implementation screenshots are both 1440 × 900 image px; comparison copies use the same 0.5 scale on both sides.
- Mobile viewport: 390 × 844 CSS px. Source and implementation screenshots are both 390 × 844 image px; comparison copies preserve a 1:1 scale.
- Additional responsive checks: 1024 × 768 and 768 × 900 CSS px.
- State: public landing page, English content, light theme, no authentication. Focused states cover the hero, GPGPU comparison table, team, final vision CTA, first-party booking form, contact card, opened mobile navigation, anchor navigation, email-request links, and clipboard feedback.

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
- All four launch actions now have honest destinations: presentation-deck email request, contact anchor, first-party booking request, and full-BP email request.

## Required Fidelity Surfaces

- Fonts and typography: local Barlow is used for display hierarchy and local Montserrat for body/UI copy. Weight, tracking, line height, and wrapping were checked at 1440, 1024, 768, and 390 px. Compact financial labels preserve every exact value at 390 px without truncating the data.
- Spacing and layout rhythm: a single 1180 px content frame, consistent section padding, card radii, table spacing, and responsive grid collapse are used. Anchor targets now clear the sticky header by 19 px without a duplicate offset.
- Colors and tokens: the implementation maps the source's white, pale blue, sky blue, deep navy, soft borders, and restrained gradients into shared CSS variables. Small blue labels use the contrast-safe `#2879ad` token, and focus states combine a yellow outline with a dark navy outer ring for separation on both white and pale-blue surfaces.
- Image quality and asset fidelity: the source chip visual, blue texture, robot image, and four team portraits are served locally. Browser checks found zero failed images. No visible source asset was replaced with handcrafted SVG, CSS illustration, emoji, or placeholder art; interface icons come from one consistent library.
- Copy and content: all 14 source cards render in the original order. Automated checks reject Google Translate, DeepL, Automa, `saved_resource`, `chrome-extension://`, and similar capture residue.
- Interactions and accessibility: desktop anchors, encoded email requests, booking validation, Clipboard API success/fallback, the mobile menu, Escape-to-close with focus return, link-to-close, desktop-breakpoint reset, and keyboard focus outlines were exercised. Navigation and actions use semantic links/buttons, the mobile trigger exposes `aria-controls` and expanded state, both data tables reference real heading IDs, and each financial value pair has a concise accessible label.
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

### Pass 3 — Independent review

- [P2] Mobile financial values were removed by a small-screen CSS rule, leaving only aria-hidden bars and years.
- [P2] Small blue labels and the original single-color focus outline missed contrast targets.
- [P3] Data-table `aria-labelledby` attributes pointed to absent heading IDs.
- Fixes: restored compact visible `R`/`P` labels for all five years with full accessible names, darkened the small-text blue token to `#2879ad`, added a navy-backed two-tone focus treatment (including the primary-button shadow override), and assigned stable IDs to every section heading.
- Post-fix evidence: `reference/implementation/mobile-financial-values-final.png`. Browser measurements show all ten exact revenue/profit values exposed, a 390 px body width, and valid heading references for both data tables.
- Result: all independent-review findings are resolved.

### Pass 4 — Launch-ready actions

- Added a static, first-party booking region at `#booking` with a 30-minute Shanghai-time request form and a verified contact card at `#contact`.
- `Request Full Deck` and `Request Full BP` open encoded requests to `huanglb118@gmail.com`; no missing BP file or fake download is exposed.
- In-person requests include `上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）`; online requests use `Online link to be confirmed` and do not leak the physical address into the generated mail.
- The website stores and submits no form data. The primary handoff opens the visitor's email client, the clipboard action provides a fallback request, and all copy states explicitly keep the meeting pending manual confirmation.
- Desktop evidence: `reference/implementation/desktop-actions-launch.png` at 1440 × 900. Mobile evidence: `reference/implementation/mobile-actions-launch.png` at 390 × 844.
- Browser measurements: 1440 px and 390 px document widths exactly match their viewports; CTA/form controls are 46 px high; the mobile menu trigger is 44 × 44 px; anchor clearance is about 19 px beneath the sticky header.
- Menu behavior passed open/close, Escape focus return, destination-link close, and >860 px breakpoint reset. Browser checks found zero failed images, duplicate IDs, horizontal overflow, console warnings, or console errors.
- Result: launch-action browser QA passed.

## Runtime Verification

- Browser-rendered sections: 14.
- Failed images: 0.
- Duplicate element IDs: 0.
- Console: no warnings or errors; only Vite connection/debug and the React development-tools informational message.
- Primary interactions tested: desktop anchor navigation; deck/BP email links; contact and booking anchors; booking validation and encoded online/in-person mail contents; clipboard success/fallback; mobile menu open, Escape focus return, link close, breakpoint reset; final footer visibility; mobile financial values; table heading references.

## Implementation Checklist

- [x] Preserve source content order and source imagery.
- [x] Remove captured browser-extension and 404 content.
- [x] Provide stable desktop, tablet, and mobile layouts.
- [x] Convert dense mobile tables to labeled cards.
- [x] Connect every CTA to an honest email, contact, or booking destination.
- [x] Verify metadata, local assets, browser console, and responsive widths.

## Follow-up Polish

- No blocking launch polish remains. Future work may add a finished BP/PDF and backend availability, automatic confirmation, reminders, and calendar-provider synchronization.

final result: passed
