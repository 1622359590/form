import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReservedAction } from "../src/components/ReservedAction.jsx";
import { SiteHeader } from "../src/components/SiteHeader.jsx";

const items = [
  { id: "project-overview", label: "Overview" },
  { id: "solution-chip", label: "Solutions" },
  { id: "financials", label: "Financials" },
  { id: "vision", label: "Vision" },
];

describe("site interactions", () => {
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
