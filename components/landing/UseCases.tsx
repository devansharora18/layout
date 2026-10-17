"use client";

import { useMemo, useState } from "react";
import { PRESETS, toDiagram, toJsonSpec, toPrompt, toRatioTable, toSchemaDoc } from "@/lib/layoutSpec";
import SnippetBlock from "./SnippetBlock";
import { SectionHead } from "@/components/ui/sheet";

interface UseCase {
  id: string;
  short: string;
  title: string;
  where: string;
  why: string;
  filename: string;
  text: string;
}

export default function UseCases() {
  const [activeId, setActiveId] = useState("agent");

  /* Every snippet is produced by the same serializers the builder ships, so the
     marketing copy can't drift away from the actual output. */
  const cases = useMemo<UseCase[]>(
    () => [
      {
        id: "agent",
        short: "Coding agent",
        title: "Hand the tree to a coding agent",
        where: "Cursor · Claude Code · Copilot Chat",
        why: "The prompt carries the split order, the ratios and the rules the agent would otherwise invent. Ask for the component and you get the layout you drew.",
        filename: "layout-prompt.txt",
        text: toPrompt(PRESETS[0].build()),
      },
      {
        id: "pr",
        short: "Pull request",
        title: "Describe a layout change in a PR",
        where: "PR description · issue comment",
        why: "A diagram is quicker to read than a screenshot and it diffs line by line. Reviewers see the structural change without checking out the branch.",
        filename: "pull-request.md",
        text: ["```", toDiagram(PRESETS[1].build()), "```"].join("\n"),
      },
      {
        id: "designer",
        short: "Designer handoff",
        title: "Spec a layout for a designer",
        where: "Handoff doc · Notion · Figma cover",
        why: "Named regions with their proportions, so the conversation is about labels and ratios instead of “the box on the left”.",
        filename: "handoff.json",
        text: toJsonSpec(PRESETS[2].build()),
      },
      {
        id: "review",
        short: "Flex audit",
        title: "Audit the flex maths in review",
        where: "Code review · QA checklist",
        why: "Every pane with its ratio, its depth and the axis path that reaches it — including which ratios are pinned at the 0.1 / 0.9 clamp.",
        filename: "ratio-audit.txt",
        text: toRatioTable(PRESETS[1].build()),
      },
      {
        id: "roundtrip",
        short: "Round-trip",
        title: "Make the agent emit the spec back",
        where: "Any LLM · then Import spec",
        why: "Give a model the schema and it hands back a spec the canvas can load directly: a wireframe from a prompt, in a format the tool already reads.",
        filename: "spec-format.txt",
        text: toSchemaDoc(),
      },
    ],
    []
  );

  const active = cases.find((entry) => entry.id === activeId) ?? cases[0];

  return (
    <section id="use" className="scroll-mt-20 border-y border-rule bg-board/70 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHead
          index="/ 02"
          title="Five ways out of the canvas"
          note="One tree, five audiences. Pick the format that matches who reads it next."
        />

        <div className="mt-8 grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <div
            role="tablist"
            aria-label="Ways to use a layout"
            className="-mx-6 flex min-w-0 gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:col-span-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {cases.map((entry, index) => {
              const selected = entry.id === active.id;
              return (
                <button
                  key={entry.id}
                  role="tab"
                  type="button"
                  id={`use-tab-${entry.id}`}
                  aria-selected={selected}
                  aria-controls="use-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(entry.id)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                    event.preventDefault();
                    const step = event.key === "ArrowRight" ? 1 : cases.length - 1;
                    const next = cases[(index + step) % cases.length];
                    setActiveId(next.id);
                    document.getElementById(`use-tab-${next.id}`)?.focus();
                  }}
                  className={`flex shrink-0 items-baseline gap-3 whitespace-nowrap border-l-2 py-2.5 pl-3 pr-4 text-left transition-colors duration-150 lg:w-full lg:shrink lg:whitespace-normal lg:py-3.5 ${
                    selected
                      ? "border-signal bg-signal/5"
                      : "border-rule hover:border-rule-2 hover:bg-board"
                  }`}
                >
                  <span className="font-mono text-[11px] tabular-nums text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span
                      className={`font-display text-base font-bold tracking-[-0.025em] lg:hidden ${
                        selected ? "text-ink" : "text-mute"
                      }`}
                    >
                      {entry.short}
                    </span>
                    <span
                      className={`hidden font-display text-[17px] font-bold tracking-[-0.025em] lg:block ${
                        selected ? "text-ink" : "text-mute"
                      }`}
                    >
                      {entry.title}
                    </span>
                    <span className="hidden font-mono text-[11px] text-faint lg:block">
                      {entry.where}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="use-panel"
            role="tabpanel"
            aria-labelledby={`use-tab-${active.id}`}
            key={active.id}
            className="sheet-in min-w-0 lg:col-span-7"
          >
            <p className="max-w-[62ch] text-sm leading-relaxed text-mute lg:text-[15px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal lg:hidden">
                {active.where} ·{" "}
              </span>
              {active.why}
            </p>
            <SnippetBlock text={active.text} filename={active.filename} className="mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
