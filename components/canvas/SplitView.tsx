"use client";

import type React from "react";
import { isLeaf, type SplitNode, type NodeModel } from "@/store/layoutSlice";
import LeafView from "./LeafView";

export default function SplitView(props: {
  split: SplitNode;
  selectedLeafId: string | null;
  onSelectLeaf: (id: string) => void;
  onGutterMouseDown: (e: React.MouseEvent<HTMLDivElement>, split: SplitNode) => void;
  splitRefs: React.RefObject<Map<string, HTMLDivElement | null>>;
  onLeafDragStart: (leafId: string) => void;
  onLeafDrop: (leafId: string) => void;
  onResetSplit: (splitId: string) => void;
  onRenameLeaf: (leafId: string, newLabel: string) => void;
  onDeleteLeaf: (leafId: string) => void;
}) {
  const { split } = props;
  const isRow = split.orientation === "row";
  const dirClass = isRow ? "flex-row" : "flex-col";
  const gutterSize = 10; // px wider handle for easier grabbing
  const axisCursor = isRow ? "col-resize" : "row-resize";
  const half = gutterSize / 2;

  return (
    <div
      ref={(el) => {
        props.splitRefs.current.set(split.id, el);
      }}
      className={`w-full h-full flex ${dirClass}`}
    >
      {/* Child 1 */}
      <div
        className="relative flex-shrink-0"
        style={{
          flexBasis: isRow
            ? `calc(${split.sizes[0] * 100}% - ${half}px)`
            : `calc(${split.sizes[0] * 100}% - ${half}px)`,
        }}
      >
        <RenderNode {...props} node={split.children[0]} />
      </div>

      {/* Gutter */}
      <div
        className="flex-shrink-0 select-none group"
        style={{
          width: isRow ? gutterSize : "100%",
          height: isRow ? "100%" : gutterSize,
          cursor: axisCursor,
          userSelect: "none",
          touchAction: "none",
          background: isRow
            ? "linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))"
            : "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          props.onGutterMouseDown(e, split);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          // Reset to 50/50 on double click
          props.onResetSplit(split.id);
        }}
      />

      {/* Child 2 */}
      <div
        className="relative flex-shrink-0"
        style={{
          flexBasis: isRow
            ? `calc(${split.sizes[1] * 100}% - ${half}px)`
            : `calc(${split.sizes[1] * 100}% - ${half}px)`,
        }}
      >
        <RenderNode {...props} node={split.children[1]} />
      </div>
    </div>
  );
}

function RenderNode(props: {
  node: NodeModel;
  selectedLeafId: string | null;
  onSelectLeaf: (id: string) => void;
  onGutterMouseDown: (e: React.MouseEvent<HTMLDivElement>, split: SplitNode) => void;
  splitRefs: React.RefObject<Map<string, HTMLDivElement | null>>;
  onLeafDragStart: (leafId: string) => void;
  onLeafDrop: (leafId: string) => void;
  onResetSplit: (splitId: string) => void;
  onRenameLeaf: (leafId: string, newLabel: string) => void;
  onDeleteLeaf: (leafId: string) => void;
}) {
  const { node } = props;
  if (isLeaf(node)) {
    return (
      <LeafView
        leaf={node}
        selected={props.selectedLeafId === node.id}
        onSelect={() => props.onSelectLeaf(node.id)}
        onDragStart={() => props.onLeafDragStart(node.id)}
        onDrop={() => props.onLeafDrop(node.id)}
        onRename={(newLabel) => props.onRenameLeaf(node.id, newLabel)}
        onDelete={() => props.onDeleteLeaf(node.id)}
      />
    );
  }
  return <SplitView {...props} split={node} />;
}
