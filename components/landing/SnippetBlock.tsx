"use client";

import { useRef, useState } from "react";

type CopyState = "idle" | "copied" | "manual";

/** Clipboard with a real fallback: on a blocked or insecure context we select the
 *  text instead and tell the user to press their shortcut, rather than lying. */
async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the manual path */
  }
  return false;
}

export default function SnippetBlock({
  text,
  filename,
  className = "",
}: {
  text: string;
  filename: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<number | null>(null);

  const flash = (next: CopyState) => {
    setState(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  };

  const onCopy = async () => {
    const ok = await writeText(text);
    if (ok) {
      flash("copied");
      return;
    }
    const selection = window.getSelection();
    if (preRef.current && selection) {
      const range = document.createRange();
      range.selectNodeContents(preRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    flash("manual");
  };

  const label = state === "copied" ? "Copied" : state === "manual" ? "Press ⌘/Ctrl C" : "Copy";

  return (
    <div className={`min-w-0 border border-rule bg-well ${className}`}>
      <div className="flex items-center gap-3 border-b border-rule px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <span className="h-1.5 w-1.5 bg-rule-2" />
          <span className="h-1.5 w-1.5 bg-rule-2" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-faint">{filename}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-live="polite"
          className={`ml-auto inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ${
            state === "idle"
              ? "border-rule text-mute hover:border-rule-2 hover:text-ink"
              : "border-signal bg-signal text-signal-ink"
          }`}
        >
          {state === "copied" ? (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5.5" y="5.5" width="8" height="8" />
              <path d="M10.5 5.5v-3h-8v8h3" />
            </svg>
          )}
          {label}
        </button>
      </div>
      <pre
        ref={preRef}
        tabIndex={0}
        className="max-h-[19rem] overflow-auto p-4 font-mono text-[12px] leading-[1.7] text-mute"
      >
        <code>{text}</code>
      </pre>
    </div>
  );
}
