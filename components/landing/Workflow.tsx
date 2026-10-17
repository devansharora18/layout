import { SectionHead } from "@/components/ui/sheet";

const STEPS = [
  {
    index: "01",
    title: "Split",
    body: "Choose a direction, then split the pane you have selected. Panes are a binary tree, so a three-column band is simply a row inside a row.",
    offset: "",
  },
  {
    index: "02",
    title: "Tune",
    body: "Drag any divider, or focus it and use the arrow keys. Ratios stay proportional and clamped, and every export follows in real time.",
    offset: "lg:mt-14",
  },
  {
    index: "03",
    title: "Export",
    body: "Take the JSX, the HTML, the JSON spec or the prompt. Paste the spec back into the canvas whenever you want to keep editing it.",
    offset: "lg:mt-28",
  },
];

export default function Workflow() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        <SectionHead
          index="/ 03"
          title="Three moves"
          note="The whole editing model. There is no inspector panel, no property list and no settings dialog to learn."
        />

        <ol className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step) => (
            <li key={step.index} className={`relative ${step.offset}`}>
              <span className="outline-type block font-display text-[4.5rem] font-extrabold leading-[0.85] tracking-[-0.05em]">
                {step.index}
              </span>
              <span aria-hidden="true" className="mt-5 block h-px w-full bg-rule" />
              <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.03em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-mute">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-14 border-t border-rule pt-5 font-mono text-[11px] leading-relaxed text-faint">
          Keyboard: Tab reaches every pane and divider. Enter selects a pane, ← / → moves a vertical
          divider, ↑ / ↓ moves a horizontal one, and Home restores 50/50.
        </p>
      </div>
    </section>
  );
}
