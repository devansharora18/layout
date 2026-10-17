import Link from "next/link";
import Canvas from "@/components/canvas/Canvas";
import CodeOutput from "@/components/codeOutput/CodeOutput";
import Navigation from "@/components/ui/Navigation";
import { MonoLabel } from "@/components/ui/sheet";

const REPO = "https://github.com/devansharora18/layout";

const LINKS = [
  { label: "Home", href: "/", external: false },
  { label: "Source", href: REPO, external: true },
  { label: "Issues", href: `${REPO}/issues`, external: true },
  { label: "License", href: `${REPO}/blob/main/LICENSE`, external: true },
];

export default function Home() {
  return (
    <div className="bg-canvas relative min-h-screen">
      <Navigation />

      <main className="relative pt-14">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-rule pb-4">
            <MonoLabel className="translate-y-[-0.15em]">Fig. 01 — canvas</MonoLabel>
            <h1 className="font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
              Builder
            </h1>
            <p className="ml-auto hidden max-w-[42ch] text-sm leading-relaxed text-mute lg:block">
              Split a pane, drag the ratios, copy the output. Every format on this page is
              generated from the one binary tree you see above.
            </p>
          </div>

          <section className="flex w-full flex-col items-center gap-8">
            <Canvas />
            <CodeOutput />
          </section>

          <footer className="border-t border-rule pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors duration-150 hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors duration-150 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[11px] tracking-[0.08em] text-faint">
                The tree is kept in localStorage
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
