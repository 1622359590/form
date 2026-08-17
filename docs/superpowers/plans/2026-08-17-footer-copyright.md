# Footer Copyright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the site owner's exact company copyright notice as the last line of the existing footer.

**Architecture:** Extend the existing `SiteFooter` component rather than creating another page-level element. Cover the exact rendered copy with the existing React Testing Library content suite, then add a narrowly scoped footer modifier class for subdued presentation.

**Tech Stack:** React 19, CSS, Vitest, React Testing Library, Vite

## Global Constraints

- Render exactly: `2026 LIANGUANGIATEK LIMITED. All rights reserved.`
- Do not add a copyright symbol or change the supplied company name.
- Keep the existing footer brand, tagline, and director/date lines unchanged.
- Keep the layout readable and centered on desktop and mobile.
- Do not change booking, contact, page content, or deployment behavior.

---

### Task 1: Add and verify the footer copyright line

**Files:**
- Modify: `prototype/tests/site-content.test.jsx`
- Modify: `prototype/src/components/SiteFooter.jsx`
- Modify: `prototype/src/styles.css`

**Interfaces:**
- Consumes: the existing `SiteFooter` page-level component and `.site-footer__inner` layout.
- Produces: one final paragraph with class `site-footer__copyright` and the exact supplied copyright text.

- [ ] **Step 1: Write the failing rendering test**

Add this test inside the existing `describe("site content", ...)` block in `prototype/tests/site-content.test.jsx`:

```jsx
it("renders the supplied company copyright in the page footer", () => {
  render(<App />);

  const footer = screen.getByRole("contentinfo");
  expect(footer).toHaveTextContent(
    "2026 LIANGUANGIATEK LIMITED. All rights reserved.",
  );
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
cd prototype
npm test -- tests/site-content.test.jsx
```

Expected: FAIL because the footer does not yet contain `2026 LIANGUANGIATEK LIMITED. All rights reserved.`

- [ ] **Step 3: Add the exact copyright paragraph**

Append this paragraph after the existing director/date paragraph in `prototype/src/components/SiteFooter.jsx`:

```jsx
<p className="site-footer__copyright">
  2026 LIANGUANGIATEK LIMITED. All rights reserved.
</p>
```

- [ ] **Step 4: Add narrowly scoped presentation styling**

Add this rule beside the existing footer styles in `prototype/src/styles.css`:

```css
.site-footer__inner {
  flex-wrap: wrap;
}

.site-footer__copyright {
  flex-basis: 100%;
  padding-top: 20px;
  border-top: 1px solid rgba(220, 238, 248, 0.14);
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-align: center;
}
```

The added `flex-wrap` lets the copyright paragraph occupy a full final row while the three existing footer paragraphs keep their current desktop layout. Under the existing mobile media query, the footer remains stacked and centered.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
cd prototype
npm test -- tests/site-content.test.jsx
```

Expected: all tests in `site-content.test.jsx` pass.

- [ ] **Step 6: Run complete verification**

Run:

```bash
cd prototype
npm test
npm run build
npm run test:sites
```

Expected: all Vitest tests pass, Vite production build exits successfully, and all Sites worker tests pass.

- [ ] **Step 7: Commit and push the verified change**

```bash
git add prototype/tests/site-content.test.jsx prototype/src/components/SiteFooter.jsx prototype/src/styles.css docs/superpowers/plans/2026-08-17-footer-copyright.md
git commit -m "feat: add company copyright footer"
git push origin HEAD:main
```

Expected: GitHub `main` points to the new commit and the working tree is clean.
