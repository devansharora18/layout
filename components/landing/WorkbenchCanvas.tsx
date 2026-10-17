"use client";

import { useRef } from "react";
import type { LeafNode, NodeModel, SplitNode } from "@/store/layoutSlice";
import { MAX_SIZE, MIN_SIZE } from "@/lib/layoutSpec";

/** Step used by the keyboard resizer: 2% per arrow press. */
const STEP = 0.02;

interface CanvasHandlers {
  selectedId: string;
  onSelect: (id: string) => void;
  onResize: (splitId: string, sizes: [number, number]) => void;
  onResetSplit: (splitId: string) => void;
}

export default function WorkbenchCanvas({
  root,
  ...handlers
}: { root: NodeModel } & CanvasHandlers) {
  return (
    <div className="h-[300px] w-full sm:h-[340px]">
      <NodeView node={root} ratio={1} {...handlers} />
    </div>
  );
}

function NodeView({
  node,
  ratio,
  ...handlers
}: { node: NodeModel; ratio: number } & CanvasHandlers) {
  return node.type === "leaf" ? (
    <Pane leaf={node} ratio={ratio} {...handlers} />
  ) : (
    <SplitView split={node} {...handlers} />
  );
}

function Pane({
  leaf,
  ratio,
  selectedId,
  onSelect,
}: { leaf: LeafNode; ratio: number } & CanvasHandlers) {
  const selected = selectedId === leaf.id;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${leaf.label} pane, ${Math.round(ratio * 100)} percent of its parent`}
      onClick={() => onSelect(leaf.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(leaf.id);
        }
      }}
      className={`relative block h-full w-full cursor-pointer overflow-hidden p-1.5 transition-colors duration-150 sm:p-3 ${
        selected ? "bg-signal/10" : "bg-board/50 hover:bg-board"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border transition-colors duration-150 ${
          selected ? "border-signal" : "border-rule"
        }`}
      />
      <span className="relative flex items-baseline gap-2 overflow-hidden">
        <span
          className={`truncate font-mono text-[9px] uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em] ${
            selected ? "text-signal" : "text-mute"
          }`}
        >
          {leaf.label}
        </span>
        <span className="hidden shrink-0 font-mono text-[10px] tabular-nums text-faint sm:inline">
          {Math.round(ratio * 100)}%
        </span>
      </span>
    </div>
  );
}

function SplitView({ split, ...handlers }: { split: SplitNode } & CanvasHandlers) {
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const isRow = split.orientation === "row";
  const [first, second] = split.sizes;
  const { onResize, onResetSplit } = handlers;

  const applyPointer = (clientX: number, clientY: number) => {
    const element = box.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const raw = isRow ? (clientX - rect.left) / rect.width : (clientY - rect.top) / rect.height;
    const value = Math.min(MAX_SIZE, Math.max(MIN_SIZE, raw));
    onResize(split.id, [value, 1 - value]);
  };

  const setFirst = (value: number) => {
    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, value));
    onResize(split.id, [clamped, 1 - clamped]);
  };

  return (
    <div
      ref={box}
      className="relative flex h-full w-full"
      style={{ flexDirection: isRow ? "row" : "column" }}
    >
      <div className="relative min-h-0 min-w-0 shrink-0" style={{ flex: `0 0 ${first * 100}%` }}>
        <NodeView node={split.children[0]} ratio={first} {...handlers} />
      </div>
      <div className="relative min-h-0 min-w-0 shrink-0" style={{ flex: `0 0 ${second * 100}%` }}>
        <NodeView node={split.children[1]} ratio={second} {...handlers} />
      </div>

      <div
        role="separator"
        tabIndex={0}
        aria-orientation={isRow ? "vertical" : "horizontal"}
        aria-label="Resize panes"
        aria-valuenow={Math.round(first * 100)}
        aria-valuemin={MIN_SIZE * 100}
        aria-valuemax={MAX_SIZE * 100}
        title="Drag to resize · double-click for 50/50"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragging.current) applyPointer(event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onDoubleClick={() => onResetSplit(split.id)}
        onKeyDown={(event) => {
          const back = isRow ? "ArrowLeft" : "ArrowUp";
          const forward = isRow ? "ArrowRight" : "ArrowDown";
          if (event.key === back) {
            event.preventDefault();
            setFirst(first - STEP);
          } else if (event.key === forward) {
            event.preventDefault();
            setFirst(first + STEP);
          } else if (event.key === "Home") {
            event.preventDefault();
            onResetSplit(split.id);
          }
        }}
        style={isRow ? { left: `calc(${first * 100}% - 5px)` } : { top: `calc(${first * 100}% - 5px)` }}
        className={`group absolute z-10 flex touch-none items-center justify-center ${
          isRow ? "inset-y-0 w-2.5 cursor-col-resize" : "inset-x-0 h-2.5 cursor-row-resize"
        }`}
      >
        <span
          aria-hidden="true"
          className={`bg-rule-2 transition-colors duration-150 group-hover:bg-signal group-focus-visible:bg-signal ${
            isRow ? "h-full w-px" : "h-px w-full"
          }`}
        />
      </div>
    </div>
  );
}
