import { Allocation, Node } from './types';
import createNode from './createNode';

export default function allocate(tree : Node, size=1) : Allocation{
  if(tree.size < size || tree.used){
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

  const {tree: left, address, size: allocatedSize, count} = allocate(tree.left || createNode(tree.size/2, tree.address), size);
  if(left === tree.left){
    const {tree: right, address, size: allocatedSize, count} = allocate(tree.right || createNode(tree.size/2, tree.address + tree.size/2), size);
    if(right === tree.right){
      return {
        tree,
        address: -1,
        count: 0,
        size: 0
      };
    }else{
      return {
        tree: {
          ...tree,
          used: left.used && right.used,
          usedSize: (left.usedSize||0) + (right.usedSize||0),
          left,
          right
        },
        address,
        count,
        size: allocatedSize
      };
    }
  }

  return {
    tree: {
      ...tree,
      used: left.used && tree.right != null && tree.right.used,
      usedSize: left.usedSize + (tree.right != null ? tree.right.usedSize || 0 : 0),
      left,
      right: tree.right
    },
    address,
    count,
    size: allocatedSize
  };
}