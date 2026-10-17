"use client";

import { useMemo, useState } from "react";
import type { NodeModel } from "@/store/layoutSlice";
import { toDiagram, toJsonSpec, toPrompt } from "@/lib/layoutSpec";
import SnippetBlock from "./SnippetBlock";

type ViewId = "prompt" | "diagram" | "json";

const VIEWS: { id: ViewId; label: string; filename: string; note: string }[] = [
  {
    id: "prompt",
    label: "LLM prompt",
    filename: "layout-prompt.txt",
    note: "Hand the structure to a coding agent instead of describing it in prose.",
  },
  {
    id: "diagram",
    label: "Diagram",
    filename: "layout.txt",
    note: "Plain text, so it survives a PR description, an issue or a chat message.",
  },
  {
    id: "json",
    label: "JSON spec",
    filename: "layout.json",
    note: "Machine readable, and re-importable into the canvas above.",
  },
];

export default function SpecOutput({ root }: { root: NodeModel }) {
  const [view, setView] = useState<ViewId>("prompt");

  const text = useMemo(() => {
    if (view === "prompt") return toPrompt(root);
    if (view === "diagram") return toDiagram(root);
    return toJsonSpec(root);
  }, [view, root]);

  const active = VIEWS.find((entry) => entry.id === view) ?? VIEWS[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Export format"
        className="flex items-stretch overflow-x-auto border-b border-rule"
      >
        {VIEWS.map((entry) => {
          const selected = entry.id === view;
          return (
            <button
              key={entry.id}
              role="tab"
              type="button"
              id={`tab-${entry.id}`}
              aria-selected={selected}
              aria-controls={`panel-${entry.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setView(entry.id)}
              onKeyDown={(event) => {
                const index = VIEWS.findIndex((v) => v.id === view);
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const next = VIEWS[(index + (event.key === "ArrowRight" ? 1 : VIEWS.length - 1)) % VIEWS.length];
                  setView(next.id);
                  document.getElementById(`tab-${next.id}`)?.focus();
                }
              }}
              className={`relative -mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ${
                selected
                  ? "border-signal text-ink"
                  : "border-transparent text-faint hover:text-mute"
              }`}
            >
              {entry.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${view}`}
        aria-labelledby={`tab-${view}`}
        key={view}
        className="sheet-in pt-4"
      >
        <p className="mb-3 text-sm leading-relaxed text-mute">{active.note}</p>
        <SnippetBlock text={text} filename={active.filename} />
      </div>
    </div>
  );
}
