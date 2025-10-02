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
  idSeq: number; // for generating labels/ids
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

function initState(): LayoutState {
  return {
    root: { id: "root", type: "leaf", label: "Div 1", color: randomColor() },
    selectedLeafId: "root",
    nextOrientation: "row",
    idSeq: 2, // next new leaf label will be Div 2
  };
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
      const s = initState();
      state.root = s.root;
      state.selectedLeafId = s.selectedLeafId;
      state.nextOrientation = s.nextOrientation;
      state.idSeq = s.idSeq;
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
          id: `split-${state.idSeq}`,
          type: "split",
          orientation: state.nextOrientation,
          sizes: [0.5, 0.5],
          children: [first, newLeaf],
        };
        state.idSeq += 1;
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
} = layoutSlice.actions;

export default layoutSlice.reducer;