# Launch-Ready Website Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four placeholder calls to action with honest email, contact, and self-hosted booking flows that are ready to publish as a static website.

**Architecture:** Keep all public contact data and URI construction in one pure `site-actions.js` module. Render the existing hero and closing CTAs as semantic links, then add one accessible `BookingContactSection` after the source content; it gathers details locally and exposes a real `mailto:` handoff plus clipboard fallback without storing data. Harden the existing header in place rather than introducing a router or scheduling backend.

**Tech Stack:** React 19, Vite 6, Vitest 3, Testing Library, Lucide React, semantic HTML, CSS, `mailto:` URLs, Clipboard API.

## Global Constraints

- Public email: `huanglb118@gmail.com`.
- In-person address: `上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）`.
- Booking URL after deployment: `https://from.shmww.top/#booking`.
- Meeting duration: 30 minutes; displayed timezone: `Asia/Shanghai`.
- The app remains a static Vite build with no database, email API, calendar API, authentication, or third-party scheduling service.
- The full BP/PDF remains deferred; no fake download, empty file, print substitute, or `Coming soon` feedback may remain.
- A generated email is a request handoff, never proof that a message was sent or a time confirmed.
- Existing English source content and visual direction remain unchanged apart from the approved CTA label `Request Full BP` and concise booking/contact clarification.
- Follow `prototype/AGENTS.md`: keep the existing Sites build/worker files intact and finish with `npm run build` plus `npm run test:sites`.

## File Map

- Create `prototype/src/content/site-actions.js`: public contact configuration, encoded email actions, Shanghai-date formatting, meeting validation, and meeting-request construction.
- Create `prototype/src/components/BookingContactSection.jsx`: first-party booking form, contact card, clipboard success/fallback states, and truthful pending-confirmation copy.
- Modify `prototype/src/components/Hero.jsx`: replace two `ReservedAction` instances with real action links.
- Modify `prototype/src/components/ContentModules.jsx`: replace the closing placeholders and relabel the unavailable download as `Request Full BP`.
- Delete `prototype/src/components/ReservedAction.jsx`: the placeholder interaction is no longer part of the product.
- Modify `prototype/src/App.jsx`: render the booking/contact region after the 14 preserved source regions.
- Modify `prototype/src/components/SiteHeader.jsx`: add ARIA linkage, Escape focus restoration, and desktop-breakpoint reset.
- Modify `prototype/src/styles.css`: make button styles work for links, style the booking/contact region and validation feedback, and guarantee a 44-pixel menu target.
- Modify `prototype/tests/site-interactions.test.jsx`: observable CTA, URI encoding, timezone/date validation, booking, contact-copy, and mobile-menu behavior tests through the rendered app.
- Modify `prototype/tests/site-content.test.jsx`: distinguish the 14 source regions from the additional booking region.
- Modify `design-qa.md`: record the launch-action QA and remove the obsolete reserved-action claims.

---

### Task 1: Define Contact Configuration and Email-Request CTAs

**Files:**
- Create: `prototype/src/content/site-actions.js`
- Modify: `prototype/src/components/Hero.jsx`
- Modify: `prototype/src/components/ContentModules.jsx`
- Modify: `prototype/src/styles.css:287-348`
- Modify: `prototype/tests/site-interactions.test.jsx`

**Interfaces:**
- Produces: `contactDetails`, `buildMailto({ subject, body })`, and `actionLinks` from `src/content/site-actions.js`.
- `actionLinks` has exact keys `requestDeck`, `contact`, `schedule`, and `requestBp`.
- Later tasks extend the same module with meeting helpers and consume `contactDetails` in the booking/contact component.

- [ ] **Step 1: Write a failing rendered-app test for encoded email links and the two email-request CTAs**

Import `App` in `prototype/tests/site-interactions.test.jsx` and add an integration test with hand-derived decoded URI literals. Keep the existing `ReservedAction` test until Task 2 replaces the remaining contact and scheduling placeholders:

