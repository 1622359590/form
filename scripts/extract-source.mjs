import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourceUrl = "https://from.shmww.top/";
const outputPath = resolve("reference/source-manifest.json");

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Source request failed with HTTP ${response.status}`);
}

const html = await response.text();
const match = html.match(
  /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
);

if (!match) {
  throw new Error("The source page does not contain __NEXT_DATA__");
}

const payload = JSON.parse(match[1]);
const documentNode =
  payload.props.pageProps.page.publishedSnapshot.content.default.content[0];
const sourceCards = documentNode.content;

if (!Array.isArray(sourceCards) || sourceCards.length !== 14) {
  throw new Error(`Expected 14 source cards, received ${sourceCards?.length ?? 0}`);
}

function childrenOf(node) {
  return Array.isArray(node?.content) ? node.content : [];
}

function textOf(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") return node.text ?? "";
  return childrenOf(node).map(textOf).join("").trim();
}

function findNodes(node, type, results = []) {
  if (!node || typeof node !== "object") return results;
  if (node.type === type) results.push(node);
  for (const child of childrenOf(node)) findNodes(child, type, results);
  return results;
}

function collectImageUrls(node, results = new Set()) {
  if (!node || typeof node !== "object") return results;

  for (const [key, value] of Object.entries(node)) {
    if (key === "src" && typeof value === "string" && /^https?:\/\//.test(value)) {
      results.add(value);
    } else if (Array.isArray(value)) {
      for (const item of value) collectImageUrls(item, results);
    } else if (value && typeof value === "object") {
      collectImageUrls(value, results);
    }
  }

  return results;
}

function normalizedTextList(card, type) {
  return findNodes(card, type).map(textOf).filter(Boolean);
}

function normalizeCell(cell) {
  return {
    headings: normalizedTextList(cell, "heading"),
    paragraphs: normalizedTextList(cell, "paragraph"),
    bullets: normalizedTextList(cell, "bullet"),
    imageUrls: [...collectImageUrls(cell)],
  };
}

const cards = sourceCards.map((card, index) => ({
  sourceOrder: index + 1,
  sourceId: card.attrs?.id ?? `source-card-${index + 1}`,
  headings: normalizedTextList(card, "heading"),
  labels: normalizedTextList(card, "label"),
  paragraphs: normalizedTextList(card, "paragraph"),
  blockquotes: normalizedTextList(card, "blockquote"),
  buttons: normalizedTextList(card, "button"),
  bullets: normalizedTextList(card, "bullet"),
  tableRows: findNodes(card, "tableRow").map((row) =>
    findNodes(row, "tableCell").map(textOf).filter(Boolean),
  ),
  smartCells: findNodes(card, "smartLayoutCell").map(normalizeCell),
  gridCells: findNodes(card, "gridCell").map(normalizeCell),
  charts: findNodes(card, "graphyChart").map((chart) => chart.attrs ?? {}),
  imageUrls: [...collectImageUrls(card)],
}));

const manifest = {
  sourceUrl,
  capturedAt: new Date().toISOString(),
  sourceTitle: payload.props.pageProps.page.title,
  cards,
};

await mkdir(resolve("reference"), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(
  `Captured ${cards.length} cards, ${cards.reduce((sum, card) => sum + card.imageUrls.length, 0)} image references`,
);
