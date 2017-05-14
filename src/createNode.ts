import { Allocation, Node } from './types';

export default function createNode(size : number, address=0){
  return createFromLevel(log2(size), address);
}

export function createTree(size : number, address=0){
  return createFromLevel(log2(size), address);
}

export function createFromLevel(level : number, address=0) : Node{
  return {
    used: false,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    address: address
  };
}

export function log2(x : number){
  return Math.ceil(Math.log(x)/Math.LN2);
}