/**
 * Drafting-sheet atoms, shared by the landing page (/) and the builder (/home).
 * Small, presentational, no state — corner registration marks, measure rails, and
 * the monospace label used for every annotation.
 */

export function CropMarks({ className = "" }: { className?: string }) {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "left-0 bottom-0 border-l border-b",
    "right-0 bottom-0 border-r border-b",
  ];

  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {corners.map((corner) => (
        <span key={corner} className={`absolute h-2.5 w-2.5 border-rule-2 ${corner}`} />
      ))}
    </span>
  );
}

export function MonoLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-faint ${className}`}
    >
      {children}
    </span>
  );
}

/** A hairline with a tick every 48px — the measure rail above each section. */
export function TickRail({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`tick-rail block h-1.5 w-full ${className}`} />;
}

export function SectionHead({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-rule pb-4">
      <MonoLabel className="translate-y-[-0.15em]">{index}</MonoLabel>
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {note ? (
        <p className="ml-auto hidden max-w-[22rem] text-sm leading-relaxed text-mute lg:block">
          {note}
        </p>
      ) : null}
    </header>
  );
}
