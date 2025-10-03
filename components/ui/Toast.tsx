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

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto dismiss logic
  const timers = useRef<Record<string, number>>({});
  useEffect(() => {
    toasts.forEach((t) => {
      if (!timers.current[t.id]) {
        const handle = window.setTimeout(() => dismiss(t.id), t.duration);
        timers.current[t.id] = handle;
      }
    });
    return () => {
      Object.values(timers.current).forEach(window.clearTimeout);
    };
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      {/* Toast list overlay */}
      <div className="pointer-events-none fixed inset-0 flex flex-col items-end gap-2 px-4 py-6 z-[100]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm transition-all",
              "bg-neutral-900/80 border-white/15 text-white",
              t.variant === "success" && "border-emerald-400/40 bg-emerald-500/15",
              t.variant === "error" && "border-rose-400/40 bg-rose-500/15",
              t.variant === "warning" && "border-amber-400/40 bg-amber-500/15"
            )}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex-1 min-w-0">
                {t.title && <p className="font-medium leading-tight text-sm">{t.title}</p>}
                {t.description && <p className="mt-1 text-xs text-white/70 leading-snug">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={clsx(
              "h-0.5 w-full bg-white/10",
              t.variant === "success" && "bg-emerald-400/30",
              t.variant === "error" && "bg-rose-400/30",
              t.variant === "warning" && "bg-amber-400/30"
            )} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
