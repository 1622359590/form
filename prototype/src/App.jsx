import { CardBody } from "./components/ContentModules.jsx";
import { Hero } from "./components/Hero.jsx";
import { SectionShell } from "./components/SectionShell.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { navItems, siteContent } from "./content/site-content.js";

const darkSections = new Set(["strategic-positioning", "solution-chip", "financials"]);

export function App() {
  const [hero, ...sections] = siteContent.cards;

  return (
    <>
      <SiteHeader items={navItems} />
      <main>
        <Hero card={hero} />
        {sections.map((card) => (
          <SectionShell
            card={card}
            key={card.id}
            tone={darkSections.has(card.id) ? "blue" : "light"}
          >
            <CardBody card={card} />
          </SectionShell>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
