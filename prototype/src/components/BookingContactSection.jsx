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
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(value);
      setFallbackText("");
      setStatus(successMessage);
    } catch {
      setFallbackText(value);
      setStatus("Automatic copy is unavailable. Copy the text shown below.");
    }
  }

  return (
    <section
      className="launch-actions"
      id="booking"
      aria-labelledby="booking-title"
    >
      <div className="page-shell launch-actions__shell">
        <header className="launch-actions__intro">
          <p className="eyebrow">Contact &amp; booking</p>
          <h2 id="booking-title">Plan a focused conversation</h2>
          <p>
            Suggest a 30-minute time in Shanghai. Your request remains pending
            until Huang Libo confirms it by email.
          </p>
        </header>

        <div className="launch-actions__grid">
          <form
            className="booking-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="form-grid">
              <label className="field">
                <span>Name</span>
                <input
                  name="name"
                  required
                  value={values.name}
                  onChange={updateField}
                />
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
                <select
                  name="format"
                  value={values.format}
                  onChange={updateField}
                >
                  <option value="online">Online</option>
                  <option value="in-person">
                    In person · Shanghai Chongming
                  </option>
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
                <textarea
                  name="topic"
                  rows="3"
                  value={values.topic}
                  onChange={updateField}
                />
              </label>
            </div>

            {values.format === "in-person" ? (
              <p className="booking-form__location">
                <MapPin aria-hidden="true" /> {contactDetails.address}
              </p>
            ) : null}
            {attempted && error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}

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
                onClick={() =>
                  copyValue(request.text, "Meeting request copied.")
                }
              >
                <Copy aria-hidden="true" /> Copy meeting request
              </button>
            </div>
            <p className="booking-form__privacy">
              This site does not store form entries. 邮件发出后，预约仍需人工确认。
            </p>
          </form>

          <aside
            className="contact-card"
            id="contact"
            aria-labelledby="contact-title"
          >
            <span className="contact-card__icon">
              <Clock3 aria-hidden="true" />
            </span>
            <p className="eyebrow">Direct contact</p>
            <h3 id="contact-title">
              {contactDetails.name}, {contactDetails.title}
            </h3>
            <p>{contactDetails.company}</p>
            <a href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
            </a>
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

        <p className="copy-status" role="status" aria-live="polite">
          {status}
        </p>
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
