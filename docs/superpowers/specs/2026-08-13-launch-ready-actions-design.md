# Launch-Ready Website Actions Design

## Objective

Replace every remaining placeholder call to action with an honest, usable flow that can ship on the current static website. The launch version must use the verified public contact email and Shanghai office address, provide a shareable first-party booking URL, and avoid claiming that a meeting or message has been confirmed when no backend exists.

## Approved Launch Scope

- Use `huanglb118@gmail.com` as the public contact and request destination.
- Use `上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）` as the in-person meeting address.
- Keep the website self-contained and deployable as a static Vite build.
- Do not add a database, email API, calendar API, authentication, or third-party scheduling service.
- Defer creation and delivery of the full business-plan PDF.
- Keep the existing English page content and visual direction. Add concise Chinese clarification only where it prevents ambiguity in the booking/contact flow.

## Action Mapping

### Existing navigation

- The brand, five section-navigation items, `Investment thesis`, and `Explore the thesis` remain real in-page anchors.
- All target IDs must exist, and smooth scrolling must remain an enhancement rather than a requirement.

### Request Full Deck

- Convert the placeholder button into an email action addressed to `huanglb118@gmail.com`.
- Prefill an English subject and short request body so the visitor can ask for the presentation deck without composing from scratch.
- The visitor's mail application performs the actual send; the website never displays a false sent state.

### Contact Us

- Link to a compact contact block on the page.
- Display the verified email, contact name and title, company identity, and Shanghai address.
- Provide working email and copy-to-clipboard actions with a visible success or fallback message.

### Schedule a Meeting

- Link to the first-party booking section at `#booking`, making `https://from.shmww.top/#booking` the shareable booking URL after deployment.
- The compact form collects name, reply email, meeting format, preferred date, preferred Shanghai time, and an optional topic.
- Meeting format choices are `Online` and `In person · Shanghai Chongming`.
- The default duration is 30 minutes and all displayed times use `Asia/Shanghai`.
- Submitting a valid form opens a prefilled email to `huanglb118@gmail.com` containing the supplied details.
- A secondary `Copy meeting request` action provides the same generated request when no local mail application is configured.
- The confirmation copy must say that the visitor is opening an email to send a meeting request and that the time remains pending until manually confirmed.
- No form values are stored or transmitted by the website itself.

### Download Full BP

- Because no complete BP file exists in this launch scope, rename this control to `Request Full BP`.
- Make it a prefilled email request to `huanglb118@gmail.com`.
- Do not expose a fake download, empty file, print-to-PDF substitute, or `Coming soon` notice.

## Booking and Contact Layout

- Add one restrained launch-actions region near the existing closing call to action.
- The region contains a compact booking form and adjacent contact card on desktop, stacking into one column on mobile.
- Reuse the current blue, navy, white, border, radius, and typography tokens; no new visual language is introduced.
- Keep field labels persistent, validation messages adjacent to their controls, and the primary submission copy explicit: `Continue in email`.
- Show the full Shanghai address only for in-person meetings while retaining it in the contact card.
- Include a short privacy note: the site does not store form entries.

## Mobile Navigation Hardening

- Give the menu trigger a minimum 44-by-44-pixel hit area.
- Connect the trigger to the menu with `aria-controls` and keep `aria-expanded` accurate.
- Close the menu after choosing a destination, on Escape, and when moving to the desktop breakpoint.
- Return focus to the trigger after Escape closes the menu.

## Accessibility and Failure Handling

- Use native links for anchors and `mailto:` destinations, and native labeled form controls for booking details.
- Preserve visible keyboard focus and logical document order.
- Use a polite live region for copy-to-clipboard feedback.
- If Clipboard API access fails, select or visibly expose the value and instruct the visitor to copy it manually.
- Validate required fields, email format, and a preferred date that is not in the past before generating the booking email.
- Never label an email handoff as `Sent`, a meeting request as `Booked`, or a pending time as `Confirmed`.

## Verification

- Add failing interaction tests first for all four former placeholder CTAs, then implement the minimum behavior to pass them.
- Verify every anchor points to a real element and every email action targets the configured public address.
- Test booking validation, encoded email contents, online/in-person location behavior, both copy fallbacks, and the absence of `Coming soon`.
- Test mobile-menu ARIA wiring, Escape focus return, link-close behavior, and desktop-breakpoint reset.
- Run the complete unit test suite, production build, asset-integrity checks, and existing Sites tests.
- Perform desktop and mobile browser QA for layout, keyboard behavior, form usability, URL hash behavior, console errors, and horizontal overflow.

## Deferred Work

- Writing, designing, or exporting a full BP or presentation deck.
- Direct PDF download or private file delivery.
- Real-time availability, collision detection, automatic confirmation, reminder emails, video-conference room creation, or calendar-provider synchronization.
- Backend form submission and contact-message storage.
