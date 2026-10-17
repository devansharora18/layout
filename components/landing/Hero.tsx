import Link from "next/link";
import LayoutWorkbench from "./LayoutWorkbench";
import { MonoLabel, TickRail } from "@/components/ui/sheet";

const REPO = "https://github.com/devansharora18/layout";

const MAPPING = [
  { from: "Split", to: "a flex container — row or column" },
  { from: "Drag", to: "flex-[0.62] on the child, clamped 0.1–0.9" },
  { from: "Export", to: "jsx · css · json · prompt, from one tree" },
];

export default function Hero() {
  return (
    <section id="workbench" className="scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-6 pt-28 sm:pt-32 lg:pt-36">
        <div className="flex items-center gap-4 border-b border-rule pb-3">
          <MonoLabel>Responsive layout builder</MonoLabel>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-rule sm:block" />
          <MonoLabel className="hidden sm:block">rev 0.1 · no account required</MonoLabel>
        </div>

        <h1 className="mt-8 sm:mt-10">
          <span className="block font-display text-[clamp(2.6rem,9vw,8rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink">
            Draw the layout.
          </span>
          <span className="outline-type mt-1 block font-display text-[clamp(2.6rem,9vw,8rem)] font-extrabold leading-[0.92] tracking-[-0.045em] md:pl-[16%] lg:pl-[26%]">
            Ship the code.
          </span>
        </h1>

        <div className="mt-12 grid gap-x-8 gap-y-10 lg:mt-14 lg:grid-cols-12">
          <div className="flex min-w-0 flex-col gap-7 lg:col-span-5">
            <p className="max-w-[46ch] text-[17px] leading-[1.65] text-mute">
              A page layout is a binary tree of flex splits, and that is exactly what you drag
              here. Layout writes the matching JSX + Tailwind or HTML + CSS, then hands you a
              JSON spec and an LLM prompt — so the structure survives the handoff instead of
              being re-described in prose.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 border border-signal bg-signal px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-signal-ink transition-opacity duration-150 hover:opacity-85"
              >
                Open the builder
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M2.5 8h11M9.5 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-rule px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink"
              >
                View source
              </a>
            </div>

            <dl className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-t border-rule pt-5">
              {MAPPING.map((row) => (
                <div key={row.from} className="col-span-2 grid grid-cols-subgrid items-baseline">
                  <dt>
                    <MonoLabel>{row.from}</MonoLabel>
                  </dt>
                  <dd className="text-sm leading-relaxed text-mute">{row.to}</dd>
                </div>
              ))}
            </dl>

            <p className="font-mono text-[11px] leading-relaxed text-faint">
              No account and no server round-trip: the tree lives in localStorage and every export
              is generated locally.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <LayoutWorkbench />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] px-6">
        <TickRail />
      </div>
    </section>
  );
}
