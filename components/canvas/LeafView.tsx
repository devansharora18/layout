"use client";

import { useState, useRef } from "react";
import type { LeafNode, Orientation } from "@/store/layoutSlice";
import type React from "react";

export default function LeafView({
  leaf,
  ratio,
  selected,
  onSelect,
  onDragStart,
  onDrop,
  onDropEdge,
  onRename,
  onDelete,
  onSplit,
}: {
  leaf: LeafNode;
  /** This pane's share of its parent, shown as a measurement readout. */
  ratio: number;
  selected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDropEdge?: (edge: "top" | "right" | "bottom" | "left") => void;
  onRename?: (newLabel: string) => void;
  onDelete?: () => void;
  onSplit?: (orientation: Orientation) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(leaf.label);
  const [dragOverEdge, setDragOverEdge] = useState<"top" | "right" | "bottom" | "left" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(leaf.label);
    // Focus input after render
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== leaf.label && onRename) {
      onRename(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(leaf.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const edgeThreshold = 60; // pixels from edge
    
    // Determine which edge is closest
    const distanceTop = y;
    const distanceBottom = rect.height - y;
    const distanceLeft = x;
    const distanceRight = rect.width - x;
    
    const minDistance = Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight);
    
    if (minDistance < edgeThreshold) {
      if (minDistance === distanceTop) {
        setDragOverEdge("top");
      } else if (minDistance === distanceBottom) {
        setDragOverEdge("bottom");
      } else if (minDistance === distanceLeft) {
        setDragOverEdge("left");
      } else {
        setDragOverEdge("right");
      }
    } else {
      setDragOverEdge(null);
    }
  };

  const handleDragLeave = () => {
    setDragOverEdge(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (dragOverEdge && onDropEdge) {
      // Move the dragged pane to this edge
      onDropEdge(dragOverEdge);
    } else {
      // Default drop behavior (swap)
      onDrop();
    }
    
    setDragOverEdge(null);
  };

  /* Edge snap zones: which third of the pane, and which way it would split. */
  const snapZones: {
    edge: "top" | "right" | "bottom" | "left";
    box: string;
  }[] = [
    { edge: "top", box: "absolute top-0 left-0 right-0 h-1/3" },
    { edge: "bottom", box: "absolute bottom-0 left-0 right-0 h-1/3" },
    { edge: "left", box: "absolute top-0 left-0 bottom-0 w-1/3" },
    { edge: "right", box: "absolute top-0 right-0 bottom-0 w-1/3" },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative flex h-full w-full flex-col border transition-colors duration-150 group cursor-grab active:cursor-grabbing ${
        selected ? "border-signal bg-signal/10" : "border-rule bg-board/45 hover:bg-board"
      }`}
      draggable
      onDragStart={(e) => {
        // Check if drag started from a gutter or rename area
        const target = e.target as HTMLElement;
        if (target.closest('.gutter-button') || target.closest('.rename-area')) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", leaf.id);
        onDragStart();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Edge snap drop zones — where in the pane the dragged region would land */}
      {snapZones.map((zone) =>
        dragOverEdge === zone.edge ? (
          <div
            key={zone.edge}
            className={`${zone.box} z-40 border-2 border-dashed border-signal bg-signal/10 pointer-events-none`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="border border-signal bg-signal px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-signal-ink">
                Split here
              </span>
            </div>
          </div>
        ) : null
      )}

      {/* Gutters for splitting */}
      {onSplit &&
        [
          { key: "top", className: "absolute top-0 left-0 right-0 h-8", orientation: "col" as Orientation, title: "Split horizontally (stack)" },
          { key: "right", className: "absolute top-0 right-0 bottom-0 w-8", orientation: "row" as Orientation, title: "Split vertically (side-by-side)" },
          { key: "bottom", className: "absolute bottom-0 left-0 right-0 h-8", orientation: "col" as Orientation, title: "Split horizontally (stack)" },
          { key: "left", className: "absolute top-0 left-0 bottom-0 w-8", orientation: "row" as Orientation, title: "Split vertically (side-by-side)" },
        ].map((gutter) => (
          <div
            key={gutter.key}
            className={`${gutter.className} z-10 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gutter-button inline-flex h-5 w-5 items-center justify-center border border-rule bg-sheet/90 text-mute transition-colors duration-150 hover:border-signal hover:text-signal"
              onClick={(e) => {
                e.stopPropagation();
                onSplit(gutter.orientation);
              }}
              title={gutter.title}
              aria-label={gutter.title}
            >
              <svg
                viewBox="0 0 12 12"
                className="h-2.5 w-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 1.5v9M1.5 6h9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}

      <div className="rename-area relative flex flex-1 items-start justify-start overflow-hidden p-1.5 sm:p-3">
        {/* Delete button — appears on hover, kept clear of the label and the gutters */}
        {onDelete && (
          <button
            type="button"
            className="absolute bottom-1.5 right-1.5 z-30 inline-flex h-5 w-5 items-center justify-center border border-rule bg-sheet/90 text-faint opacity-0 transition-all duration-150 hover:border-signal hover:text-signal group-hover:opacity-100"
            aria-label="Delete pane"
            title="Delete pane"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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
        )}

        <span className="relative flex w-full min-w-0 items-baseline gap-1.5 overflow-hidden">
          {/* The pane's identity colour, kept as a legend key rather than a slab fill */}
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 translate-y-px border border-rule-2"
            style={{ backgroundColor: leaf.color }}
          />

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="z-20 min-w-[60px] max-w-[140px] border border-signal bg-well px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`min-w-0 cursor-pointer truncate font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150 ${
                selected ? "text-signal" : "text-mute"
              }`}
              title="Click to rename"
              onClick={(e) => {
                e.stopPropagation();
                if (onRename) {
                  handleStartEdit();
                }
              }}
            >
              {leaf.label}
            </span>
          )}

          <span className="shrink-0 font-mono text-[10px] tabular-nums text-faint">
            {Math.round(ratio * 100)}%
          </span>
        </span>
      </div>
    </div>
  );
}
