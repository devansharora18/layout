"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Simple toast system: Provider + hook + container rendering portal-like fixed stack.
// Keeps dependencies minimal.

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  duration?: number; // ms
  variant?: "default" | "success" | "error" | "warning";
}

interface ToastInternal extends Required<Omit<ToastOptions, "duration" | "variant">> {
  duration: number;
  variant: NonNullable<ToastOptions["variant"]>;
}

interface ToastContextValue {
  push: (opts: ToastOptions | string) => string; // returns id
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};

let idCounter = 0;
const genId = () => `t_${++idCounter}`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    const handle = timers.current[id];
    if (handle) {
      window.clearTimeout(handle);
      delete timers.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((opts: ToastOptions | string) => {
    const normalized: ToastInternal = {
      id: typeof opts === "string" ? genId() : opts.id ?? genId(),
      title: typeof opts === "string" ? opts : opts.title ?? "",
      description: typeof opts === "string" ? "" : opts.description ?? "",
      duration: typeof opts === "string" ? 2500 : opts.duration ?? 2500,
      variant: typeof opts === "string" ? "default" : opts.variant ?? "default",
    };
    setToasts((prev) => [...prev, normalized]);
    return normalized.id;
  }, []);

  // One timer per toast, claimed once and released when it fires. The previous
  // version cleared every timer on each list change, which cancelled the earlier
  // toast's dismissal and left it stranded on screen.
  useEffect(() => {
    const handles = timers.current;
    toasts.forEach((t) => {
      if (handles[t.id]) return;
      handles[t.id] = window.setTimeout(() => {
        delete handles[t.id];
        dismiss(t.id);
      }, t.duration);
    });
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      {/* Toast list overlay */}
      <div className="pointer-events-none fixed inset-0 flex flex-col items-end gap-2 px-4 py-6 z-[100]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={clsx(
              "pointer-events-auto w-full max-w-sm border border-rule-2 border-l-2 bg-board",
              t.variant === "warning" ? "border-l-rule-2" : "border-l-signal"
            )}
          >
            <div className="flex items-start gap-3 p-3">
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-ink">
                    {t.title}
                  </p>
                )}
                {t.description && (
                  <p className="mt-2 text-sm leading-snug text-mute">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center border border-rule text-faint transition-colors duration-150 hover:border-rule-2 hover:text-ink"
                aria-label="Dismiss notification"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
