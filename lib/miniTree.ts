import type { LeafNode, NodeModel, Orientation, SplitNode } from "@/store/layoutSlice";

/**
 * Pure edits over a layout tree, for UI that has no Redux store behind it (the
 * landing page demo). Mirrors the builder's slice semantics: ratios clamp to
 * 0.1–0.9, deleting a pane collapses its parent split, the root pane is protected.
 */

let seq = 0;

export function makeLeaf(label: string): LeafNode {
  seq += 1;
  return { id: `mini-leaf-${seq}`, type: "leaf", label, color: "#85847e" };
}

function makeSplit(
  orientation: Orientation,
  children: [NodeModel, NodeModel]
): SplitNode {
  seq += 1;
  return { id: `mini-split-${seq}`, type: "split", orientation, sizes: [0.5, 0.5], children };
}

export function firstLeafId(node: NodeModel): string {
  return node.type === "leaf" ? node.id : firstLeafId(node.children[0]);
}

export function isLeafId(node: NodeModel, id: string): boolean {
  if (node.id === id) return node.type === "leaf";
  return node.type === "split"
    ? isLeafId(node.children[0], id) || isLeafId(node.children[1], id)
    : false;
}

export function replaceNode(
  node: NodeModel,
  id: string,
  update: (target: NodeModel) => NodeModel
): NodeModel {
  if (node.id === id) return update(node);
  if (node.type === "leaf") return node;
  return {
    ...node,
    children: [
      replaceNode(node.children[0], id, update),
      replaceNode(node.children[1], id, update),
    ],
  };
}

export function resizeSplit(node: NodeModel, id: string, sizes: [number, number]): NodeModel {
  return replaceNode(node, id, (target) =>
    target.type === "split" ? { ...target, sizes } : target
  );
}

export function resetSplit(node: NodeModel, id: string): NodeModel {
  return resizeSplit(node, id, [0.5, 0.5]);
}

/** Splits a leaf in two. Returns the new tree and the id of the added pane. */
export function splitLeaf(
  root: NodeModel,
  leafId: string,
  orientation: Orientation,
  label: string
): { root: NodeModel; newLeafId: string } {
  const added = makeLeaf(label);
  return {
    root: replaceNode(root, leafId, (target) =>
      target.type === "leaf" ? makeSplit(orientation, [target, added]) : target
    ),
    newLeafId: added.id,
  };
}

export function removeLeaf(root: NodeModel, leafId: string): NodeModel | null {
  if (root.type === "leaf") return root.id === leafId ? null : root;

  const prune = (node: NodeModel): NodeModel | null => {
    if (node.type === "leaf") return node.id === leafId ? null : node;
    const left = prune(node.children[0]);
    const right = prune(node.children[1]);
    if (left && right) return { ...node, children: [left, right] };
    return left ?? right;
  };

  return prune(root);
}

export function renameLeaf(root: NodeModel, leafId: string, label: string): NodeModel {
  return replaceNode(root, leafId, (target) =>
    target.type === "leaf" ? { ...target, label } : target
  );
}
