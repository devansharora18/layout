import type { LeafNode, NodeModel, Orientation, SplitNode } from "@/store/layoutSlice";

/**
 * The landing page runs its own small layout tree so it can be a live demo without
 * touching the builder's Redux store. These helpers work on the builder's own node
 * model, so the code the landing page shows is the code the tool actually emits.
 */

export const MIN_SIZE = 0.1;
export const MAX_SIZE = 0.9;

const MAX_DEPTH = 12;

/* ------------------------------------------------------------------ reading */

export function countPanes(node: NodeModel): number {
  return node.type === "leaf" ? 1 : countPanes(node.children[0]) + countPanes(node.children[1]);
}

export function treeDepth(node: NodeModel): number {
  return node.type === "leaf"
    ? 1
    : 1 + Math.max(treeDepth(node.children[0]), treeDepth(node.children[1]));
}

function round(n: number, places = 3) {
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
}

function pct(n: number) {
  const value = round(n * 100, 1);
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

/* ---------------------------------------------------------------- diagram */

export function toDiagram(root: NodeModel): string {
  const rows: { lead: string; name: string; ratio: number }[] = [];

  function visit(node: NodeModel, lead: string, isLast: boolean, isRoot: boolean, ratio: number) {
    const branch = isRoot ? "" : isLast ? "└─ " : "├─ ";
    const name =
      node.type === "leaf" ? `leaf "${node.label}"` : node.orientation === "row" ? "row" : "col";

    rows.push({ lead: lead + branch, name, ratio });

    if (node.type === "split") {
      const nextLead = isRoot ? "" : lead + (isLast ? "   " : "│  ");
      visit(node.children[0], nextLead, false, false, node.sizes[0]);
      visit(node.children[1], nextLead, true, false, node.sizes[1]);
    }
  }

  visit(root, "", true, true, 1);

  const width = rows.reduce((max, row) => Math.max(max, row.lead.length + row.name.length), 0);
  return rows
    .map((row) => `${`${row.lead}${row.name}`.padEnd(width)}  ${pct(row.ratio)}`)
    .join("\n");
}

/* ------------------------------------------------------------- json spec */

export type SpecNode =
  | { pane: string; ratio?: number }
  | { direction: Orientation; ratio?: number; children: [SpecNode, SpecNode] };

export function toSpec(node: NodeModel, ratio?: number): SpecNode {
  const share = ratio === undefined ? {} : { ratio: round(ratio) };

  if (node.type === "leaf") return { pane: node.label, ...share };

  return {
    direction: node.orientation,
    ...share,
    children: [
      toSpec(node.children[0], node.sizes[0]),
      toSpec(node.children[1], node.sizes[1]),
    ] as [SpecNode, SpecNode],
  };
}

export function toJsonSpec(root: NodeModel): string {
  return JSON.stringify(toSpec(root), null, 2);
}

/* ----------------------------------------------------------- ratio audit */

export function toRatioTable(root: NodeModel): string {
  const rows: { pane: string; ratio: number; depth: number; path: string }[] = [];

  function visit(node: NodeModel, ratio: number, depth: number, path: string) {
    if (node.type === "leaf") {
      rows.push({ pane: node.label, ratio, depth, path: path || "root" });
      return;
    }
    const next = path ? `${path} › ${node.orientation}` : node.orientation;
    visit(node.children[0], node.sizes[0], depth + 1, next);
    visit(node.children[1], node.sizes[1], depth + 1, next);
  }

  visit(root, 1, 0, "");

  const header = ["PANE", "RATIO", "DEPTH", "PATH", "STATE"];
  const body = rows.map((row) => [
    row.pane,
    round(row.ratio).toFixed(3),
    String(row.depth),
    row.path,
    row.ratio <= MIN_SIZE + 1e-9 || row.ratio >= MAX_SIZE - 1e-9 ? "at limit" : "ok",
  ]);

  const widths = header.map((cell, i) =>
    Math.max(cell.length, ...body.map((row) => row[i].length))
  );
  const line = (cells: string[]) =>
    cells.map((cell, i) => cell.padEnd(widths[i])).join("  ").trimEnd();

  return [
    line(header),
    widths.map((w) => "─".repeat(w)).join("  "),
    ...body.map(line),
  ].join("\n");
}

/* --------------------------------------------------------------- prompt */

export function toPrompt(root: NodeModel): string {
  const panes = countPanes(root);
  const depth = treeDepth(root);

  return [
    "Implement this page layout as a single self-contained React component.",
    "",
    "STRUCTURE",
    "```",
    toDiagram(root),
    "```",
    "",
    "SPEC (the same tree, machine readable)",
    "```json",
    toJsonSpec(root),
    "```",
    "",
    "HOW TO READ IT",
    "- A split is a flex container: `row` → flex-direction row, `col` → column.",
    "- `ratio` is a child's share of its parent, always between 0.1 and 0.9. It is proportional,",
    "  never a pixel width, so the layout scales with the viewport.",
    `- ${panes} leaf panes at ${depth} levels. Every leaf must appear in the output.`,
    "",
    "RULES",
    "1. Keep the nesting order and every ratio exactly as given.",
    "2. Root container: `flex h-dvh w-full overflow-hidden`. Add `min-w-0 min-h-0` to any child",
    "   that must be allowed to shrink.",
    "3. Translate each ratio to Tailwind `flex-[<ratio>]` — 0.25 becomes `flex-[0.25]`. Do not",
    "   round ratios into a 12-column grid.",
    "4. Label every pane with a `/* comment */` and a 1px border so the split is visible.",
    "5. No absolute positioning, no fixed heights, no media queries — the ratios already describe",
    "   the responsive behaviour.",
    "",
    "OUTPUT: one .tsx file exporting `PageLayout`.",
  ].join("\n");
}

export function toSchemaDoc(): string {
  return [
    "The Layout spec is a small JSON tree. A node is one of two shapes:",
    "",
    '  { "pane": "Sidebar", "ratio": 0.25 }              // a leaf: one named region',
    '  { "direction": "row", "ratio": 0.75, "children": [a, b] }',
    "",
    "`ratio` is the node's share of its parent, between 0.1 and 0.9, omitted on the root.",
    "A split always has exactly two children, so a three-column band is a row whose second",
    "child is another row. Each pair of ratios sums to 1.",
    "",
    "Example:",
    toJsonSpec(PRESETS[0].build()),
  ].join("\n");
}

/* ----------------------------------------------------------------- presets */

let seq = 0;

function leaf(label: string): LeafNode {
  seq += 1;
  return { id: `wl-${seq}`, type: "leaf", label, color: "#85847e" };
}

function split(
  orientation: Orientation,
  sizes: [number, number],
  children: [NodeModel, NodeModel]
): SplitNode {
  seq += 1;
  return { id: `ws-${seq}`, type: "split", orientation, sizes, children };
}

export interface Preset {
  id: string;
  name: string;
  note: string;
  build: () => NodeModel;
}

export const PRESETS: Preset[] = [
  {
    id: "holy-grail",
    name: "Holy grail",
    note: "sidebar · header · main",
    build: () =>
      split("row", [0.22, 0.78], [
        leaf("Sidebar"),
        split("col", [0.14, 0.86], [leaf("Header"), leaf("Main")]),
      ]),
  },
  {
    id: "dashboard",
    name: "Dashboard",
    note: "topbar · content · rail",
    build: () =>
      split("col", [0.12, 0.88], [
        leaf("Topbar"),
        split("row", [0.68, 0.32], [leaf("Content"), leaf("Rail")]),
      ]),
  },
  {
    id: "magazine",
    name: "Magazine",
    note: "hero · three columns",
    build: () =>
      split("col", [0.55, 0.45], [
        leaf("Hero"),
        split("row", [0.34, 0.66], [
          leaf("Col A"),
          split("row", [0.5, 0.5], [leaf("Col B"), leaf("Col C")]),
        ]),
      ]),
  },
  {
    id: "split-view",
    name: "Split view",
    note: "editor · preview",
    build: () => split("row", [0.5, 0.5], [leaf("Editor"), leaf("Preview")]),
  },
];

/* ---------------------------------------------------------------- parsing */

export type ParseResult = { ok: true; root: NodeModel } | { ok: false; error: string };

const clampRatio = (n: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));

