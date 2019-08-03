import { OldNode, Node } from "./types";

export default function modernize(node: OldNode | Node): Node {
  if (isModern(node)) return node;

  const left = node.left ? modernize(node.left) : null;
  const right = node.right ? modernize(node.right) : null;

  return {
    ...node,
    left,
    right,
    maxBlock: left == null && right == null ? 0 :
      left == null || right == null ? node.size / 2 :
        Math.max(left.maxBlock, right.maxBlock)
  }
}

function isModern(node: OldNode | Node): node is Node {
  return node.maxBlock !== undefined;
}
