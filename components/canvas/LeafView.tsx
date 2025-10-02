"use client";

import type { LeafNode } from "@/store/layoutSlice";
import type React from "react";

export default function LeafView({
  leaf,
  selected,
  onSelect,
  onDragStart,
  onDrop,
  onDelete,
}: {
  leaf: LeafNode;
  selected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col border ${
        selected ? "ring-2 ring-indigo-500/70 border-white/30" : "border-white/20"
      } transition-shadow`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div
        className="px-2 py-1 text-[11px] bg-white/15 backdrop-blur-md border-b border-white/20 flex items-center justify-between cursor-grab select-none text-white"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", leaf.id);
          onDragStart();
        }}
        onClick={(e) => {
          // prevent header click from toggling twice
          e.stopPropagation();
          onSelect();
        }}
      >
  <span className="font-medium tracking-wide text-[11px]">{leaf.label}</span>
        <button
          type="button"
          className="inline-flex items-center justify-center w-4 h-4 rounded-full cursor-pointer transition-transform text-[13px] leading-none text-white font-bold"
          aria-label="Delete pane"
          title="Delete pane"
          style={{ backgroundColor: leaf.color }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          ×
        </button>
      </div>
      <div
        className="flex-1 flex items-center justify-center font-semibold text-white text-xs"
        style={{ background: `linear-gradient(135deg, ${leaf.color} 0%, ${leaf.color}CC 60%)` }}
      >
        Pane
      </div>
    </div>
  );
}
