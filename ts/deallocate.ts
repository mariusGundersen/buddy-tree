import { Node } from './types';
import createNode from './createNode';
import modernize from './modernize';

export default function deallocate(tree: Node, address: number): Node {
  if (address < 0) {
    return modernize(tree);
  }
  return deallocateUnsafe(modernize(tree), address) || createNode(tree.size);
}

export function deallocateUnsafe(tree: Node, address: number): Node | null {
  if (tree === null) {
    return null;
  }

  let left = tree.left;
  let right = tree.right;
  if (address < tree.size / 2) {
    left = tree.left && deallocateUnsafe(tree.left, address);
  } else {
    right = tree.right && deallocateUnsafe(tree.right, address - tree.size / 2);
  }

  if (left === null && right === null) {
    return null;
  }

  const used = left != null && left.used && right != null && right.used ? true : false;
  const usedSize = (left != null ? left.usedSize || 0 : 0) + (right != null ? right.usedSize || 0 : 0);
  const maxBlock = left == null || right == null ? tree.size / 2 : Math.max(left.maxBlock, right.maxBlock);

  return {
    ...tree,
    usedSize,
    used,
    maxBlock,
    left,
    right
  };
}
