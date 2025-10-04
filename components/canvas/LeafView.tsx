"use client";

import { useState, useRef } from "react";
import type { LeafNode } from "@/store/layoutSlice";
import type React from "react";

export default function LeafView({
  leaf,
  selected,
  onSelect,
  onDragStart,
  onDrop,
  onRename,
  onDelete,
}: {
  leaf: LeafNode;
  selected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  onRename?: (newLabel: string) => void;
  onDelete?: () => void;
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
