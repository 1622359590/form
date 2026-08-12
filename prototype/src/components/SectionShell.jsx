export function SectionShell({ card, children, tone = "light" }) {
  return (
    <section
      className={`section-region section-region--${tone}`}
      id={card.id}
      aria-label={card.sourceTitle}
    >
      <div className="page-shell section-shell">
        <header className="section-heading">
          {card.label ? <p className="eyebrow">{card.label}</p> : null}
          <h2 id={`${card.id}-title`}>{card.heading}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}
