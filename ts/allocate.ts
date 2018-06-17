import { Allocation, Node, OldNode } from './types';
import createNode from './createNode';
import modernize from './modernize';

export default function allocate(tree : Node | OldNode, size=1) : Allocation {
  if(size <= 0){
    return {
      tree: modernize(tree),
      address: -1,
      count: 0,
      size: 0
    };
  }
  return unsafeAllocate(modernize(tree), size);
}

function unsafeAllocate(tree : Node, size=1) : Allocation {
  if(size > tree.maxBlock){
    return {
      tree,
      address: -1,
      count: 0,
      size: 0
    };
  }

  if(tree.size/2 < size){
    if(tree.left === null && tree.right === null){
      return {
        tree : {
          ...tree,
          usedSize: size,
          maxBlock: 0,
          used: true
        },
        address: tree.address,
        count: size,
        size: tree.size
      };
    }else{
      return {
        tree,
        address: -1,
        count: 0,
        size: 0
      };
    }
  }

  if(!tree.left || tree.left.maxBlock >= size){
    const {tree: left, address, size: allocatedSize, count} = unsafeAllocate(tree.left || createNode(tree.size/2, tree.address), size);
    return {
      tree: {
        ...tree,
        used: left.used && tree.right != null && tree.right.used,
        usedSize: left.usedSize + (tree.right != null ? tree.right.usedSize || 0 : 0),
        maxBlock: Math.max(left.maxBlock, tree.right ? tree.right.maxBlock : tree.size/2),
        left
      },
      address,
      count,
      size: allocatedSize
    };
  }

  const {tree: right, address, size: allocatedSize, count} = unsafeAllocate(tree.right || createNode(tree.size/2, tree.address + tree.size/2), size);
  return {
    tree: {
      ...tree,
      used: tree.left.used && right.used,
      usedSize: (tree.left.usedSize||0) + (right.usedSize||0),
      maxBlock: Math.max(tree.left.maxBlock, right.maxBlock),
      right
    },
    address,
    count,
    size: allocatedSize
  };
}