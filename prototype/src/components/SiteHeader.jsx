import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function NavLinks({ items, onNavigate }) {
  return items.map((item) => (
    <a href={`#${item.id}`} key={item.id} onClick={onNavigate}>
      {item.label}
    </a>
  ));
}

export function SiteHeader({ items }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#hero" aria-label="联广科技 home">
          <span className="brand__text">联广科技</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary">
          <NavLinks items={items} />
        </nav>

        <a className="header-cta" href="#vision">
          Investment thesis
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <nav className="mobile-nav" aria-label="Mobile">
          <NavLinks items={items} onNavigate={() => setIsOpen(false)} />
        </nav>
      ) : null}
    </header>
  );
}
