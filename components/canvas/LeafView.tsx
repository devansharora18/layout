"use client";

import { useState, useRef } from "react";
import type { LeafNode, Orientation } from "@/store/layoutSlice";
import type React from "react";

export default function LeafView({
  leaf,
  selected,
  onSelect,
  onDragStart,
  onDrop,
  onRename,
  onDelete,
  onSplit,
}: {
  leaf: LeafNode;
  selected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onRename?: (newLabel: string) => void;
  onDelete?: () => void;
  onSplit?: (orientation: Orientation) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(leaf.label);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div
      className={`w-full h-full flex flex-col border ${
        selected ? "ring-2 ring-indigo-500/70 border-white/30" : "border-white/20"
      } transition-shadow relative group`}
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
      {/* Gutters for splitting */}
      {onSplit &&
        [
          {
        key: "top",
        className: "absolute top-0 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "col" as Orientation,
        style: {},
        title: "Split horizontally (stack)",
        buttonClass: "px-3 py-1",
          },
          {
        key: "right",
        className: "absolute top-0 right-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "row" as Orientation,
        style: { writingMode: "vertical-rl" as React.CSSProperties['writingMode'] },
        title: "Split vertically (side-by-side)",
        buttonClass: "px-2 py-3 writing-mode-vertical",
          },
          {
        key: "bottom",
        className: "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "col" as Orientation,
        style: {},
        title: "Split horizontally (stack)",
        buttonClass: "px-3 py-1",
          },
          {
        key: "left",
        className: "absolute top-0 left-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "row" as Orientation,
        style: { writingMode: "vertical-rl" as React.CSSProperties['writingMode'] },
        title: "Split vertically (side-by-side)",
        buttonClass: "px-2 py-3 writing-mode-vertical",
          },
        ].map((gutter) => (
          <div
        key={gutter.key}
        className={gutter.className}
        onClick={(e) => e.stopPropagation()}
          >
        <button
          type="button"
          className={`${gutter.buttonClass} bg-gray-300/10 hover:bg-gray-500/40 text-white text-[15px] font-medium rounded-md shadow-lg backdrop-blur-sm border border-white/30 transition-all`}
          style={gutter.style}
          onClick={(e) => {
            e.stopPropagation();
            onSplit(gutter.orientation);
          }}
          title={gutter.title}
        >
          +
        </button>
          </div>
        ))}

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
        className="flex-1 flex items-center justify-center font-semibold text-white text-xs relative"
        style={{ background: `linear-gradient(135deg, ${leaf.color} 0%, ${leaf.color}CC 60%)` }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-semibold text-center outline-none border-2 border-white/50 focus:border-white"
            style={{ minWidth: '60px', maxWidth: '120px' }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="select-none cursor-pointer px-2 py-1 rounded hover:bg-white/20 transition-colors" 
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
      </div>
    </div>
  );
}
