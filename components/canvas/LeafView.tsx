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
  onDropEdge,
  onRename,
  onDelete,
  onSplit,
}: {
  leaf: LeafNode;
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

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col border ${
        selected ? "ring-2 ring-indigo-500/70 border-white/30" : "border-white/20"
      } transition-shadow relative group cursor-grab active:cursor-grabbing`}
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
      {/* Edge snap drop zones - visual indicators */}
      {dragOverEdge === "top" && (
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-indigo-500/30 border-2 border-indigo-400 border-dashed z-40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">Split Here</span>
          </div>
        </div>
      )}
      {dragOverEdge === "bottom" && (
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-indigo-500/30 border-2 border-indigo-400 border-dashed z-40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">Split Here</span>
          </div>
        </div>
      )}
      {dragOverEdge === "left" && (
        <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-indigo-500/30 border-2 border-indigo-400 border-dashed z-40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">Split Here</span>
          </div>
        </div>
      )}
      {dragOverEdge === "right" && (
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-indigo-500/30 border-2 border-indigo-400 border-dashed z-40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">Split Here</span>
          </div>
        </div>
      )}

      {/* Gutters for splitting */}
      {onSplit &&
        [
          {
        key: "top",
        className: "absolute top-0 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "col" as Orientation,
        style: {},
        title: "Split horizontally (stack)",
        buttonClass: "px-2 py-0",
          },
          {
        key: "right",
        className: "absolute top-0 right-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "row" as Orientation,
        style: { writingMode: "vertical-rl" as React.CSSProperties['writingMode'] },
        title: "Split vertically (side-by-side)",
        buttonClass: "px-2 py-0 writing-mode-vertical",
          },
          {
        key: "bottom",
        className: "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "col" as Orientation,
        style: {},
        title: "Split horizontally (stack)",
        buttonClass: "px-2 py-0",
          },
          {
        key: "left",
        className: "absolute top-0 left-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10",
        orientation: "row" as Orientation,
        style: { writingMode: "vertical-rl" as React.CSSProperties['writingMode'] },
        title: "Split vertically (side-by-side)",
        buttonClass: "px-2 py-0 writing-mode-vertical",
          },
        ].map((gutter) => (
          <div
        key={gutter.key}
        className={gutter.className}
        onClick={(e) => e.stopPropagation()}
          >
        <button
          type="button"
          className={`gutter-button ${gutter.buttonClass} bg-gray-300/10 hover:bg-gray-500/40 text-white text-[15px] font-medium rounded-md shadow-lg backdrop-blur-sm border border-white/30 transition-all`}
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
        className="flex-1 flex items-center justify-center font-semibold text-white text-xs relative rename-area"
        style={{ background: `linear-gradient(135deg, ${leaf.color} 0%, ${leaf.color}CC 60%)` }}
      >
        {/* Delete button - appears on hover */}
        {onDelete && (
          <button
            type="button"
            className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-all text-[16px] leading-none text-white font-bold opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg z-30"
            aria-label="Delete pane"
            title="Delete pane"
            style={{ backgroundColor: leaf.color }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-semibold text-center outline-none border-2 border-white/50 focus:border-white z-20"
            style={{ minWidth: '60px', maxWidth: '120px' }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="select-none cursor-pointer px-2 py-1 rounded hover:bg-white/20 transition-colors z-20" 
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
