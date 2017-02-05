export interface Node {
  readonly level : number,
  readonly size : number,
  readonly address : number,
  readonly used : boolean,
  readonly left : Node | null,
  readonly right : Node | null
}

export interface Allocation {
  readonly tree : Node,
  readonly address : number,
  readonly size : number,
  readonly addresses : IterableIterator<number>
}

export function allocate(tree : Node, size=1) : Allocation{
  if(tree.size < size || tree.used){
    return {
      tree,
      address: -1,
      size: 0,
      addresses: range(0, 0)
    };
  }

  if(tree.size/2 < size){
    if(tree.left === null && tree.right === null){
      return {
        tree : {
          ...tree,
          used: true
        },
        address: tree.address,
        size: tree.size,
        addresses: range(tree.address, size)
      };
    }else{
      return {
        tree,
        address: -1,
        size: 0,
        addresses: range(0, 0)
      };
    }
  }

  const {tree: left, address, size: allocatedSize, addresses} = allocate(tree.left || createNode(tree.size/2, tree.address), size);
  if(left === tree.left){
    const {tree: right, address, size: allocatedSize, addresses} = allocate(tree.right || createNode(tree.size/2, tree.address + tree.size/2), size);
    if(right === tree.right){
      return {
        tree,
        address: -1,
        size: 0,
        addresses: range(0, 0)
      };
    }else{
      return {
        tree: {
          ...tree,
          used: left.used && right.used,
          left,
          right
        },
        address,
        size,
        addresses
      };
    }
  }

  return {
    tree: {
      ...tree,
      used: left.used && tree.right != null && tree.right.used,
      left,
      right: tree.right
    },
    address,
    size,
    addresses
  };
}

export function deallocate(tree : Node | null, address : number) : Node | null{
  if(tree === null){
    return null;
  }

  let left = tree.left;
  let right = tree.right;
  if(address < tree.size/2){
    left = deallocate(tree.left, address);
  }else{
    right = deallocate(tree.right, address - tree.size/2);
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

export function createNode(size : number, address=0){
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

export function* range(from : number, size : number){
  for(let x=from; x<from+size; x++){
    yield x;
  }
}