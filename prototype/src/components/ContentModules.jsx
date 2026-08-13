import {
  AlertTriangle,
  Bot,
  Box,
  Building,
  Cable,
  CheckCircle2,
  Cloud,
  Cpu,
  Factory,
  Globe2,
  Landmark,
  Lock,
  MapPin,
  MessageSquare,
  Monitor,
  Network,
  ShieldCheck,
  Store,
  Users,
  Workflow,
} from "lucide-react";
import { actionLinks } from "../content/site-actions.js";

const pillarIcons = [Cpu, Workflow, Bot, MapPin];
const painIcons = [AlertTriangle, Cable, Bot];
const platformIcons = [Monitor, Workflow, MessageSquare, Building];
const engineIcons = [Cpu, Cloud, Store];
const moatIcons = [ShieldCheck, Factory, Network, Users, Lock];
const certaintyIcons = [Landmark, Globe2, Bot];

function BodyCopy({ paragraphs, className = "body-copy" }) {
  return (
    <div className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function InfoGrid({ cells, icons, className = "info-grid" }) {
  return (
    <div className={className}>
      {cells.map((cell, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article className="info-card" key={cell.headings[0]}>
            <span className="info-card__icon">
              <Icon aria-hidden="true" />
            </span>
            <h3>{cell.headings[0]}</h3>
            <BodyCopy paragraphs={cell.paragraphs} />
          </article>
        );
      })}
    </div>
  );
}

function DataTable({ rows, labelledBy }) {
  const [head, ...body] = rows;

  return (
    <div className="table-wrap">
      <table aria-labelledby={labelledBy}>
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th key={`${cell}-${index}`} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={`${cell}-${index}`} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={`${cell}-${index}`} data-label={head[index]}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectOverview({ card }) {
  return (
    <div className="editorial-split">
      <BodyCopy paragraphs={card.gridCells[0].paragraphs} />
      <aside className="dark-panel">
        <p className="eyebrow eyebrow--light">Strategic integration</p>
        <h3>{card.subheadings[0]}</h3>
        <BodyCopy paragraphs={card.gridCells[1].paragraphs} />
      </aside>
    </div>
  );
}

function PillarSection({ card, icons, intro = true }) {
  return (
    <>
      {intro ? <p className="section-intro">{card.paragraphs[0]}</p> : null}
      <InfoGrid cells={card.smartCells} icons={icons} />
      {card.id === "solution-platform" ? (
        <div className="closing-note">
          <CheckCircle2 aria-hidden="true" />
          <p>{card.paragraphs.at(-1)}</p>
        </div>
      ) : null}
    </>
  );
}

function PriorityMatrix({ card }) {
  return (
    <>
      <p className="section-intro">{card.paragraphs[0]}</p>
      <DataTable rows={card.tableRows} labelledBy={`${card.id}-title`} />
    </>
  );
}

function ChipComparison({ card }) {
  return (
    <div className="comparison-layout">
      <div>
        <p className="section-kicker">Mass-produced. Full-precision. Shipping.</p>
        <BodyCopy paragraphs={card.gridCells[0].paragraphs} />
      </div>
      <DataTable rows={card.tableRows} labelledBy={`${card.id}-title`} />
    </div>
  );
}

function RoboticsFeature({ card }) {
  return (
    <div className="feature-split">
      <figure className="feature-visual">
        <img
          src={card.images[0]}
          alt="Humanoid robot inside a technology showroom"
        />
        <figcaption>Brain + Soul, embodied in the physical world.</figcaption>
      </figure>
      <div className="feature-copy">
        <h3>{card.subheadings[0]}</h3>
        <BodyCopy paragraphs={card.paragraphs} />
        <ul className="check-list">
          {card.bullets.map((bullet) => (
            <li key={bullet}>
              <CheckCircle2 aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TeamGrid({ card }) {
  return (
    <>
      <p className="section-intro">{card.paragraphs[0]}</p>
      <div className="team-grid">
        {card.smartCells.map((cell) => (
          <article className="person-card" key={cell.headings[0]}>
            <img src={cell.images[0]} alt={`Portrait of ${cell.headings[0]}`} />
            <div className="person-card__copy">
              <h3>{cell.headings[0]}</h3>
              <BodyCopy paragraphs={cell.paragraphs} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function RevenueEngines({ card }) {
  return <InfoGrid cells={card.smartCells} icons={engineIcons} className="engine-grid" />;
}

function RevenueBars({ chart }) {
  const rows = chart.chartData.data.rows;
  const max = Math.max(...rows.map((row) => row.annual));

  return (
    <div className="bar-chart" aria-label="Standard store annual revenue streams">
      {rows.map((row) => (
        <div className="bar-chart__row" key={row.stream}>
          <div className="bar-chart__label">
            <span>{row.stream}</span>
            <strong>¥{row.annual}0K</strong>
          </div>
          <div className="bar-chart__track">
            <span style={{ width: `${(row.annual / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function UnitEconomics({ card }) {
  return (
    <div className="economics-layout">
      <div className="chart-panel">
        <h3>{card.subheadings[0]}</h3>
        <RevenueBars chart={card.charts[0]} />
      </div>
      <div className="metric-stack">
        {card.smartCells.map((cell) => (
          <article className="metric-card" key={cell.headings[0]}>
            <p className="metric-card__value">{cell.attrs.label}</p>
            <h3>{cell.headings[0]}</h3>
            <p>{cell.paragraphs[0]}</p>
          </article>
        ))}
        <p className="metric-note">{card.paragraphs.at(-1)}</p>
      </div>
    </div>
  );
}

function FinancialChart({ chart }) {
  const rows = chart.chartData.data.rows;
  const maxRevenue = Math.max(...rows.map((row) => row.revenue));

  return (
    <div className="financial-chart" aria-label="Five-year revenue and profit forecast">
      {rows.map((row) => (
        <div className="financial-chart__year" key={row.year}>
          <div className="financial-chart__columns" aria-hidden="true">
            <span
              className="financial-chart__bar financial-chart__bar--revenue"
              style={{ height: `${(row.revenue / maxRevenue) * 100}%` }}
            />
            <span
              className="financial-chart__bar financial-chart__bar--profit"
              style={{ height: `${(row.profit / maxRevenue) * 100}%` }}
            />
          </div>
          <strong>{row.year}</strong>
          <span
            className="financial-chart__values"
            aria-label={`Revenue ¥${row.revenue} million; profit ¥${row.profit} million`}
          >
            <span aria-hidden="true">R ¥{row.revenue}M</span>
            <span aria-hidden="true">P ¥{row.profit}M</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Financials({ card }) {
  return (
    <div className="funding-layout">
      <div className="chart-panel">
        <h3>{card.gridCells[0].headings[0]}</h3>
        <p>{card.gridCells[0].paragraphs[0]}</p>
        <FinancialChart chart={card.charts[0]} />
      </div>
      <aside className="funding-panel">
        <p className="eyebrow eyebrow--light">{card.gridCells[1].headings[0]}</p>
        <div className="funding-metrics">
          {card.smartCells.map((cell) => (
            <div key={cell.headings[0]}>
              <span>{cell.headings[0]}</span>
              <strong>{cell.attrs.label}</strong>
              <small>{cell.paragraphs[0]}</small>
            </div>
          ))}
        </div>
        <h3>{card.gridCells[1].headings.at(-1)}</h3>
        <ul>
          {card.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Vision({ card }) {
  const phases = card.smartCells.slice(0, 3);
  const certainties = card.smartCells.slice(3);

  return (
    <>
      <p className="section-intro section-intro--center">{card.paragraphs[0]}</p>
      <ol className="roadmap">
        {phases.map((cell, index) => (
          <li key={cell.headings[0]}>
            <span className="roadmap__index">{index + 1}</span>
            <div>
              <h3>{cell.headings[0]}</h3>
              <p>{cell.paragraphs[0]}</p>
            </div>
          </li>
        ))}
      </ol>
      <InfoGrid cells={certainties} icons={certaintyIcons} className="certainty-grid" />
      <blockquote>{card.blockquotes[0]}</blockquote>
      <p className="vision-signoff">{card.paragraphs.at(-1)}</p>
      <div className="button-row button-row--center">
        <a className="button button--primary" href={actionLinks.schedule}>
          {card.buttons[0]}
        </a>
        <a className="button button--secondary" href={actionLinks.requestBp}>
          Request Full BP
        </a>
      </div>
    </>
  );
}

export function CardBody({ card }) {
  switch (card.id) {
    case "project-overview":
      return <ProjectOverview card={card} />;
    case "strategic-positioning":
      return <PillarSection card={card} icons={pillarIcons} />;
    case "priority-matrix":
      return <PriorityMatrix card={card} />;
    case "pain-points":
      return <PillarSection card={card} icons={painIcons} />;
    case "solution-chip":
      return <ChipComparison card={card} />;
    case "solution-platform":
      return <PillarSection card={card} icons={platformIcons} />;
    case "solution-robotics":
      return <RoboticsFeature card={card} />;
    case "team":
      return <TeamGrid card={card} />;
    case "business-model":
      return <RevenueEngines card={card} />;
    case "unit-economics":
      return <UnitEconomics card={card} />;
    case "competitive-moats":
      return <InfoGrid cells={card.smartCells} icons={moatIcons} />;
    case "financials":
      return <Financials card={card} />;
    case "vision":
      return <Vision card={card} />;
    default:
      return <BodyCopy paragraphs={card.paragraphs} />;
  }
}
