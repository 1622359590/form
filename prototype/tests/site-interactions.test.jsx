import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App.jsx";
import { SiteHeader } from "../src/components/SiteHeader.jsx";

const items = [
  { id: "project-overview", label: "Overview" },
  { id: "solution-chip", label: "Solutions" },
  { id: "financials", label: "Financials" },
  { id: "vision", label: "Vision" },
];

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

describe("site interactions", () => {
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
    expect(decodeURIComponent(deckHref)).toBe(
      "mailto:huanglb118@gmail.com?subject=Request for the Lianguang Technology full deck&body=Hello Huang Libo,\n\nI would like to request a copy of the full presentation deck.\n\nThank you.",
    );
    expect(decodeURIComponent(bpHref)).toBe(
      "mailto:huanglb118@gmail.com?subject=Request for the Lianguang Technology full business plan&body=Hello Huang Libo,\n\nI would like to request a copy of the full business plan when it is available.\n\nThank you.",
    );
  });

  it("sets the booking date floor from the current date in Asia/Shanghai", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-12T16:30:00.000Z"));
    render(<App />);

    expect(screen.getByLabelText("Preferred date")).toHaveAttribute(
      "min",
      "2026-08-13",
    );
  });

  it("gives every primary CTA an honest, usable destination", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      "#contact",
    );
    expect(
      screen.getByRole("link", { name: "Schedule a Meeting" }),
    ).toHaveAttribute("href", "#booking");
    expect(screen.queryByText("Coming soon")).not.toBeInTheDocument();
  });

  it("exposes the booking form and verified contact details", () => {
    render(<App />);

    expect(
      screen.getByRole("region", { name: "Plan a focused conversation" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "huanglb118@gmail.com" }),
    ).toHaveAttribute("href", "mailto:huanglb118@gmail.com");
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

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid reply email.",
    );
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

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a preferred date.",
    );
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

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a preferred time.",
    );
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

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose today or a future date.",
    );
    expect(
      screen.getByRole("link", { name: "Continue in email" }),
    ).toHaveAttribute("href", "#booking");
  });

  it("builds an in-person request with the verified address", async () => {
    const user = userEvent.setup();
    render(<App />);
    await fillValidMeeting(user);

    const decodedHref = decodeURIComponent(
      screen
        .getByRole("link", { name: "Continue in email" })
        .getAttribute("href"),
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
      screen
        .getByRole("link", { name: "Continue in email" })
        .getAttribute("href"),
    );
    expect(decodedHref).toContain("Location: Online link to be confirmed");
    expect(decodedHref).not.toContain("宏海公路2050号");
  });

  it("reports that an email handoff remains pending confirmation", async () => {
    const user = userEvent.setup();
    render(<App />);
    await fillValidMeeting(user);

    const continueLink = screen.getByRole("link", {
      name: "Continue in email",
    });
    continueLink.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    await user.click(continueLink);

    expect(screen.getByRole("status")).toHaveTextContent(
      /remains pending confirmation/i,
    );
  });

  it("copies a meeting request and reports success", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<App />);
    await fillValidMeeting(user);

    await user.click(
      screen.getByRole("button", { name: "Copy meeting request" }),
    );

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("To: huanglb118@gmail.com");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Meeting request copied.",
    );
  });

  it("exposes copyable text when Clipboard API access fails", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Copy email" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      /copy the text shown below/i,
    );
    expect(
      screen.getByRole("textbox", { name: "Text to copy manually" }),
    ).toHaveValue("huanglb118@gmail.com");
  });

  it("opens and dismisses the mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader items={items} />);

    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);
    expect(screen.getByRole("navigation", { name: /mobile/i })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });

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
    screen
      .getByRole("navigation", { name: /mobile/i })
      .querySelector("a")
      .focus();
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

    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile navigation after choosing a section", async () => {
    const user = userEvent.setup();
    render(<SiteHeader items={items} />);

    await user.click(screen.getByRole("button", { name: /open navigation/i }));
    await user.click(
      screen.getByRole("navigation", { name: /mobile/i }).querySelector(
        'a[href="#financials"]',
      ),
    );

    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });

});
