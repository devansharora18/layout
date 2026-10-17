"use client";

import { useState } from "react";
import type { NodeModel, Orientation } from "@/store/layoutSlice";
import { PRESETS, countPanes, fromSpec, toJsonSpec, treeDepth } from "@/lib/layoutSpec";
import {
  firstLeafId,
  isLeafId,
  removeLeaf,
  resetSplit as resetSplitIn,
  resizeSplit,
  splitLeaf,
} from "@/lib/miniTree";
import WorkbenchCanvas from "./WorkbenchCanvas";
import SpecOutput from "./SpecOutput";
import { CropMarks, MonoLabel } from "@/components/ui/sheet";

interface Session {
  presetId: string;
  root: NodeModel;
  selectedId: string;
}

function startSession(presetId: string): Session {
  const preset = PRESETS.find((entry) => entry.id === presetId) ?? PRESETS[0];
  const root = preset.build();
  return { presetId: preset.id, root, selectedId: firstLeafId(root) };
}

export default function LayoutWorkbench() {
  const [state, setState] = useState<Session>(() => startSession(PRESETS[0].id));
  const [orientation, setOrientation] = useState<Orientation>("row");
  const [mode, setMode] = useState<"build" | "import">("build");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const panes = countPanes(state.root);
  const depth = treeDepth(state.root);
  const canSplit = isLeafId(state.root, state.selectedId);

  const onSplit = () => {
    if (!canSplit) return;
    const next = splitLeaf(state.root, state.selectedId, orientation, `Div ${panes + 1}`);
    setState((s) => ({ ...s, root: next.root, selectedId: next.newLeafId }));
  };

  const onDelete = () => {
    const next = removeLeaf(state.root, state.selectedId);
    if (!next) return; // the root pane is the layout — it can't be removed
    setState((s) => ({ ...s, root: next, selectedId: firstLeafId(next) }));
  };

  const onImport = () => {
    const result = fromSpec(importText);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setState({ presetId: "custom", root: result.root, selectedId: firstLeafId(result.root) });
    setImportText("");
    setError(null);
    setMode("build");
  };

  return (
    <div className="relative border border-rule-2 bg-sheet/80 p-4 backdrop-blur-sm sm:p-5">
      <CropMarks />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <MonoLabel>Fig. 01 — live spec</MonoLabel>
        <p
          aria-live="polite"
          className="ml-auto font-mono text-[11px] tabular-nums tracking-[0.08em] text-mute"
        >
          {panes} panes · depth {depth} · {state.presetId === "custom" ? "imported" : state.presetId}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const active = preset.id === state.presetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setState(startSession(preset.id))}
              aria-pressed={active}
              title={preset.note}
              className={`border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150 ${
                active
                  ? "border-signal bg-signal text-signal-ink"
                  : "border-rule text-mute hover:border-rule-2 hover:text-ink"
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border border-rule bg-well p-1">
        <WorkbenchCanvas
          root={state.root}
          selectedId={state.selectedId}
          onSelect={(id) => setState((s) => ({ ...s, selectedId: id }))}
          onResize={(splitId, sizes) =>
            setState((s) => ({ ...s, root: resizeSplit(s.root, splitId, sizes) }))
          }
          onResetSplit={(splitId) =>
            setState((s) => ({ ...s, root: resetSplitIn(s.root, splitId) }))
          }
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex border border-rule" role="group" aria-label="Split direction">
          {(
            [
              { value: "row" as Orientation, label: "Row", hint: "Next split goes side by side" },
              { value: "col" as Orientation, label: "Column", hint: "Next split goes top and bottom" },
            ]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={orientation === option.value}
              title={option.hint}
              onClick={() => setOrientation(option.value)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150 ${
                orientation === option.value
                  ? "bg-ink text-sheet"
                  : "text-mute hover:text-ink"
              }`}
            >
              <svg
                viewBox="0 0 14 14"
                className="h-3 w-3 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <rect x="0.75" y="0.75" width="12.5" height="12.5" />
                <line
                  x1={option.value === "row" ? "7" : "0.75"}
                  y1={option.value === "row" ? "0.75" : "7"}
                  x2={option.value === "row" ? "7" : "13.25"}
                  y2={option.value === "row" ? "13.25" : "7"}
                />
              </svg>
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onSplit}
          disabled={!canSplit}
          className="border border-rule-2 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors duration-150 hover:bg-ink hover:text-sheet disabled:cursor-not-allowed disabled:border-rule disabled:text-faint disabled:hover:bg-transparent disabled:hover:text-faint"
        >
          Split pane
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={!canSplit || panes === 1}
          className="border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink disabled:cursor-not-allowed disabled:text-faint"
        >
          Delete pane
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "import" ? "build" : "import");
            setError(null);
          }}
          aria-expanded={mode === "import"}
          className="ml-auto border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink"
        >
          {mode === "import" ? "Close import" : "Import spec"}
        </button>
      </div>

      {mode === "import" ? (
        <div className="sheet-in mt-4 border border-rule bg-board p-3">
          <label
            htmlFor="spec-input"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint"
          >
            Paste a JSON layout spec
          </label>
          <textarea
            id="spec-input"
            value={importText}
            onChange={(event) => {
              setImportText(event.target.value);
              if (error) setError(null);
            }}
            rows={5}
            spellCheck={false}
            placeholder='{"direction":"row","children":[{"pane":"Sidebar","ratio":0.3},{"pane":"Main","ratio":0.7}]}'
            className="mt-2 w-full resize-y border border-rule bg-well p-2 font-mono text-[12px] leading-relaxed text-ink placeholder:text-faint focus:border-rule-2"
          />
          {error ? (
            <p role="alert" className="mt-2 font-mono text-[11px] leading-relaxed text-signal">
              {error}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onImport}
              disabled={!importText.trim()}
              className="border border-signal bg-signal px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-ink transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Load into canvas
            </button>
            <button
              type="button"
              onClick={() => setImportText(toJsonSpec(state.root))}
              className="border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink"
            >
              Fill with current
            </button>
            <span className="font-mono text-[11px] text-faint">
              Round-trips: anything the tool exports, this accepts.
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-5 border-t border-rule pt-5">
        <SpecOutput root={state.root} />
      </div>
    </div>
  );
}