```jsx
import { App } from "../src/App.jsx";

it("connects deck and BP requests to the verified public email", () => {
  render(<App />);

  const deckHref = screen
    .getByRole("link", { name: "Request Full Deck" })
    .getAttribute("href");
  const bpHref = screen
    .getByRole("link", { name: "Request Full BP" })
    .getAttribute("href");
  expect(deckHref).toContain(
    "subject=Request%20for%20the%20Lianguang%20Technology%20full%20deck",
  );
  expect(deckHref).toContain("%0A%0A");
  expect(
    decodeURIComponent(deckHref),
  ).toBe(
    "mailto:huanglb118@gmail.com?subject=Request for the Lianguang Technology full deck&body=Hello Huang Libo,\n\nI would like to request a copy of the full presentation deck.\n\nThank you.",
  );
  expect(
    decodeURIComponent(bpHref),
  ).toBe(
    "mailto:huanglb118@gmail.com?subject=Request for the Lianguang Technology full business plan&body=Hello Huang Libo,\n\nI would like to request a copy of the full business plan when it is available.\n\nThank you.",
  );
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx
```

Expected: FAIL because `site-actions.js` does not exist and the deck/BP request links are absent.

- [ ] **Step 3: Add the centralized action model and semantic links**

Create `prototype/src/content/site-actions.js`:

```js
export const contactDetails = Object.freeze({
  email: "huanglb118@gmail.com",
  name: "Huang Libo",
  title: "Director",
  company: "联广科技 × 贵真科技",
  address: "上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）",
  timezone: "Asia/Shanghai",
  meetingMinutes: 30,
});

export function buildMailto({ subject, body }) {
  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const actionLinks = Object.freeze({
  requestDeck: buildMailto({
    subject: "Request for the Lianguang Technology full deck",
    body: "Hello Huang Libo,\n\nI would like to request a copy of the full presentation deck.\n\nThank you.",
  }),
  contact: "#contact",
  schedule: "#booking",
  requestBp: buildMailto({
    subject: "Request for the Lianguang Technology full business plan",
    body: "Hello Huang Libo,\n\nI would like to request a copy of the full business plan when it is available.\n\nThank you.",
  }),
});
```

- [ ] **Step 4: Convert the two email-request controls to semantic links**

In `prototype/src/components/Hero.jsx`, import `actionLinks`, keep the `ReservedAction` import for `Contact Us`, and replace the action row with:

```jsx
<div className="button-row">
  <a className="button button--primary" href={actionLinks.requestDeck}>
    {card.buttons[0]}
  </a>
  <ReservedAction variant="secondary">{card.buttons[1]}</ReservedAction>
</div>
```

In `prototype/src/components/ContentModules.jsx`, import `actionLinks`, keep the `ReservedAction` import for scheduling, and replace the final action row with:

```jsx
<div className="button-row button-row--center">
  <ReservedAction>{card.buttons[0]}</ReservedAction>
  <a className="button button--secondary" href={actionLinks.requestBp}>
    Request Full BP
  </a>
</div>
```

In `prototype/src/styles.css`, keep the reserved-action rules for the two remaining placeholders, and make the shared action class work equally for links and buttons:

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx
```

Expected: PASS, with both email CTAs rendered as links; the pre-existing placeholder test still passes for the two actions intentionally completed in Task 2.

- [ ] **Step 6: Commit the CTA slice**

```bash
git add prototype/src/content/site-actions.js prototype/src/components/Hero.jsx prototype/src/components/ContentModules.jsx prototype/src/styles.css prototype/tests/site-interactions.test.jsx
git commit -m "feat: connect launch email requests"
```

---

### Task 2: Add the First-Party Booking and Contact Region

**Files:**
- Modify: `prototype/src/content/site-actions.js`
- Create: `prototype/src/components/BookingContactSection.jsx`
- Modify: `prototype/src/components/Hero.jsx`
- Modify: `prototype/src/components/ContentModules.jsx`
- Delete: `prototype/src/components/ReservedAction.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css:340-380, 1008-1293`
- Modify: `prototype/tests/site-interactions.test.jsx`
- Modify: `prototype/tests/site-content.test.jsx`

**Interfaces:**
- Produces: `getShanghaiDateInputValue(now?) -> string`, `validateMeetingRequest(values, today?) -> string | null`, and `buildMeetingRequest(values) -> { href: string, text: string }`.
- `values` has exact string keys `name`, `email`, `format`, `date`, `time`, and `topic`; `format` is `online` or `in-person`.
- `BookingContactSection` consumes the action helpers and renders elements with stable IDs `booking` and `contact`.

- [ ] **Step 1: Write failing rendered-app tests for Shanghai dates and generated meeting content**

These tests import only the existing `App`, so RED is an assertion failure against missing user-visible behavior rather than a module-resolution error. Add them to `prototype/tests/site-interactions.test.jsx`:

```jsx
it("sets the booking date floor from the current date in Asia/Shanghai", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-12T16:30:00.000Z"));
  render(<App />);

  expect(screen.getByLabelText("Preferred date")).toHaveAttribute(
    "min",
    "2026-08-13",
  );
});

