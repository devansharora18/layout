import { MonoLabel, SectionHead } from "@/components/ui/sheet";

const SHIPPED = [
  {
    name: "JSON spec export",
    detail: "The whole tree, ordered and re-importable.",
  },
  {
    name: "LLM prompt export",
    detail: "Structure, ratios and the rules for reading them.",
  },
  {
    name: "Import a spec",
    detail: "Rebuilds the canvas from pasted JSON, with validation and a reason on failure.",
  },
];

const NEXT = [
  { name: "Undo / redo", detail: "A 50-action history over the tree." },
  { name: "Breakpoint model", detail: "A different tree per size, with sm / md / lg previews." },
  { name: "Grid layouts", detail: "Column tracks alongside flex splits." },
  { name: "More targets", detail: "Vue, Svelte and plain component templates." },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-20 pb-24 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHead
          index="/ 04"
          title="Revision log"
          note="What changed in this revision, and what the tree still can't express."
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-3">
              <MonoLabel>Rev 0.1 — shipped</MonoLabel>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
            <ul className="mt-4 border-t border-rule">
              {SHIPPED.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="flex items-baseline gap-3 sm:w-56 sm:shrink-0">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-signal" />
                    <span className="font-display text-base font-bold tracking-[-0.025em] text-ink">
                      {item.name}
                    </span>
                  </span>
                  <span className="pl-[1.125rem] text-sm leading-relaxed text-mute sm:pl-0">
                    {item.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-3">
              <MonoLabel>Not built yet</MonoLabel>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </div>
            <ul className="mt-4 border border-dashed border-rule-2">
              {NEXT.map((item) => (
                <li key={item.name} className="hatch border-b border-rule px-4 py-3.5 last:border-b-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-base font-bold tracking-[-0.025em] text-mute">
                      {item.name}
                    </span>
                    <span className="ml-auto shrink-0 border border-rule-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      Soon
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-faint">{item.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[11px] leading-relaxed text-faint">
              The tree is binary and flex-only by design. Breakpoints are the next thing it has to
              express, and that changes the node model — which is why it isn&apos;t here yet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
