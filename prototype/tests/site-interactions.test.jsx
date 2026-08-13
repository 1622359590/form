import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.jsx";
import { ReservedAction } from "../src/components/ReservedAction.jsx";
import { SiteHeader } from "../src/components/SiteHeader.jsx";

const items = [
  { id: "project-overview", label: "Overview" },
  { id: "solution-chip", label: "Solutions" },
  { id: "financials", label: "Financials" },
  { id: "vision", label: "Vision" },
];

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

  it("announces that a reserved action is coming soon", async () => {
    const user = userEvent.setup();
    render(<ReservedAction>Download Full BP</ReservedAction>);

    await user.click(screen.getByRole("button", { name: "Download Full BP" }));
    expect(screen.getByRole("status")).toHaveTextContent("Coming soon");
  });
});