it("builds an in-person email request with the verified address", async () => {
  const user = userEvent.setup();
  render(<App />);
  await fillValidMeeting(user);

  const decodedHref = decodeURIComponent(
    screen.getByRole("link", { name: "Continue in email" }).getAttribute("href"),
  );
  expect(decodedHref).toContain(
    "mailto:huanglb118@gmail.com?subject=Meeting request — 2099-08-20 14:30 — Ada Lovelace",
  );
  expect(decodedHref).toContain("Format: In person · Shanghai Chongming");
  expect(decodedHref).toContain(
    "Location: 上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）",
  );
  expect(decodedHref).toContain("Duration: 30 minutes");
});

it("uses an unconfirmed online location without leaking the office address", async () => {
  const user = userEvent.setup();
  render(<App />);
  await fillValidMeeting(user);
  await user.selectOptions(screen.getByLabelText("Meeting format"), "online");

  const decodedHref = decodeURIComponent(
    screen.getByRole("link", { name: "Continue in email" }).getAttribute("href"),
  );
  expect(decodedHref).toContain("Location: Online link to be confirmed");
  expect(decodedHref).not.toContain("宏海公路2050号");
});
```

- [ ] **Step 2: Write failing interaction tests for all CTA destinations, booking, contact, and clipboard fallback**

Replace the existing Testing Library/Vitest imports in `prototype/tests/site-interactions.test.jsx` with the expanded imports below and retain the Task 1 `App` import:

```jsx
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
```

Delete the old `announces that a reserved action is coming soon` test. Add these behavior tests; the clipboard double replaces only the unavailable browser boundary, while assertions remain on visible component behavior and generated content:

```jsx
const originalClipboard = navigator.clipboard;
const originalInnerWidth = window.innerWidth;

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: originalClipboard,
  });
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: originalInnerWidth,
  });
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("gives every primary CTA an honest, usable destination", () => {
  render(<App />);

  expect(screen.getByRole("link", { name: "Request Full Deck" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^mailto:huanglb118@gmail\.com\?/),
  );
  expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
    "href",
    "#contact",
  );
  expect(screen.getByRole("link", { name: "Schedule a Meeting" })).toHaveAttribute(
    "href",
    "#booking",
  );
  expect(screen.getByRole("link", { name: "Request Full BP" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^mailto:huanglb118@gmail\.com\?/),
  );
  expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
});

async function fillValidMeeting(user) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Reply email"), "ada@example.com");
  await user.selectOptions(screen.getByLabelText("Meeting format"), "in-person");
  fireEvent.change(screen.getByLabelText("Preferred date"), {
    target: { value: "2099-08-20" },
  });
  fireEvent.change(screen.getByLabelText("Preferred time"), {
    target: { value: "14:30" },
  });
  await user.type(screen.getByLabelText("Topic (optional)"), "Compute partnership");
}

