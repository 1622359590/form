import sourceManifest from "./source-manifest.json";

const cardIds = [
  "hero",
  "project-overview",
  "strategic-positioning",
  "priority-matrix",
  "pain-points",
  "solution-chip",
  "solution-platform",
  "solution-robotics",
  "team",
  "business-model",
  "unit-economics",
  "competitive-moats",
  "financials",
  "vision",
];

const cardLayouts = [
  "hero",
  "editorial",
  "pillars",
  "matrix",
  "pillars",
  "comparison",
  "pillars",
  "feature",
  "team",
  "engines",
  "economics",
  "moats",
  "financial",
  "vision",
];

const localImageBySourceName = {
  "oLY1qkU_DPf09BVfTOwEf.jpg": "/assets/source/hero-chip.avif",
  "ziehwIZpRp_A2S4EGxszf.jpg": "/assets/source/vv-bot.jpg",
  "qQqR3TGxAOAwVTGrbYbYw.jpg": "/assets/source/team-zhou-jianwu.avif",
  "r72Bp2T0be8mj2BPoYlO3.jpg": "/assets/source/team-wang-yi.avif",
  "s9qKDtlZLhboVWEJ7--Rd.jpg": "/assets/source/team-m-saito.avif",
  "uUK9I8_Jov-fR0FvOf4dl.jpg": "/assets/source/team-huang-libo.avif",
};

function localImagePath(sourceUrl) {
  const sourceName = sourceUrl.split("/").at(-1)?.split("?")[0];
  return localImageBySourceName[sourceName] ?? null;
}

function normalizeCell(cell) {
  return {
    ...cell,
    attrs: cell.attrs ?? {},
    images: cell.imageUrls.map(localImagePath).filter(Boolean),
  };
}

export const siteContent = {
  company: "联广科技",
  contact: "Huang Libo, Director",
  date: "June 2026",
  sourceTitle: sourceManifest.sourceTitle,
  cards: sourceManifest.cards.map((card, index) => ({
    id: cardIds[index],
    layout: cardLayouts[index],
    sourceOrder: card.sourceOrder,
    sourceTitle: card.labels[0] ?? card.headings[0],
    label: card.labels[0] ?? null,
    heading: card.headings[0],
    subheadings: card.headings.slice(1),
    paragraphs: card.paragraphs,
    blockquotes: card.blockquotes,
    buttons: card.buttons,
    bullets: card.bullets,
    tableRows: card.tableRows,
    smartCells: card.smartCells.map(normalizeCell),
    gridCells: card.gridCells.map(normalizeCell),
    charts: card.charts,
    images: card.imageUrls.map(localImagePath).filter(Boolean),
  })),
};

export const navItems = [
  { id: "project-overview", label: "Overview" },
  { id: "solution-chip", label: "Solutions" },
  { id: "team", label: "Team" },
  { id: "financials", label: "Financials" },
  { id: "vision", label: "Vision" },
];
