import { Allocation, Node } from './types';
import createNode from './createNode';

export default function deallocate(tree : Node, address : number) : Node {
  return deallocateUnsafe(tree, address) || createNode(tree.size);
}

export function deallocateUnsafe(tree : Node, address : number) : Node | null{
  if(tree === null){
    return null;
  }

  let left = tree.left;
  let right = tree.right;
  if(address < tree.size/2){
    left = tree.left && deallocateUnsafe(tree.left, address);
  }else{
    right = tree.right && deallocateUnsafe(tree.right, address - tree.size/2);
  }

  if(left === null && right === null){
    return null;
  }

  const used = left != null && left.used && right != null && right.used ? true : false;

  return {
    ...tree,
    used,
    left,
    right
  };
}
