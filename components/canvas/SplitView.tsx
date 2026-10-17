"use client";

import type React from "react";
import { isLeaf, type SplitNode, type NodeModel, type Orientation } from "@/store/layoutSlice";
import { MAX_SIZE, MIN_SIZE } from "@/lib/layoutSpec";
import LeafView from "./LeafView";

/** Arrow-key step for the focused divider, matching the landing page's 2%. */
const NUDGE = 0.02;

export default function SplitView(props: {
  split: SplitNode;
  selectedLeafId: string | null;
  onSelectLeaf: (id: string) => void;
  onGutterMouseDown: (e: React.MouseEvent<HTMLDivElement>, split: SplitNode) => void;
  onResizeSplit: (splitId: string, sizes: [number, number]) => void;
  splitRefs: React.RefObject<Map<string, HTMLDivElement | null>>;
  onLeafDragStart: (leafId: string) => void;
  onLeafDrop: (leafId: string) => void;
  onLeafDropEdge: (leafId: string, edge: "top" | "right" | "bottom" | "left") => void;
  onResetSplit: (splitId: string) => void;
  onRenameLeaf: (leafId: string, newLabel: string) => void;
  onDeleteLeaf: (leafId: string) => void;
  onSplitLeaf: (leafId: string, orientation: Orientation) => void;
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
        <RenderNode {...props} node={split.children[0]} ratio={split.sizes[0]} />
      </div>

      {/* Gutter — a 10px hit area carrying a single hairline, same as the landing page.
          Focusable and arrow-key resizable, so the layout is reachable without a mouse. */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={isRow ? "vertical" : "horizontal"}
        aria-label="Resize panes"
        aria-valuenow={Math.round(split.sizes[0] * 100)}
        aria-valuemin={Math.round(MIN_SIZE * 100)}
        aria-valuemax={Math.round(MAX_SIZE * 100)}
        title="Drag to resize · double-click for 50/50"
        className="group relative flex flex-shrink-0 select-none items-center justify-center"
        style={{
          width: isRow ? gutterSize : "100%",
          height: isRow ? "100%" : gutterSize,
          cursor: axisCursor,
          userSelect: "none",
          touchAction: "none",
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
        onKeyDown={(e) => {
          const back = isRow ? "ArrowLeft" : "ArrowUp";
          const forward = isRow ? "ArrowRight" : "ArrowDown";
          const current = split.sizes[0];
          if (e.key === back || e.key === forward) {
            e.preventDefault();
            const next = Math.min(
              MAX_SIZE,
              Math.max(MIN_SIZE, current + (e.key === forward ? NUDGE : -NUDGE))
            );
            props.onResizeSplit(split.id, [next, 1 - next]);
          } else if (e.key === "Home") {
            e.preventDefault();
            props.onResetSplit(split.id);
          }
        }}
      >
        <span
          aria-hidden="true"
          className={`bg-rule-2 transition-colors duration-150 group-hover:bg-signal group-focus-visible:bg-signal ${
            isRow ? "h-full w-px" : "h-px w-full"
          }`}
        />
      </div>

      {/* Child 2 */}
      <div
        className="relative flex-shrink-0"
        style={{
          flexBasis: isRow
            ? `calc(${split.sizes[1] * 100}% - ${half}px)`
            : `calc(${split.sizes[1] * 100}% - ${half}px)`,
        }}
      >
        <RenderNode {...props} node={split.children[1]} ratio={split.sizes[1]} />
      </div>
    </div>
  );
}

function RenderNode({
  node,
  ratio,
  ...rest
}: {
  node: NodeModel;
  ratio: number;
  selectedLeafId: string | null;
  onSelectLeaf: (id: string) => void;
  onGutterMouseDown: (e: React.MouseEvent<HTMLDivElement>, split: SplitNode) => void;
  onResizeSplit: (splitId: string, sizes: [number, number]) => void;
  splitRefs: React.RefObject<Map<string, HTMLDivElement | null>>;
  onLeafDragStart: (leafId: string) => void;
  onLeafDrop: (leafId: string) => void;
  onLeafDropEdge: (leafId: string, edge: "top" | "right" | "bottom" | "left") => void;
  onResetSplit: (splitId: string) => void;
  onRenameLeaf: (leafId: string, newLabel: string) => void;
  onDeleteLeaf: (leafId: string) => void;
  onSplitLeaf: (leafId: string, orientation: Orientation) => void;
}) {
  if (isLeaf(node)) {
    return (
      <LeafView
        leaf={node}
        ratio={ratio}
        selected={rest.selectedLeafId === node.id}
        onSelect={() => rest.onSelectLeaf(node.id)}
        onDragStart={() => rest.onLeafDragStart(node.id)}
        onDrop={() => rest.onLeafDrop(node.id)}
        onDropEdge={(edge) => rest.onLeafDropEdge(node.id, edge)}
        onRename={(newLabel) => rest.onRenameLeaf(node.id, newLabel)}
        onDelete={() => rest.onDeleteLeaf(node.id)}
        onSplit={(orientation) => rest.onSplitLeaf(node.id, orientation)}
      />
    );
  }
  return <SplitView {...rest} split={node} />;
}
