"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type NodeModel,
  type SplitNode,
  type Orientation,
  type ViewportMode,
  isSplit,
  isLeaf,
  selectLeaf as selectLeafAction,
  reset as resetAction,
  splitLeafInDirection as splitLeafInDirectionAction,
  setSplitSizes as setSplitSizesAction,
  resetSplit as resetSplitAction,
  rearrangeLeaves as rearrangeLeavesAction,
  renameLeaf as renameLeafAction,
  removeLeaf as removeLeafAction,
  moveLeafToSplit as moveLeafToSplitAction,
  setViewportMode as setViewportModeAction,
} from "@/store/layoutSlice";
import type { RootState } from "@/store";
import SplitView from "./SplitView";
import LeafView from "./LeafView";
import Button from "@/components/ui/Button";

type DragState =
  | {
      kind: "resize";
      splitId: string;
      axis: "x" | "y";
      containerSize: number; // width or height depending on axis
      startPos: number; // clientX or clientY
      startSizes: [number, number];
      gutter: number;
    }
  | {
      kind: "rearrange";
      sourceLeafId: string;
    };

export default function Canvas() {
  const dispatch = useDispatch();
  const root = useSelector((s: RootState) => s.layout.root);
  const selectedLeafId = useSelector((s: RootState) => s.layout.selectedLeafId);
  const viewportMode = useSelector((s: RootState) => s.layout.viewportMode);

  // drag state (resize or rearrange)
  const [drag, setDrag] = useState<DragState | null>(null);

  // Refs to find sizes during resize
  const splitRefs = useRef(new Map<string, HTMLDivElement | null>());

  // Tree lookup helper (local pure function)
  const findNode = useCallback((n: NodeModel, id: string): NodeModel | null => {
    if (n.id === id) return n;
    if (isSplit(n)) return findNode(n.children[0], id) ?? findNode(n.children[1], id);
    return null;
  }, []);

  // Split a leaf in a specific direction
  const handleSplit = useCallback((leafId: string, orientation: Orientation) => {
    dispatch(splitLeafInDirectionAction({ leafId, orientation }));
  }, [dispatch]);

  // Reset layout
  const reset = useCallback(() => {
    dispatch(resetAction());
    setDrag(null);
  }, [dispatch]);

  // Handle resizing via gutters
  const onGutterMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, split: SplitNode) => {
      e.preventDefault();
      const container = splitRefs.current.get(split.id);
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const axis = split.orientation === "row" ? "x" : "y";
      const containerSize = axis === "x" ? rect.width : rect.height;
      const startPos = axis === "x" ? e.clientX : e.clientY;
      const gutter = split.orientation === "row" ? 6 : 6; // px
      setDrag({
        kind: "resize",
        splitId: split.id,
        axis,
        containerSize,
        startPos,
        startSizes: [...split.sizes] as [number, number],
        gutter,
      });
      // UX: show resize cursor and disable selecting text during drag
      document.body.style.userSelect = "none";
      document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
    },
    []
  );

  useEffect(() => {
    function onMove(ev: MouseEvent) {
      if (!drag || drag.kind !== "resize") return;
      const { splitId, axis, containerSize, startPos, startSizes } = drag;
      const pos = axis === "x" ? ev.clientX : ev.clientY;
      const deltaPx = pos - startPos;
      const deltaFrac = containerSize > 0 ? deltaPx / containerSize : 0;
      // Apply to first size, clamp between 0.1 and 0.9 to keep min sizes
      const min = 0.1;
      const max = 0.9;
      let a = startSizes[0] + deltaFrac;
      a = Math.max(min, Math.min(max, a));
      const b = 1 - a;
      dispatch(setSplitSizesAction({ splitId, sizes: [a, b] }));
    }
    function onUp() {
      if (drag && drag.kind === "resize") {
        setDrag(null);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dispatch, drag]);

  // Rearrangement (swap labels/colors) via HTML5 drag and drop between leaf headers
  const onLeafDragStart = useCallback((leafId: string) => {
    setDrag({ kind: "rearrange", sourceLeafId: leafId });
  }, []);

  const onLeafDrop = useCallback(
    (targetLeafId: string) => {
      if (!drag || drag.kind !== "rearrange") return;
      const sourceId = drag.sourceLeafId;
      if (sourceId === targetLeafId) return setDrag(null);

      // Swap labels/colors of the two leaves
      const sourceNode = findNode(root, sourceId);
      const targetNode = findNode(root, targetLeafId);
      if (!sourceNode || !targetNode || !isLeaf(sourceNode) || !isLeaf(targetNode)) {
        setDrag(null);
        return;
      }
      dispatch(rearrangeLeavesAction({ a: sourceId, b: targetLeafId }));
      setDrag(null);
    },
    [dispatch, drag, findNode, root]
  );

  const onLeafDropEdge = useCallback(
    (targetLeafId: string, edge: "top" | "right" | "bottom" | "left") => {
      if (!drag || drag.kind !== "rearrange") return;
      const sourceId = drag.sourceLeafId;
      if (sourceId === targetLeafId) return setDrag(null);

      // Determine orientation based on edge
      const orientation: Orientation = (edge === "left" || edge === "right") ? "row" : "col";
      
      // Move the source leaf to split at the target
      dispatch(moveLeafToSplitAction({ 
        sourceLeafId: sourceId, 
        targetLeafId, 
        orientation 
      }));
      setDrag(null);
    },
    [dispatch, drag]
  );

  // Render
  // Determine canvas dimensions based on viewport mode
  const getCanvasDimensions = () => {
    switch (viewportMode) {
      case "sm": // Mobile (e.g., iPhone 13)
        return { width: "375px", height: "667px", maxWidth: "375px" };
      case "md": // Tablet (e.g., iPad)
        return { width: "768px", height: "1024px", maxWidth: "768px" };
      case "lg": // Desktop (default)
      default:
        return { width: "100%", height: "80vh", maxWidth: "1280px" };
    }
  };

  const canvasDimensions = getCanvasDimensions();

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      {/* Viewport mode selector */}
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1">
        <Button
          variant={viewportMode === "lg" ? "primary" : "ghost"}
          size="sm"
          onClick={() => dispatch(setViewportModeAction("lg"))}
          className="px-4 py-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
          </svg>
          LG
        </Button>
        <Button
          variant={viewportMode === "md" ? "primary" : "ghost"}
          size="sm"
          onClick={() => dispatch(setViewportModeAction("md"))}
          className="px-4 py-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
          </svg>
          MD
        </Button>
        <Button
          variant={viewportMode === "sm" ? "primary" : "ghost"}
          size="sm"
          onClick={() => dispatch(setViewportModeAction("sm"))}
          className="px-4 py-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
          </svg>
          SM
        </Button>
      </div>

      {/* Canvas container with dynamic dimensions */}
      <div 
        className="flex flex-col gap-4 transition-all duration-300 ease-in-out"
        style={{
          width: canvasDimensions.width,
          maxWidth: canvasDimensions.maxWidth,
        }}
      >
        <div 
          className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-inner relative"
          style={{
            height: canvasDimensions.height,
          }}
        >
        {/* Reset button - always visible at top-left */}
        <button
          className="absolute top-2 left-2 p-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-sm font-medium backdrop-blur-sm border border-white/30 transition-all z-50 px-2"
          onClick={reset}
          title="Reset layout"
          aria-label="Reset layout"
        >
          ↻
        </button>

        {isLeaf(root) ? (
          <LeafView
            leaf={root}
            selected={selectedLeafId === root.id}
            onSelect={() => dispatch(selectLeafAction(root.id))}
            onDragStart={() => onLeafDragStart(root.id)}
            onDrop={() => onLeafDrop(root.id)}
            onDropEdge={(edge) => onLeafDropEdge(root.id, edge)}
            onRename={(newLabel) => dispatch(renameLeafAction({ leafId: root.id, newLabel }))}
            onDelete={() => dispatch(removeLeafAction({ leafId: root.id }))}
            onSplit={(orientation) => handleSplit(root.id, orientation)}
          />
        ) : (
          <SplitView
            split={root as SplitNode}
            selectedLeafId={selectedLeafId}
            onSelectLeaf={(id) => dispatch(selectLeafAction(id))}
            onGutterMouseDown={onGutterMouseDown}
            splitRefs={splitRefs}
            onLeafDragStart={onLeafDragStart}
            onLeafDrop={onLeafDrop}
            onLeafDropEdge={onLeafDropEdge}
            onResetSplit={(splitId) => dispatch(resetSplitAction({ splitId }))}
            onRenameLeaf={(leafId, newLabel) => dispatch(renameLeafAction({ leafId, newLabel }))}
            onDeleteLeaf={(leafId) => dispatch(removeLeafAction({ leafId }))}
            onSplitLeaf={handleSplit}
          />
        )}
        </div>
      </div>
    </div>
  );
}