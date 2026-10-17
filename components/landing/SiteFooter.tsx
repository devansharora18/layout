import Link from "next/link";
import { MonoLabel } from "@/components/ui/sheet";

const REPO = "https://github.com/devansharora18/layout";

const BLOCKS = [
  { label: "Project", value: "Layout — a visual builder for flex page layouts." },
  { label: "Revision", value: "0.1 · runs entirely in your browser" },
  { label: "Drawn by", value: "Devansh Arora", href: "https://devansharora.in" },
  { label: "Exports", value: "jsx · css · json · prompt" },
];

const LINKS = [
  { label: "Builder", href: "/home", external: false },
  { label: "Source", href: REPO, external: true },
  { label: "Issues", href: `${REPO}/issues`, external: true },
  { label: "License", href: `${REPO}/blob/main/LICENSE`, external: true },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-rule">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {BLOCKS.map((block) => (
            <div key={block.label} className="flex flex-col gap-2 bg-sheet p-5">
              <MonoLabel>{block.label}</MonoLabel>
              {block.href ? (
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-base font-bold tracking-[-0.025em] text-ink underline decoration-rule-2 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
                >
                  {block.value}
                </a>
              ) : (
                <p className="max-w-[34ch] text-sm leading-relaxed text-mute">{block.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            MIT · built with Next.js and a binary tree
          </p>
        </div>
      </div>
    </footer>
  );
}
