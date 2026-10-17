"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#workbench", label: "Try it" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#use", label: "Ways to use it" },
  { href: "#roadmap", label: "Roadmap" },
];

const REPO = "https://github.com/devansharora18/layout";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("sheet-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
  }, []);

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("sheet-theme", next);
    } catch {
      /* private mode: the toggle still works for this session */
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-sheet/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
            <rect x="0.5" y="0.5" width="19" height="19" fill="none" stroke="currentColor" />
            <line x1="8.5" y1="0.5" x2="8.5" y2="19.5" stroke="currentColor" />
            <line x1="8.5" y1="9.5" x2="19.5" y2="9.5" stroke="currentColor" />
            <rect x="1" y="1" width="7" height="18" fill="currentColor" opacity="0.16" />
          </svg>
          <span className="font-display text-[17px] font-extrabold tracking-[-0.03em]">
            Layout
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-colors duration-150 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            className="flex h-8 w-8 items-center justify-center border border-rule text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink"
          >
            {theme === "light" ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="10" cy="10" r="3.6" />
                <path d="M10 2v1.8M10 16.2V18M2 10h1.8M16.2 10H18M4.4 4.4l1.3 1.3M14.3 14.3l1.3 1.3M15.6 4.4l-1.3 1.3M5.7 14.3l-1.3 1.3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center gap-2 border border-rule px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors duration-150 hover:border-rule-2 hover:text-ink sm:inline-flex"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.88.51-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Source
          </a>

          <Link
            href="/home"
            className="inline-flex h-8 items-center border border-signal bg-signal px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-signal-ink transition-opacity duration-150 hover:opacity-85"
          >
            Open builder
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="sheet-menu"
            aria-label="Toggle section menu"
            className="flex h-8 w-8 items-center justify-center border border-rule text-mute transition-colors duration-150 hover:text-ink md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="sheet-menu"
          aria-label="Sections"
          className="sheet-in border-t border-rule bg-sheet px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-mute transition-colors duration-150 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <span
        ref={progress}
        aria-hidden="true"
        className="block h-px origin-left scale-x-0 bg-signal"
      />
    </header>
  );
}