export function fromSpec(input: string, preset: Preset = PRESETS[0]): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch {
    return {
      ok: false,
      error: "That isn't valid JSON — look for a trailing comma or an unclosed brace.",
    };
  }

  const built = buildNode(data, true, 0, preset);
  return typeof built === "string" ? { ok: false, error: built } : { ok: true, root: built };
}

function buildNode(value: unknown, isRoot: boolean, depth: number, preset: Preset): NodeModel | string {
  if (depth > MAX_DEPTH) return `Layouts nested deeper than ${MAX_DEPTH} levels aren't supported.`;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Every node must be an object with either a `pane` or a `direction`.";
  }

  const node = value as Record<string, unknown>;
  const ratio = node.ratio;

  if (ratio !== undefined && (typeof ratio !== "number" || !Number.isFinite(ratio) || ratio <= 0 || ratio > 1)) {
    return "`ratio` must be a number above 0 and at most 1.";
  }
  if (!isRoot && typeof ratio !== "number") {
    return "Every child needs a `ratio` — only the root may omit it.";
  }

  if (typeof node.pane === "string" && node.pane.trim()) {
    return { ...leaf(node.pane.trim().slice(0, 24)), id: `${preset.id}-${seq}` };
  }

  if (node.direction === "row" || node.direction === "col") {
    const children = node.children;
    if (!Array.isArray(children) || children.length !== 2) {
      return "A split needs exactly two children.";
    }

    const left = buildNode(children[0], false, depth + 1, preset);
    if (typeof left === "string") return left;
    const right = buildNode(children[1], false, depth + 1, preset);
    if (typeof right === "string") return right;

    const a = clampRatio((children[0] as { ratio: number }).ratio);
    const b = clampRatio((children[1] as { ratio: number }).ratio);
    const total = a + b;

    return split(node.direction, [round(a / total), round(b / total)], [left, right]);
  }

  return "Each node needs a `pane` label or a `direction` of `row` / `col`.";
}
