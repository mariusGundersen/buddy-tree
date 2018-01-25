import { Allocation, Node } from './types';

export default function createNode(size : number, address=0) : Node {
  const level = log2(size);
  return {
    used: false,
    maxBlock: size,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    usedSize: 0,
    address: address
  };
}

export function log2(x : number){
  return Math.ceil(Math.log(x)/Math.LN2);
}