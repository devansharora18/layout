import Link from "next/link";
import { MonoLabel, SectionHead } from "@/components/ui/sheet";

interface Row {
  index: string;
  name: string;
  detail: string;
  tag?: string;
}

const ROWS: Row[] = [
  {
    index: "01",
    name: "Split",
    detail: "Split the selected pane horizontally or vertically. The new pane takes half and inherits its parent's place in the tree.",
  },
  {
    index: "02",
    name: "Resize",
    detail: "Drag any divider, or focus it and press an arrow key. Ratios clamp at 0.1–0.9 and the generated code updates as you move.",
  },
  {
    index: "03",
    name: "Reset a split",
    detail: "Double-click a divider — or press Home on it — to snap that pair back to 50/50.",
  },
  {
    index: "04",
    name: "Rearrange",
    detail: "Drag one pane onto another to swap their labels and colours without restructuring the tree.",
  },
  {
    index: "05",
    name: "Delete",
    detail: "Removing a pane collapses its parent split. The root pane is the layout itself, so it stays.",
  },
  {
    index: "06",
    name: "Export JSX + Tailwind",
    detail: "Flex markup with a flex-[ratio] on every child, written as a component you can drop in.",
  },
  {
    index: "07",
    name: "Export HTML + CSS",
    detail: "Generated class names with proportional flex values, for when Tailwind isn't the target.",
  },
  {
    index: "08",
    name: "JSON spec",
    detail: "The tree itself: small, ordered, and re-importable. Fits in a Slack message or an issue.",
    tag: "New",
  },
  {
    index: "09",
    name: "LLM prompt",
    detail: "The tree plus the rules for reading it, addressed to a coding agent — so it builds what you drew, not what it guessed.",
    tag: "New",
  },
  {
    index: "10",
    name: "Import a spec",
    detail: "Paste any spec back into the canvas and it rebuilds. Malformed input is rejected with the reason, never half-applied.",
    tag: "New",
  },
  {
    index: "11",
    name: "Persistence",
    detail: "The tree is kept in localStorage, so a refresh, a crash or a closed tab doesn't lose the layout.",
  },
];

export default function SpecSheet() {
  return (
    <section id="capabilities" className="scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHead
          index="/ 01"
          title="What it does"
          note="Eleven things, in the order you'd reach for them. Everything below runs in the browser."
        />

        <ul className="mt-2">
          {ROWS.map((row) => (
            <li
              key={row.index}
              className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 gap-y-1.5 border-b border-rule py-4 transition-colors duration-150 hover:bg-board/60 md:grid-cols-[3rem_14rem_1fr_5rem]"
            >
              <span className="font-mono text-[11px] tabular-nums text-faint">{row.index}</span>
              <h3 className="font-display text-lg font-bold tracking-[-0.025em] text-ink">
                {row.name}
              </h3>
              <p className="col-start-2 max-w-[62ch] text-sm leading-relaxed text-mute md:col-start-3">
                {row.detail}
              </p>
              <span className="col-start-2 md:col-start-4 md:justify-self-end">
                {row.tag ? (
                  <span className="inline-block border border-signal px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                    {row.tag}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="max-w-[54ch] text-sm leading-relaxed text-mute">
            Ratios are proportional, never pixel widths — that is the whole reason one tree holds
            up from 360px to 1440px without a media query.
          </p>
          <Link
            href="/home"
            className="inline-flex shrink-0 items-center gap-2 border border-rule px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink sm:ml-auto"
          >
            <MonoLabel className="text-inherit">Open the builder</MonoLabel>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2.5 8h11M9.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
