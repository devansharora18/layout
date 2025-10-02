"use client";

import type { LeafNode } from "@/store/layoutSlice";
import type React from "react";

export default function LeafView({
  leaf,
  selected,
  onSelect,
  onDragStart,
  onDrop,
}: {
  leaf: LeafNode;
  selected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col border ${
        selected ? "ring-2 ring-blue-500" : "border-gray-200"
      }`}
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
        className="px-2 py-1 text-xs bg-white border-b flex items-center justify-between cursor-grab select-none"
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
        <span className="text-gray-700">{leaf.label}</span>
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: leaf.color }} />
      </div>
      <div
        className="flex-1 flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: leaf.color }}
      >
        Pane
      </div>
    </div>
  );
}
