# Business Plan Website Recreation Design

## Objective

Recreate the current website at `https://from.shmww.top/` as a clean, maintainable, responsive single-page website. Preserve the original business-plan content, section order, imagery, and blue technology-oriented visual identity while improving the layout hierarchy, spacing, alignment, and mobile behavior.

The existing page belongs to the user and is the authoritative content reference.

## Scope

### Content fidelity

- Preserve every meaningful heading, paragraph, statistic, label, company name, date, contact line, and callout from the source page.
- Preserve the source page's section order and narrative progression.
- Preserve the source imagery when it can be downloaded and stored locally.
- Keep the website in English, matching the source page.
- Remove all captured browser-extension content, browser-save metadata, Google Translate UI, DeepL UI, Automa UI, missing-resource frames, and unrelated injected markup.

### Layout improvements

- Replace the captured Gamma document structure with a deliberate responsive page layout.
- Retain the light-blue, white, and deep-navy palette, rounded cards, restrained gradients, and technology-oriented imagery.
- Use a consistent content width, spacing scale, typography hierarchy, border treatment, and card radius.
- Recompose dense sections into readable grids, comparison panels, timelines, statistic groups, and clearly separated narrative blocks without changing their meaning.
- Keep visual density comfortable on desktop and collapse multi-column layouts into a natural reading order on smaller screens.

### Deferred actions

- Keep “Schedule a Meeting” and “Download Full BP” visually present.
- Do not connect either action to an external service or file in this version.
- Activating either control displays a lightweight “Coming soon” notice without navigating away.

## Information Architecture

The site is one continuous route with these page-level regions:

1. A slim sticky navigation bar with the company identity, section navigation, and a reserved contact action.
2. A hero region that retains the original title, positioning statement, date, contact information, and primary actions.
3. The complete source-page business-plan narrative, divided into the same chapters and ordered sections.
4. Reusable visual modules for strategic pillars, market data, product layers, roadmaps, milestones, and closing claims.
5. A closing call-to-action region containing the original closing copy and the two reserved actions.
6. A minimal footer containing the original company/contact/date information.

Section navigation uses stable anchors and smooth scrolling. The current section is reflected in the navigation when practical, while the content remains fully usable without JavaScript enhancements.

## Component Design

The implementation is split into focused units:

- `SiteHeader`: responsive navigation, anchor links, and mobile menu.
- `Hero`: opening title, positioning copy, metadata, actions, and primary visual.
- `SectionShell`: consistent chapter label, heading, description, width, and vertical rhythm.
- `ContentGrid`: reusable responsive two-, three-, and four-column layouts.
- `InfoCard`: repeated strategic, product, market, and capability cards.
- `MetricCard`: large numeric statements with supporting labels.
- `Roadmap`: responsive timeline for phased or dated material.
- `ReservedAction`: accessible button behavior for unavailable destinations.
- `SiteFooter`: company and contact details.

Business content is represented as structured data where repetition makes that clearer; unique editorial layouts remain explicit components so the page does not become a generic card wall.

## Visual System

- Primary background: white and very pale blue.
- Primary text: deep navy/slate.
- Accent: sky blue with restrained blue gradients derived from the source.
- Typography: a locally served or bundled open-source pairing close to the source's Barlow/Montserrat character.
- Cards: consistent border, soft shadow, and medium-to-large radius; no heavy glass effects.
- Motion: subtle entrance and hover feedback only, disabled when the user prefers reduced motion.
- Imagery: source assets downloaded locally; no production hotlinks to Gamma or browser-extension resources.

## Responsive Behavior

- Desktop: wide editorial composition with controlled multi-column grids and sticky navigation.
- Tablet: reduced gutters, two-column layouts where content remains legible, and horizontally safe timelines.
- Mobile: single-column reading flow, compact type scale, collapsible navigation, full-width actions, and no horizontal overflow.
- Breakpoints follow content needs rather than reproducing captured browser dimensions.

## Interaction and Error Handling

- Anchor navigation scrolls to real section IDs and restores keyboard focus semantics.
- The mobile menu closes after selecting a section and can be dismissed with Escape.
- Reserved actions use buttons rather than dead links and announce “Coming soon” visibly and to assistive technology.
- Missing optional imagery falls back to a deliberate color treatment without broken-image icons or collapsed spacing.
- No network request is required for core page rendering after the local assets are bundled.

## Accessibility

- Semantic heading order and landmark elements.
- Keyboard-accessible navigation and actions.
- Visible focus styles.
- Sufficient text/background contrast.
- Descriptive alternative text for meaningful imagery and empty alternative text for decoration.
- Reduced-motion support.

## Verification

- Confirm all meaningful source text and all source sections are present in the same order.
- Confirm no Google Translate, DeepL, Automa, `saved_resource`, `chrome-extension://`, or captured browser-save markup remains.
- Run automated tests for content completeness, navigation targets, reserved-action behavior, and mobile-menu behavior.
- Run a production build and verify it completes without warnings or broken asset references.
- Compare the finished page against the source at desktop and 390 × 844 mobile sizes.
- Check primary interactions, keyboard navigation, console errors, horizontal overflow, and missing assets.
- Record the final visual QA result in `design-qa.md` before handoff.

## Out of Scope

- Backend services, authentication, content management, analytics, forms, meeting scheduling, and file delivery.
- Rewriting or translating the business-plan copy.
- Adding new claims, metrics, products, or sections not present in the source.
- Publishing or changing the existing `from.shmww.top` deployment during the local recreation phase.