it("exposes the booking form and verified contact details", () => {
  render(<App />);

  expect(screen.getByRole("region", { name: "Plan a focused conversation" })).toBeVisible();
  expect(screen.getByRole("link", { name: "huanglb118@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:huanglb118@gmail.com",
  );
  expect(document.getElementById("contact")).toBeVisible();
  expect(screen.getByText(/宏海公路2050号/)).toBeVisible();
  expect(screen.getByText(/does not store form entries/i)).toBeVisible();
});

it("requires a visitor name before creating a meeting request", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("link", { name: "Continue in email" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Enter your name.");
});

it("rejects an invalid reply email", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Reply email"), "not-an-email");
  fireEvent.change(screen.getByLabelText("Preferred date"), {
    target: { value: "2099-08-20" },
  });
  fireEvent.change(screen.getByLabelText("Preferred time"), {
    target: { value: "14:30" },
  });
  await user.click(screen.getByRole("link", { name: "Continue in email" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid reply email.");
});

it("requires a preferred date", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Reply email"), "ada@example.com");
  fireEvent.change(screen.getByLabelText("Preferred time"), {
    target: { value: "14:30" },
  });
  await user.click(screen.getByRole("link", { name: "Continue in email" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Choose a preferred date.");
});

it("requires a preferred time", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Reply email"), "ada@example.com");
  fireEvent.change(screen.getByLabelText("Preferred date"), {
    target: { value: "2099-08-20" },
  });
  await user.click(screen.getByRole("link", { name: "Continue in email" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Choose a preferred time.");
});

it("turns valid booking details into an email handoff pending confirmation", async () => {
  const user = userEvent.setup();
  render(<App />);
  await fillValidMeeting(user);

  const continueLink = screen.getByRole("link", { name: "Continue in email" });
  expect(decodeURIComponent(continueLink.getAttribute("href"))).toContain(
    "Meeting request — 2099-08-20 14:30 — Ada Lovelace",
  );
  expect(decodeURIComponent(continueLink.getAttribute("href"))).toContain(
    "Location: 上海市崇明区庙镇宏海公路2050号（上海庙镇经济开发区）",
  );

  continueLink.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  await user.click(continueLink);
  expect(screen.getByRole("status")).toHaveTextContent(/remains pending confirmation/i);
});

it("blocks a past date before creating an email request", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Reply email"), "ada@example.com");
  fireEvent.change(screen.getByLabelText("Preferred date"), {
    target: { value: "2000-01-01" },
  });
  fireEvent.change(screen.getByLabelText("Preferred time"), {
    target: { value: "14:30" },
  });
  await user.click(screen.getByRole("link", { name: "Continue in email" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Choose today or a future date.");
  expect(screen.getByRole("link", { name: "Continue in email" })).toHaveAttribute(
    "href",
    "#booking",
  );
});

it("copies a meeting request and reports success", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  const user = userEvent.setup();
  render(<App />);
  await fillValidMeeting(user);

  await user.click(screen.getByRole("button", { name: "Copy meeting request" }));

  expect(writeText).toHaveBeenCalledOnce();
  expect(writeText.mock.calls[0][0]).toContain("To: huanglb118@gmail.com");
  expect(screen.getByRole("status")).toHaveTextContent("Meeting request copied.");
});

it("exposes copyable text when Clipboard API access fails", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
  });
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Copy email" }));

  expect(screen.getByRole("status")).toHaveTextContent(/copy the text shown below/i);
  expect(screen.getByRole("textbox", { name: "Text to copy manually" })).toHaveValue(
    "huanglb118@gmail.com",
  );
});
```

In `prototype/tests/site-content.test.jsx`, keep the source-card assertion independent from the new utility region and require the booking region:

```jsx
it("renders all 14 source cards as ordered page regions", () => {
  render(<App />);

  const sourceRegions = screen
    .getAllByRole("region")
    .filter((region) => region.id !== "booking");
  expect(sourceRegions).toHaveLength(14);
  expect(sourceRegions[0]).toHaveAccessibleName(orderedTitles[0]);
  expect(sourceRegions[13]).toHaveAccessibleName(orderedTitles[13]);
  expect(
    screen.getByRole("region", { name: "Plan a focused conversation" }),
  ).toBeVisible();
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx tests/site-content.test.jsx
```

Expected: FAIL because the three meeting helpers and `BookingContactSection` do not exist, `Contact Us` and `Schedule a Meeting` are still buttons, `Coming soon` remains, and the app still renders only 14 regions.

- [ ] **Step 4: Implement pure meeting helpers**

Append to `prototype/src/content/site-actions.js`:

```js
export function getShanghaiDateInputValue(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: contactDetails.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateMeetingRequest(values, today = getShanghaiDateInputValue()) {
  if (!values.name.trim()) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return "Enter a valid reply email.";
  }
  if (!values.date) return "Choose a preferred date.";
  if (values.date < today) return "Choose today or a future date.";
  if (!/^\d{2}:\d{2}$/.test(values.time)) return "Choose a preferred time.";
  if (!new Set(["online", "in-person"]).has(values.format)) {
    return "Choose a meeting format.";
  }
  return null;
}

export function buildMeetingRequest(values) {
  const inPerson = values.format === "in-person";
  const format = inPerson ? "In person · Shanghai Chongming" : "Online";
  const location = inPerson
    ? contactDetails.address
    : "Online link to be confirmed";
  const topic = values.topic.trim() || "Not specified";
  const subject = `Meeting request — ${values.date} ${values.time} — ${values.name.trim()}`;
  const body = [
    `Hello ${contactDetails.name},`,
    "",
    `I would like to request a ${contactDetails.meetingMinutes}-minute meeting.`,
    "",
    `Name: ${values.name.trim()}`,
    `Reply email: ${values.email.trim()}`,
    `Preferred date: ${values.date}`,
    `Preferred time: ${values.time} (${contactDetails.timezone})`,
    `Duration: ${contactDetails.meetingMinutes} minutes`,
    `Format: ${format}`,
    `Location: ${location}`,
    `Topic: ${topic}`,
    "",
    "Please confirm whether this time works.",
  ].join("\n");

  return {
    href: buildMailto({ subject, body }),
    text: `To: ${contactDetails.email}\nSubject: ${subject}\n\n${body}`,
  };
}
```

- [ ] **Step 5: Implement the booking/contact component**

Create `prototype/src/components/BookingContactSection.jsx` with this component contract:

```jsx
import { useMemo, useState } from "react";
import { Clock3, Copy, Mail, MapPin } from "lucide-react";
import {
  buildMeetingRequest,
  contactDetails,
  getShanghaiDateInputValue,
  validateMeetingRequest,
} from "../content/site-actions.js";

const initialValues = {
  name: "",
  email: "",
  format: "online",
  date: "",
  time: "",
  topic: "",
};

export function BookingContactSection() {
  const [values, setValues] = useState(initialValues);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const today = getShanghaiDateInputValue();
  const error = validateMeetingRequest(values, today);
  const request = useMemo(
    () => (error ? null : buildMeetingRequest(values)),
    [error, values],
  );

  function updateField(event) {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
    setAttempted(false);
    setStatus("");
    setFallbackText("");
  }

  function continueInEmail(event) {
    if (error) {
      event.preventDefault();
      setAttempted(true);
      setStatus("");
      return;
    }
    setStatus(
      "Your email app is opening. Send the message to submit the request; the time remains pending confirmation.",
    );
  }

  async function copyValue(value, successMessage) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setFallbackText("");
      setStatus(successMessage);
    } catch {
      setFallbackText(value);
      setStatus("Automatic copy is unavailable. Copy the text shown below.");
    }
  }

  return (
    <section className="launch-actions" id="booking" aria-labelledby="booking-title">
      <div className="page-shell launch-actions__shell">
        <header className="launch-actions__intro">
          <p className="eyebrow">Contact & booking</p>
          <h2 id="booking-title">Plan a focused conversation</h2>
          <p>
            Suggest a 30-minute time in Shanghai. Your request remains pending until
            Huang Libo confirms it by email.
          </p>
        </header>

        <div className="launch-actions__grid">
          <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-grid">
              <label className="field">
                <span>Name</span>
                <input name="name" required value={values.name} onChange={updateField} />
              </label>
              <label className="field">
                <span>Reply email</span>
                <input
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={updateField}
                />
              </label>
              <label className="field">
                <span>Meeting format</span>
                <select name="format" value={values.format} onChange={updateField}>
                  <option value="online">Online</option>
                  <option value="in-person">In person · Shanghai Chongming</option>
                </select>
              </label>
              <label className="field">
                <span>Preferred date</span>
                <input
                  name="date"
                  type="date"
                  min={today}
                  required
                  value={values.date}
                  onChange={updateField}
                />
              </label>
              <label className="field">
                <span>Preferred time</span>
                <input
                  name="time"
                  type="time"
                  step="1800"
                  required
                  value={values.time}
                  onChange={updateField}
                />
              </label>
              <label className="field field--wide">
                <span>Topic (optional)</span>
                <textarea name="topic" rows="3" value={values.topic} onChange={updateField} />
              </label>
            </div>

            {values.format === "in-person" ? (
              <p className="booking-form__location">
                <MapPin aria-hidden="true" /> {contactDetails.address}
              </p>
            ) : null}
            {attempted && error ? <p className="form-error" role="alert">{error}</p> : null}

            <div className="button-row booking-form__actions">
              <a
                className="button button--primary"
                href={request?.href ?? "#booking"}
                aria-disabled={Boolean(error)}
                onClick={continueInEmail}
              >
                <Mail aria-hidden="true" /> Continue in email
              </a>
              <button
                className="button button--secondary"
                type="button"
                disabled={!request}
                onClick={() => copyValue(request.text, "Meeting request copied.")}
              >
                <Copy aria-hidden="true" /> Copy meeting request
              </button>
            </div>
            <p className="booking-form__privacy">
              This site does not store form entries. 邮件发出后，预约仍需人工确认。
            </p>
          </form>

          <aside className="contact-card" id="contact" aria-labelledby="contact-title">
            <span className="contact-card__icon"><Clock3 aria-hidden="true" /></span>
            <p className="eyebrow">Direct contact</p>
            <h3 id="contact-title">
              {contactDetails.name}, {contactDetails.title}
            </h3>
            <p>{contactDetails.company}</p>
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <address>{contactDetails.address}</address>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => copyValue(contactDetails.email, "Email copied.")}
            >
              <Copy aria-hidden="true" /> Copy email
            </button>
          </aside>
        </div>

        <p className="copy-status" role="status" aria-live="polite">{status}</p>
        {fallbackText ? (
          <textarea
            className="copy-fallback"
            aria-label="Text to copy manually"
            readOnly
            value={fallbackText}
            onFocus={(event) => event.currentTarget.select()}
          />
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Mount the region and complete the remaining CTA conversions**

Import and mount it in `prototype/src/App.jsx` after the `sections.map(...)` block and before `</main>`:

```jsx
import { BookingContactSection } from "./components/BookingContactSection.jsx";

<BookingContactSection />
```

Complete the two remaining CTA conversions in the same slice so their anchor targets exist in the committed application. In `prototype/src/components/Hero.jsx`, remove the `ReservedAction` import and replace the secondary placeholder with:

```jsx
<a className="button button--secondary" href={actionLinks.contact}>
  {card.buttons[1]}
</a>
```

In `prototype/src/components/ContentModules.jsx`, remove the `ReservedAction` import and replace the scheduling placeholder with:

```jsx
<a className="button button--primary" href={actionLinks.schedule}>
  {card.buttons[0]}
</a>
```

Delete `prototype/src/components/ReservedAction.jsx`, remove `.reserved-action-wrap` and `.reserved-action-status` from `prototype/src/styles.css`, and remove `.reserved-action-wrap` from the 480-pixel width rule so only `.button { width: 100%; }` remains.

- [ ] **Step 7: Add the responsive booking/contact styles**

Add the following blocks to `prototype/src/styles.css`, before `.site-footer` and inside the existing responsive media queries. Replace the existing `.button:hover` rule with the disabled-aware selector shown below rather than keeping both selectors:

```css
.launch-actions {
  border-top: 1px solid var(--line);
  background:
    radial-gradient(circle at 85% 15%, rgba(108, 185, 238, 0.2), transparent 28rem),
    var(--blue-wash);
}

.launch-actions__shell {
  padding-block: 96px;
}

.launch-actions__intro {
  max-width: 720px;
  margin-bottom: 38px;
}

.launch-actions__intro h2 {
  margin-bottom: 18px;
  font-size: clamp(2.2rem, 5vw, 4.4rem);
  line-height: 1;
}

.launch-actions__intro > p:last-child {
  color: var(--ink-soft);
}

.launch-actions__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr);
  gap: 22px;
  align-items: start;
}

.booking-form,
.contact-card {
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: grid;
  gap: 8px;
  color: var(--navy);
  font-size: 0.74rem;
  font-weight: 600;
}

.field--wide {
  grid-column: 1 / -1;
}

.field input,
.field select,
.field textarea,
.copy-fallback {
  width: 100%;
  border: 1px solid #a9cce1;
  border-radius: 11px;
  background: #fff;
  color: var(--ink);
  font: inherit;
}

.field input,
.field select {
  min-height: 48px;
  padding: 0 13px;
}

.field textarea,
.copy-fallback {
  padding: 12px 13px;
  resize: vertical;
}

.booking-form__location,
.booking-form__privacy,
.form-error,
.copy-status {
  font-size: 0.72rem;
}

.booking-form__location {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 18px 0 0;
  color: var(--navy);
}

.booking-form__location svg,
.button svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
}

.booking-form__actions {
  margin-top: 24px;
}

.button:disabled,
.button[aria-disabled="true"] {
  opacity: 0.58;
  cursor: not-allowed;
}

.button:not(:disabled):not([aria-disabled="true"]):hover {
  transform: translateY(-2px);
}

.form-error {
  margin: 16px 0 0;
  color: #9f2f2f;
  font-weight: 600;
}

.booking-form__privacy {
  margin: 16px 0 0;
  color: var(--ink-soft);
}

.contact-card {
  display: grid;
  justify-items: start;
  background: var(--navy-deep);
  color: #dceef8;
}

.contact-card h3 {
  margin-bottom: 8px;
  color: #fff;
  font-size: 1.65rem;
}

.contact-card a {
  margin: 10px 0 18px;
  color: #a9dcfc;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.contact-card address {
  margin-bottom: 24px;
  font-size: 0.78rem;
  font-style: normal;
  line-height: 1.7;
}

.contact-card__icon {
  display: grid;
  width: 44px;
  height: 44px;
  margin-bottom: 28px;
  place-items: center;
  border: 1px solid rgba(169, 220, 252, 0.42);
  border-radius: 50%;
}

.copy-status {
  min-height: 1.4em;
  margin: 18px 0 0;
  color: var(--navy);
  font-weight: 600;
}

.copy-fallback {
  min-height: 110px;
  margin-top: 12px;
}
```

Inside `@media (max-width: 860px)` add:

```css
.launch-actions__grid {
  grid-template-columns: 1fr;
}
```

Inside `@media (max-width: 700px)` add:

```css
.launch-actions__shell {
  padding-block: 76px;
}

.form-grid {
  grid-template-columns: 1fr;
}

.field--wide {
  grid-column: auto;
}
```

Inside `@media (max-width: 480px)` add:

```css
.booking-form,
.contact-card {
  padding: 24px 20px;
}
```

- [ ] **Step 8: Run focused tests and verify GREEN**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx tests/site-content.test.jsx
```

Expected: PASS with the 14 source regions preserved plus one named booking region, exact in-person address behavior, online-location behavior, clipboard success, and manual-copy fallback.

- [ ] **Step 9: Commit the booking/contact slice**

```bash
git add prototype/src/content/site-actions.js prototype/src/components/BookingContactSection.jsx prototype/src/components/Hero.jsx prototype/src/components/ContentModules.jsx prototype/src/components/ReservedAction.jsx prototype/src/App.jsx prototype/src/styles.css prototype/tests/site-interactions.test.jsx prototype/tests/site-content.test.jsx
git commit -m "feat: add first-party meeting requests"
```

---

### Task 3: Harden the Mobile Navigation

**Files:**
- Modify: `prototype/src/components/SiteHeader.jsx`
- Modify: `prototype/src/styles.css:178-191`
- Modify: `prototype/tests/site-interactions.test.jsx`

**Interfaces:**
- `SiteHeader({ items })` keeps its public props unchanged.
- The menu trigger controls the exact element ID `mobile-navigation`.
- The desktop reset threshold matches the existing CSS breakpoint: widths greater than 860 pixels close the mobile menu.

- [ ] **Step 1: Write failing tests for ARIA linkage, Escape focus restoration, and resize reset**

Extend the existing menu tests in `prototype/tests/site-interactions.test.jsx`:

```jsx
it("links the menu trigger to the controlled mobile navigation", async () => {
  const user = userEvent.setup();
  render(<SiteHeader items={items} />);

  const toggle = screen.getByRole("button", { name: /open navigation/i });
  expect(toggle).toHaveAttribute("aria-controls", "mobile-navigation");
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("navigation", { name: /mobile/i })).toHaveAttribute(
    "id",
    "mobile-navigation",
  );
});

it("returns focus to the menu trigger after Escape", async () => {
  const user = userEvent.setup();
  render(<SiteHeader items={items} />);

  const toggle = screen.getByRole("button", { name: /open navigation/i });
  await user.click(toggle);
  await user.keyboard("{Escape}");

  expect(toggle).toHaveFocus();
});

it("closes the mobile menu when the viewport returns to desktop", async () => {
  const user = userEvent.setup();
  render(<SiteHeader items={items} />);

  await user.click(screen.getByRole("button", { name: /open navigation/i }));
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
  });
  fireEvent(window, new Event("resize"));

  expect(screen.queryByRole("navigation", { name: /mobile/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the menu tests and verify RED**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx
```

Expected: FAIL because `aria-controls`, the navigation ID, focus restoration, and resize handling are absent.

- [ ] **Step 3: Implement the menu state hardening**

In `prototype/src/components/SiteHeader.jsx`, replace the React import with:

```jsx
import { useEffect, useRef, useState } from "react";
```

Then, inside `SiteHeader`, replace the existing state declaration and Escape effect with these exact declarations/effects:

```jsx
const [isOpen, setIsOpen] = useState(false);
const toggleRef = useRef(null);

useEffect(() => {
  if (!isOpen) return undefined;

  function onKeyDown(event) {
    if (event.key !== "Escape") return;
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [isOpen]);

useEffect(() => {
  function onResize() {
    if (window.innerWidth > 860) setIsOpen(false);
  }

  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

Add these exact attributes to the trigger:

```jsx
ref={toggleRef}
aria-controls="mobile-navigation"
```

Add this ID to the conditional mobile navigation:

```jsx
<nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile">
```

Change the trigger dimensions in `prototype/src/styles.css`:

```css
.menu-toggle {
  width: 44px;
  height: 44px;
}
```

- [ ] **Step 4: Run menu tests and verify GREEN**

Run:

```bash
cd prototype
npm test -- tests/site-interactions.test.jsx
```

Expected: PASS for open/close, link close, ARIA linkage, Escape focus return, and desktop resize reset.

- [ ] **Step 5: Commit the navigation slice**

```bash
git add prototype/src/components/SiteHeader.jsx prototype/src/styles.css prototype/tests/site-interactions.test.jsx
git commit -m "fix: harden mobile navigation controls"
```

---

### Task 4: Full Verification and Launch QA

**Files:**
- Modify: `design-qa.md`
- Create: `reference/implementation/desktop-actions-launch.png`
- Create: `reference/implementation/mobile-actions-launch.png`

**Interfaces:**
- No new runtime API; this task verifies the integrated static application and records evidence.

- [ ] **Step 1: Run every automated test**

```bash
cd prototype
npm test
```

Expected: all Vitest suites pass with no warnings or unhandled errors.

- [ ] **Step 2: Build the production artifact and test Sites packaging**

```bash
cd prototype
npm run build
npm run test:sites
```

Expected: Vite produces `dist/client/index.html`; the packaging script produces `dist/server/index.js` and `dist/.openai/hosting.json`; all five Sites tests pass.

- [ ] **Step 3: Run the production preview and verify desktop behavior**

Start or reuse the production preview at `http://localhost:4173/`. At 1440 × 900:

- Click `Request Full Deck` and confirm the browser exposes a `mailto:huanglb118@gmail.com` destination with the deck subject/body.
- Click `Contact Us` and confirm the contact card clears the sticky header.
- Click `Schedule a Meeting` and confirm the URL ends in `#booking`.
- Fill the in-person request and confirm the generated mail link contains the Shanghai address, `Asia/Shanghai`, and 30 minutes.
- Switch to Online and confirm the visible/generated location becomes `Online link to be confirmed`.
- Verify both clipboard success and the visible manual-copy fallback by temporarily denying clipboard access.
- Confirm no failed network request, duplicate ID, console warning/error, or horizontal overflow.
- Capture the verified region as `reference/implementation/desktop-actions-launch.png`.

- [ ] **Step 4: Verify mobile behavior and keyboard access**

At 390 × 844:

- Confirm every CTA and form action is at least 44 pixels high and labels are not clipped.
- Open the menu, press Escape, and confirm focus returns visibly to the trigger.
- Open it again, choose a destination, and confirm the menu closes.
- Rotate or resize past 860 pixels and confirm the mobile menu state resets.
- Complete the booking form using only the keyboard and confirm invalid/past dates remain blocked.
- Confirm the booking grid stacks, the address wraps naturally, and document width equals viewport width.
- Capture the verified region as `reference/implementation/mobile-actions-launch.png`.

- [ ] **Step 5: Update the QA record with the verified launch state**

In `design-qa.md`:

- Replace all `reserved action` and `Coming soon` statements with the four final mappings: deck email, contact anchor, booking anchor/form, and BP email request.
- Add `reference/implementation/desktop-actions-launch.png` and `reference/implementation/mobile-actions-launch.png` to the implementation evidence list.
- Add a `Pass 4 — Launch-ready actions` entry recording desktop/mobile sizes, booking validation, clipboard fallback, menu focus/resize behavior, zero failed requests, zero duplicate IDs, and console status.
- Change the follow-up note so PDF authoring and backend availability/confirmation remain the only deferred action work.

- [ ] **Step 6: Review the final diff and rerun the release gate**

```bash
git diff --check
git status --short
cd prototype
npm test && npm run build && npm run test:sites
```

Expected: no whitespace errors; only intended source, test, QA, and screenshot files differ; every command exits zero.

- [ ] **Step 7: Commit the verified QA evidence**

```bash
git add design-qa.md reference/implementation/desktop-actions-launch.png reference/implementation/mobile-actions-launch.png
git commit -m "docs: verify launch-ready site actions"
```
