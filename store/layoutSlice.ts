import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Orientation = "row" | "col";

export type LeafNode = {
  id: string;
  type: "leaf";
  label: string;
  color: string;
};

export type SplitNode = {
  id: string;
  type: "split";
  orientation: Orientation;
  sizes: [number, number];
  children: [NodeModel, NodeModel];
};

export type NodeModel = LeafNode | SplitNode;

export type LayoutState = {
  root: NodeModel;
  selectedLeafId: string | null;
  nextOrientation: Orientation;
  idSeq: number; // for generating sequential leaf labels (Div 1, Div 2, ...)
  splitSeq: number; // independent counter for split node ids
};

export function isSplit(n: NodeModel): n is SplitNode {
  return n.type === "split";
}
export function isLeaf(n: NodeModel): n is LeafNode {
  return n.type === "leaf";
}

const palette = [
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#f59e0b",
  "#a78bfa",
  "#f87171",
  "#22d3ee",
];
function randomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

export const LAYOUT_PERSIST_KEY = "layout-state-v1";

function validateState(obj: any): obj is LayoutState {
  if (!obj) return false;
  if (typeof obj !== "object") return false;
  if (!obj.root) return false;
  if (!("idSeq" in obj) || !("splitSeq" in obj)) return false;
  return true;
}

function loadPersistedState(): LayoutState | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem(LAYOUT_PERSIST_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (validateState(parsed)) return parsed;
  } catch (e) {
    // ignore corrupt data
    console.warn("Ignoring corrupted layout state in localStorage");
  }
  return undefined;
}

function defaultState(): LayoutState {
  return {
    root: { id: "root", type: "leaf", label: "Div 1", color: randomColor() },
    selectedLeafId: "root",
    nextOrientation: "row",
    idSeq: 2,
    splitSeq: 1,
  };
}

function initState(): LayoutState {
  const persisted = loadPersistedState();
  if (persisted) return persisted;
  return defaultState();
}

// Utilities to update/find nodes in tree
function updateNode(current: NodeModel, id: string, updater: (n: NodeModel) => NodeModel): NodeModel {
  if (current.id === id) return updater(current);
  if (isSplit(current)) {
    return {
      ...current,
      children: [
        updateNode(current.children[0], id, updater),
        updateNode(current.children[1], id, updater),
      ],
    };
  }
  return current;
}

function findNode(n: NodeModel, id: string): NodeModel | null {
  if (n.id === id) return n;
  if (isSplit(n)) return findNode(n.children[0], id) ?? findNode(n.children[1], id);
  return null;
}

const layoutSlice = createSlice({
  name: "layout",
  initialState: initState(),
  reducers: {
    selectLeaf(state, action: PayloadAction<string>) {
      state.selectedLeafId = action.payload;
    },
    toggleNextOrientation(state) {
      state.nextOrientation = state.nextOrientation === "row" ? "col" : "row";
    },
    reset(state) {
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(LAYOUT_PERSIST_KEY);
        } catch {}
      }
      const s = defaultState();
      state.root = s.root;
      state.selectedLeafId = s.selectedLeafId;
      state.nextOrientation = s.nextOrientation;
      state.idSeq = s.idSeq;
      state.splitSeq = s.splitSeq;
    },
    splitSelected(state) {
      const sel = state.selectedLeafId;
      if (!sel) return;
      const target = findNode(state.root, sel);
      if (!target || !isLeaf(target)) return;
      const newLeaf: LeafNode = {
        id: `leaf-${state.idSeq}`,
        type: "leaf",
        label: `Div ${state.idSeq}`,
        color: randomColor(),
      };
      state.idSeq += 1;
      state.root = updateNode(state.root, sel, (n) => {
        if (!isLeaf(n)) return n;
        const first: LeafNode = { ...n };
        const split: SplitNode = {
          id: `split-${state.splitSeq}`,
          type: "split",
          orientation: state.nextOrientation,
          sizes: [0.5, 0.5],
          children: [first, newLeaf],
        };
        state.splitSeq += 1; // advance split id counter only
        return split;
      });
    },
    setSplitSizes(
      state,
      action: PayloadAction<{ splitId: string; sizes: [number, number] }>
    ) {
      const { splitId, sizes } = action.payload;
      state.root = updateNode(state.root, splitId, (n) => (isSplit(n) ? { ...n, sizes } : n));
    },
    resetSplit(state, action: PayloadAction<{ splitId: string }>) {
      const { splitId } = action.payload;
      state.root = updateNode(state.root, splitId, (n) => (isSplit(n) ? { ...n, sizes: [0.5, 0.5] } : n));
    },
    rearrangeLeaves(state, action: PayloadAction<{ a: string; b: string }>) {
      const { a, b } = action.payload;
      if (a === b) return;
      const na = findNode(state.root, a);
      const nb = findNode(state.root, b);
      if (!na || !nb || !isLeaf(na) || !isLeaf(nb)) return;
      const tLabel = na.label;
      const tColor = na.color;
      state.root = updateNode(state.root, a, (n) => (isLeaf(n) ? { ...n, label: nb.label, color: nb.color } : n));
      state.root = updateNode(state.root, b, (n) => (isLeaf(n) ? { ...n, label: tLabel, color: tColor } : n));
    },
    renameLeaf(state, action: PayloadAction<{ leafId: string; newLabel: string }>) {
      const { leafId, newLabel } = action.payload;
      state.root = updateNode(state.root, leafId, (n) => (isLeaf(n) ? { ...n, label: newLabel } : n));
    },
    removeLeaf(state, action: PayloadAction<{ leafId: string }>) {
      const { leafId } = action.payload;

      // If root is the only leaf, do not remove (ensure at least one pane)
      if (state.root.id === leafId && isLeaf(state.root)) {
        return; // ignore removing the last remaining pane
      }

      function prune(node: NodeModel): NodeModel | null {
        if (isLeaf(node)) {
          return node.id === leafId ? null : node;
        }
        // split
        const left = prune(node.children[0]);
        const right = prune(node.children[1]);
        if (left && right) {
          // both remain
          return { ...node, children: [left, right] as [NodeModel, NodeModel] };
        }
        if (left && !right) return left; // collapse
        if (!left && right) return right; // collapse
        return null; // both removed (should not practically happen)
      }

      const newRoot = prune(state.root);
      if (!newRoot) return;
      state.root = newRoot;

      // Maintain a valid selectedLeafId
      if (state.selectedLeafId === leafId) {
        // find first leaf
        function firstLeaf(n: NodeModel): string | null {
          if (isLeaf(n)) return n.id;
            return firstLeaf(n.children[0]) ?? firstLeaf(n.children[1]);
        }
        state.selectedLeafId = firstLeaf(state.root);
      }
    },
  },
});

export const {
  selectLeaf,
  toggleNextOrientation,
  reset,
  splitSelected,
  setSplitSizes,
  resetSplit,
  rearrangeLeaves,
  renameLeaf,
  removeLeaf,
} = layoutSlice.actions;

export default layoutSlice.reducer;