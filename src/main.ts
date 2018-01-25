import { Allocation, Node, OldNode } from './types';
import createNode from './createNode';
import allocate from './allocate';
import deallocate, { deallocateUnsafe } from './deallocate';
import range from './range';
import modernize from './modernize';

export { Allocation, Node };
export { createNode, createNode as createTree };
export { allocate };
export { deallocate, deallocateUnsafe };
export { range };
export { modernize };