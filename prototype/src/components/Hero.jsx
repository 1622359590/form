import { ArrowDownRight } from "lucide-react";
import { ReservedAction } from "./ReservedAction.jsx";

export function Hero({ card }) {
  return (
    <section
      className="hero section-region"
      id={card.id}
      aria-label={card.sourceTitle}
    >
      <img
        className="hero__image"
        src={card.images[0]}
        alt="Glowing semiconductor chip with blue data paths"
      />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content page-shell">
        <p className="eyebrow">联广科技 · Business Plan</p>
        <h1>{card.heading}</h1>
        <p className="hero__meta">{card.paragraphs[0]}</p>
        <div className="button-row">
          <ReservedAction>{card.buttons[0]}</ReservedAction>
          <ReservedAction variant="secondary">{card.buttons[1]}</ReservedAction>
        </div>
        <a className="hero__scroll" href="#project-overview">
          Explore the thesis <ArrowDownRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
